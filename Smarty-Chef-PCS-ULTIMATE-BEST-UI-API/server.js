const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files from root directory

const PORT = process.env.PORT || 3000;
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || 'YOUR_API_KEY_HERE';

// Helper function to transform Spoonacular recipe data
function transformRecipe(recipe) {
  const ingredients = recipe.extendedIngredients 
    ? recipe.extendedIngredients.map(i => i.original)
    : [];
  let instructions = [];
  if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
    instructions = recipe.analyzedInstructions[0].steps.map(s => s.step);
  } else if (recipe.instructions) {
    instructions = recipe.instructions.split(/[\r\n]+/).filter(i => i.trim());
  }
  const description = recipe.summary 
    ? recipe.summary.replace(/<[^>]*>/g, '').substring(0, 200) + '...' 
    : 'A delicious recipe made with your selected ingredients.';
  
  return {
    title: recipe.title || 'Delicious Recipe',
    description,
    ingredients,
    instructions,
    time: recipe.readyInMinutes ? `${recipe.readyInMinutes} minutes` : '',
    dietary_labels: [
      recipe.vegetarian ? 'Vegetarian' : null,
      recipe.vegan ? 'Vegan' : null,
      recipe.glutenFree ? 'Gluten-Free' : null,
      recipe.dairyFree ? 'Dairy-Free' : null,
      recipe.veryHealthy ? 'Healthy' : null,
      ...(recipe.dishTypes || []),
      ...(recipe.cuisines || [])
    ].filter(Boolean),
    category: recipe.dishTypes ? recipe.dishTypes[0] : 'Main Course',
    servings: recipe.servings ? recipe.servings.toString() : '',
    image: recipe.image || '',
    sourceUrl: recipe.sourceUrl || '',
    spoonacularScore: recipe.spoonacularScore || 0,
    healthScore: recipe.healthScore || 0
  };
}

// Fallback recipe when API call fails or no recipes found
function createFallbackRecipe(ingredients, dietaryPreference) {
  const mainIngredient = ingredients[0] || 'ingredients';
  const cuisineHint = dietaryPreference === 'indian' ? 'Indian-Style ' : '';
  return {
    title: `${cuisineHint}${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Delight`,
    description: `A delicious homemade ${cuisineHint.toLowerCase()} dish featuring ${ingredients.slice(0, 3).join(', ')}`,
    ingredients: [
      ...ingredients.map(ing => `1-2 portions ${ing}`),
      "Salt and pepper to taste",
      "2 tbsp cooking oil",
      "Fresh herbs (optional)",
      "Spices as needed"
    ],
    instructions: [
      "Wash and prepare all ingredients",
      `Heat oil, add ${ingredients[0]}, cook until golden`,
      ingredients.length > 1 ? `Add ${ingredients.slice(1).join(', ')} and cook 5-7 mins` : "Continue cooking for 5-7 minutes",
      "Season with salt, pepper, and spices",
      dietaryPreference === 'indian' ? "Add turmeric, cumin, garam masala" : "Add herbs and spices as desired",
      "Cook until tender and combined",
      "Serve hot and enjoy!"
    ],
    time: "25-30 minutes",
    dietary_labels: dietaryPreference ? [dietaryPreference] : ["Homemade"],
    category: "Main Course",
    servings: "2-4",
    image: '',
    sourceUrl: '',
    spoonacularScore: 0,
    healthScore: 0
  };
}

// Recipe generation endpoint
app.post('/generate-recipe', async (req, res) => {
  try {
    const { ingredients = [], dietaryPreference = '', allergies = '' } = req.body;

    if (!ingredients.length) {
      return res.status(400).json({ error: 'Please provide at least one ingredient', recipes: [] });
    }

    const fetch = (await import('node-fetch')).default;

    const ingredientsString = ingredients.join(',+');
    const searchUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=8&ranking=2&ignorePantry=true&apiKey=${SPOONACULAR_API_KEY}`;

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) throw new Error(`Spoonacular search failed: ${searchResponse.status}`);

    const foundRecipes = await searchResponse.json();
    if (!foundRecipes.length) {
      return res.json({ recipes: [createFallbackRecipe(ingredients, dietaryPreference)], apiSource: 'Fallback', message: 'No matches found, showing fallback recipe' });
    }

    const detailedRecipes = await Promise.all(
      foundRecipes.slice(0, 5).map(async recipe => {
        try {
          const detailUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=false&apiKey=${SPOONACULAR_API_KEY}`;
          const detailResponse = await fetch(detailUrl);
          if (!detailResponse.ok) return null;
          const detailData = await detailResponse.json();
          return transformRecipe(detailData);
        } catch {
          return null;
        }
      })
    );

    let validRecipes = detailedRecipes.filter(r => r !== null);

    if (dietaryPreference) {
      const preference = dietaryPreference.toLowerCase().replace('-', ' ');
      validRecipes = validRecipes.filter(recipe =>
        recipe.dietary_labels.some(label => label.toLowerCase().includes(preference))
      );
    }

    if (allergies) {
      const allergensList = allergies.split(',').map(a => a.trim().toLowerCase());
      validRecipes = validRecipes.filter(recipe => {
        const recipeText = (recipe.title + ' ' + recipe.ingredients.join(' ')).toLowerCase();
        return !allergensList.some(allergen => recipeText.includes(allergen));
      });
    }

    if (!validRecipes.length) {
      validRecipes = [createFallbackRecipe(ingredients, dietaryPreference)];
    }

    res.json({ recipes: validRecipes, apiSource: 'Spoonacular', totalFound: foundRecipes.length, afterFiltering: validRecipes.length });
  } catch (error) {
    const { ingredients = [], dietaryPreference = '' } = req.body;
    res.json({
      recipes: [createFallbackRecipe(ingredients, dietaryPreference)],
      apiSource: 'Fallback',
      error: error.message,
      message: 'API unavailable, showing fallback recipe'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: "✅ Smarty-Chef.PCS Server Running!",
    timestamp: new Date().toISOString(),
    apiKeyStatus: SPOONACULAR_API_KEY ? "✅ Configured" : "❌ Missing",
    version: "2.0.0"
  });
});

// Spoonacular API status endpoint
app.get('/api-status', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const testUrl = `https://api.spoonacular.com/recipes/random?number=1&apiKey=${SPOONACULAR_API_KEY}`;
    const response = await fetch(testUrl);
    res.json({
      spoonacularAPI: response.ok ? "✅ Connected" : "❌ Failed",
      statusCode: response.status,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.json({
      spoonacularAPI: "❌ Connection Failed",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Serve frontend index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    availableEndpoints: ['GET /', 'POST /generate-recipe', 'GET /health', 'GET /api-status'],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Smarty-Chef.PCS Server started on port ${PORT}`);
  console.log(`💻 Open http://localhost:${PORT}`);
  console.log(`🔑 API key is ${SPOONACULAR_API_KEY ? 'configured' : 'missing'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 Server shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 Server shutting down...');
  process.exit(0);
});
