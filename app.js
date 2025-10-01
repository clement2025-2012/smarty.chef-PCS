// Smarty-Chef.PCS v2.0 - Enhanced with Spoonacular API and Best UI
document.addEventListener('DOMContentLoaded', () => {
  console.log('🍳 Smarty-Chef.PCS v2.0 initializing...');

  // Navigation functionality
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  function showPage(targetPage) {
    // Hide all pages
    pages.forEach(page => {
      page.classList.remove('active');
      if (page.id === targetPage + '-page') {
        page.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    // Update nav active states
    [...navLinks, ...mobileNavLinks].forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === targetPage) {
        link.classList.add('active');
      }
    });

    // Close mobile menu
    if (mobileMenu) {
      mobileMenu.classList.remove('active');
    }
  }

  // Add click handlers to navigation links
  [...navLinks, ...mobileNavLinks].forEach(link => {
    if (link.dataset.page) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(link.dataset.page);
      });
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }

  // Enhanced ingredients list with Indian spices and comprehensive selection
  const allIngredients = [
    // Proteins
    "Chicken", "Chicken Breast", "Chicken Thighs", "Mutton", "Lamb", "Beef", "Fish", "Salmon", 
    "Prawns", "Eggs", "Paneer", "Tofu", "Turkey", "Duck",

    // Grains & Staples
    "Basmati Rice", "Brown Rice", "Quinoa", "Bulgur", "Wheat Flour", "All-Purpose Flour", 
    "Semolina", "Bread", "Naan", "Roti", "Pasta", "Noodles",

    // Vegetables - Common
    "Onions", "Red Onions", "Garlic", "Ginger", "Tomatoes", "Bell Peppers", "Green Chilies", 
    "Potatoes", "Sweet Potatoes", "Carrots", "Celery", "Cucumber",

    // Vegetables - Indian/Asian
    "Okra", "Eggplant", "Bitter Gourd", "Bottle Gourd", "Drumsticks", "Curry Leaves",
    "Coriander Leaves", "Mint Leaves", "Spinach", "Fenugreek Leaves",

    // Vegetables - Others
    "Broccoli", "Cauliflower", "Green Beans", "Peas", "Corn", "Mushrooms", "Zucchini",

    // Legumes & Beans  
    "Chickpeas", "Black Lentils", "Red Lentils", "Yellow Lentils", "Kidney Beans", 
    "Black Beans", "Green Moong", "Pigeon Peas",

    // Indian Spices - Essential
    "Turmeric", "Cumin", "Coriander Seeds", "Mustard Seeds", "Fennel Seeds", "Cardamom",
    "Cinnamon", "Cloves", "Bay Leaves", "Asafoetida", "Red Chili Powder", "Garam Masala",

    // International Spices
    "Black Pepper", "Paprika", "Oregano", "Thyme", "Rosemary", "Basil", "Parsley",
    "Saffron", "Vanilla", "Nutmeg",

    // Dairy & Alternatives
    "Milk", "Yogurt", "Heavy Cream", "Butter", "Ghee", "Cheese", "Mozzarella", 
    "Cheddar", "Parmesan", "Coconut Milk",

    // Oils & Fats
    "Olive Oil", "Vegetable Oil", "Coconut Oil", "Sesame Oil", "Mustard Oil",

    // Fruits
    "Lemons", "Limes", "Tomatoes", "Coconut", "Mango", "Banana", "Apples", "Onions",

    // Nuts & Seeds
    "Almonds", "Cashews", "Peanuts", "Sesame Seeds", "Poppy Seeds",

    // Sweeteners & Others
    "Sugar", "Jaggery", "Honey", "Salt", "Vinegar", "Soy Sauce", "Tamarind"
  ];

  let selectedIngredients = [];
  let userAllergies = [];

  const ingredientOptions = document.getElementById('ingredientOptions');
  const selectedPills = document.getElementById('selectedIngredients');
  const searchInput = document.getElementById('ingredientSearch');

  function renderIngredients(filterText = '') {
    if (!ingredientOptions) return;

    ingredientOptions.innerHTML = '';
    const filtered = allIngredients.filter(ingredient => 
      ingredient.toLowerCase().includes(filterText.toLowerCase()) &&
      !userAllergies.some(allergy => ingredient.toLowerCase().includes(allergy.toLowerCase()))
    );

    filtered.forEach(ingredient => {
      const div = document.createElement('div');
      div.className = 'ingredient-option';
      if (selectedIngredients.includes(ingredient)) {
        div.classList.add('selected');
      }
      div.textContent = ingredient;
      div.addEventListener('click', () => toggleIngredient(ingredient));
      ingredientOptions.appendChild(div);
    });
  }

  function toggleIngredient(ingredient) {
    if (selectedIngredients.includes(ingredient)) {
      selectedIngredients = selectedIngredients.filter(i => i !== ingredient);
    } else {
      selectedIngredients.push(ingredient);
    }
    renderIngredients(searchInput ? searchInput.value : '');
    renderSelectedPills();
    saveUserPreferences();
  }

  function renderSelectedPills() {
    if (!selectedPills) return;

    selectedPills.innerHTML = '';

    if (selectedIngredients.length === 0) {
      selectedPills.innerHTML = '<p style="color: #666; font-style: italic; text-align: center; padding: 2rem;">No ingredients selected yet. Click on ingredients above to start!</p>';
      return;
    }

    selectedIngredients.forEach(ingredient => {
      const pill = document.createElement('div');
      pill.className = 'pill';
      pill.innerHTML = `
        ${ingredient}
        <span class="remove-btn" onclick="removeIngredient('${ingredient}')">&times;</span>
      `;
      selectedPills.appendChild(pill);
    });
  }

  // Make removeIngredient available globally
  window.removeIngredient = function(ingredient) {
    toggleIngredient(ingredient);
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderIngredients(e.target.value);
    });
  }

  // Enhanced demo recipes with Spoonacular-style data
  const demoRecipes = [
    {
      title: "Butter Chicken (Murgh Makhani)",
      description: "Creamy and rich chicken curry in aromatic tomato-based sauce with authentic Indian spices",
      ingredients: [
        "500g chicken breast, cut into cubes",
        "2 large onions, finely chopped", 
        "4 large tomatoes, pureed",
        "4 cloves garlic, minced",
        "1 inch ginger, grated",
        "2 tbsp butter",
        "1/2 cup heavy cream",
        "1 tsp garam masala",
        "1 tsp cumin powder",
        "1 tsp coriander powder",
        "1/2 tsp turmeric",
        "1 tsp red chili powder",
        "Salt to taste"
      ],
      instructions: [
        "Marinate chicken with yogurt, ginger-garlic paste, and spices for 30 minutes",
        "Heat oil in a pan and cook marinated chicken until golden brown",
        "In the same pan, melt butter and sauté onions until golden",
        "Add tomato puree and cook until oil separates",
        "Add all spices and cook for 2 minutes",
        "Return chicken to pan and add cream",
        "Simmer for 10 minutes until sauce thickens",
        "Garnish with cilantro and serve hot"
      ],
      time: "45 minutes",
      dietary_labels: ["Indian", "Non-Vegetarian"],
      category: "Main Course",
      servings: "4-6"
    },
    {
      title: "Palak Paneer",
      description: "Creamy spinach curry with soft cottage cheese cubes, flavored with aromatic Indian spices",
      ingredients: [
        "500g fresh spinach leaves",
        "200g paneer, cubed",
        "2 onions, chopped",
        "3 tomatoes, chopped",
        "4 cloves garlic",
        "1 inch ginger",
        "2 green chilies",
        "1 tsp cumin seeds",
        "1 tsp garam masala",
        "1/2 tsp turmeric",
        "1 tsp red chili powder",
        "2 tbsp cream",
        "Salt to taste"
      ],
      instructions: [
        "Blanch spinach leaves in boiling water for 2 minutes",
        "Blend blanched spinach into a smooth puree",
        "Heat oil and lightly fry paneer cubes until golden",
        "In same pan, add cumin seeds and sauté onions",
        "Add ginger-garlic paste and cook for 2 minutes",
        "Add tomatoes and cook until soft",
        "Add spinach puree and all spices",
        "Simmer for 10 minutes, add paneer and cream",
        "Serve hot with rice or roti"
      ],
      time: "35 minutes",
      dietary_labels: ["Vegetarian", "Indian"],
      category: "Main Course", 
      servings: "4"
    },
    {
      title: "Chicken Biryani",
      description: "Aromatic basmati rice layered with spiced chicken and cooked to perfection",
      ingredients: [
        "500g basmati rice",
        "750g chicken, cut into pieces",
        "2 large onions, sliced",
        "1 cup yogurt",
        "2 tsp ginger-garlic paste",
        "1 tsp red chili powder",
        "1/2 tsp turmeric",
        "1 tsp garam masala",
        "4-5 green cardamom",
        "2 black cardamom",
        "4 cloves",
        "2 bay leaves",
        "1 cinnamon stick",
        "Mint and coriander leaves",
        "Saffron soaked in warm milk"
      ],
      instructions: [
        "Marinate chicken with yogurt, ginger-garlic paste, and spices for 1 hour",
        "Deep fry onions until golden brown and crispy",
        "Cook marinated chicken until 70% done",
        "Boil rice with whole spices until 70% cooked",
        "Layer rice and chicken alternately in a heavy-bottomed pot",
        "Sprinkle fried onions, mint, coriander, and saffron milk",
        "Cover with foil and lid, cook on high heat for 3 minutes",
        "Reduce heat and cook for 45 minutes",
        "Let it rest for 10 minutes before serving"
      ],
      time: "90 minutes",
      dietary_labels: ["Indian", "Non-Vegetarian"],
      category: "Main Course",
      servings: "6-8"
    }
  ];

  // Recipe generation with Spoonacular API integration
  const generateBtn = document.getElementById('generateBtn');
  const saveAllBtn = document.getElementById('saveAllBtn');
  const clearBtn = document.getElementById('clearBtn');
  const recipesDiv = document.getElementById('recipes');

  if (generateBtn) {
    generateBtn.addEventListener('click', async () => {
      if (selectedIngredients.length === 0) {
        showNotification('🥘 Please select at least one ingredient!', 'warning');
        return;
      }

      const dietSelect = document.getElementById('diet');
      const allergiesInput = document.getElementById('allergies');
      const diet = dietSelect ? dietSelect.value : '';
      const allergies = allergiesInput ? allergiesInput.value : '';

      if (recipesDiv) {
        recipesDiv.innerHTML = '<div class="loading">🔍 <br><h3>Searching for delicious recipes...</h3><p>Using your selected ingredients with Spoonacular API</p></div>';
      }

      console.log('Generating recipes for:', selectedIngredients, 'Diet:', diet, 'Allergies:', allergies);

      let recipes = [];
      let apiSuccess = false;

      // Try Spoonacular API first
      try {
        const response = await fetch('/generate-recipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ingredients: selectedIngredients,
            dietaryPreference: diet,
            allergies: allergies
          })
        });

        if (response.ok) {
          const data = await response.json();
          recipes = data.recipes || [];
          if (recipes.length > 0) {
            apiSuccess = true;
            console.log('✅ Spoonacular API recipes received:', recipes.length);
          }
        } else {
          throw new Error(`API response status: ${response.status}`);
        }

      } catch (error) {
        console.log('❌ API call failed, using demo recipes:', error.message);
        apiSuccess = false;

        // Smart recipe matching for demo recipes
        recipes = demoRecipes.filter(recipe => {
          return selectedIngredients.some(selected => 
            recipe.ingredients.some(ingredient => 
              ingredient.toLowerCase().includes(selected.toLowerCase()) ||
              selected.toLowerCase().includes(ingredient.toLowerCase()) ||
              recipe.title.toLowerCase().includes(selected.toLowerCase())
            )
          );
        });

        // If no matches, show all demo recipes
        if (recipes.length === 0) {
          recipes = demoRecipes;
        }

        // Apply dietary filter
        if (diet && recipes.length > 0) {
          const filteredRecipes = recipes.filter(recipe => 
            recipe.dietary_labels.some(label => 
              label.toLowerCase().includes(diet.toLowerCase().replace('-', ' '))
            )
          );
          if (filteredRecipes.length > 0) {
            recipes = filteredRecipes;
          }
        }

        recipes = recipes.slice(0, 3); // Limit to 3 demo recipes
      }

      // Display recipes after a short delay for better UX
      setTimeout(() => {
        displayRecipes(recipes, apiSuccess);
        if (apiSuccess) {
          showNotification('🎉 Fresh recipes from Spoonacular!', 'success');
        } else {
          showNotification('📱 Showing demo recipes - Start server for live API!', 'info');
        }
      }, 1500);
    });
  }

  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', () => {
      const recipeCards = document.querySelectorAll('.recipe-card');
      if (recipeCards.length === 0) {
        showNotification('📋 No recipes to save! Generate some first.', 'warning');
        return;
      }

      const recipes = [];
      recipeCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent || '';
        const description = card.querySelector('p')?.textContent || '';
        const ingredients = Array.from(card.querySelectorAll('ul li')).map(li => li.textContent);
        const instructions = Array.from(card.querySelectorAll('ol li')).map(li => li.textContent);

        if (title) {
          recipes.push({ 
            title, 
            description, 
            ingredients, 
            instructions, 
            savedAt: new Date().toISOString(),
            savedIngredients: [...selectedIngredients]
          });
        }
      });

      if (recipes.length > 0) {
        const existingSaved = JSON.parse(localStorage.getItem('smarty_chef_saved_recipes') || '[]');
        const allRecipes = [...existingSaved, ...recipes];

        localStorage.setItem('smarty_chef_saved_recipes', JSON.stringify(allRecipes));
        showNotification(`💾 Saved ${recipes.length} recipe(s) to your cookbook!`, 'success');
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      selectedIngredients = [];
      renderIngredients();
      renderSelectedPills();
      if (recipesDiv) recipesDiv.innerHTML = '';
      if (searchInput) searchInput.value = '';
      showNotification('🗑️ Selection cleared!', 'info');
    });
  }

  function displayRecipes(recipes, fromAPI = false) {
    if (!recipesDiv) return;

    if (!recipes || recipes.length === 0) {
      recipesDiv.innerHTML = '<div class="loading">😔 <br><h3>No recipes found</h3><p>Try different ingredients or dietary preferences!</p></div>';
      return;
    }

    let headerMessage = fromAPI ? 
      '<div style="background: linear-gradient(45deg, #d4edda, #a8e6a3); color: #155724; padding: 2rem; border-radius: 20px; margin-bottom: 2rem; text-align: center;">🎉 <h3>Live Spoonacular Recipes Generated!</h3><p>Fresh from our recipe database</p></div>' :
      '<div style="background: linear-gradient(45deg, #fff3cd, #ffeaa7); color: #d68910; padding: 2rem; border-radius: 20px; margin-bottom: 2rem; text-align: center;">📱 <h3>Demo Mode Active</h3><p>Showing curated recipes. Start server for live API results!</p></div>';

    recipesDiv.innerHTML = headerMessage;

    recipes.forEach((recipe, index) => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.style.animationDelay = `${index * 0.1}s`;

      const dietaryLabels = Array.isArray(recipe.dietary_labels) 
        ? recipe.dietary_labels.join(' • ') 
        : '';

      const metaInfo = [dietaryLabels, recipe.servings ? `Serves ${recipe.servings}` : '', recipe.time || ''].filter(Boolean).join(' • ');

      card.innerHTML = `
        <h3>${recipe.title || 'Delicious Recipe'}</h3>
        ${metaInfo ? `<div class="meta">${metaInfo}</div>` : ''}
        <p>${recipe.description || 'A wonderful recipe made with your selected ingredients.'}</p>

        <h4>🥘 Ingredients:</h4>
        <ul>${(recipe.ingredients || []).map(ing => `<li>${ing}</li>`).join('')}</ul>

        <h4>👨‍🍳 Instructions:</h4>
        <ol>${(recipe.instructions || []).map(inst => `<li>${inst}</li>`).join('')}</ol>

        ${recipe.sourceUrl ? `<div style="margin-top: 1rem;"><a href="${recipe.sourceUrl}" target="_blank" style="color: var(--primary-color);">🔗 View Original Recipe</a></div>` : ''}
      `;

      recipesDiv.appendChild(card);
    });

    recipesDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // User preferences and allergies
  const allergiesInput = document.getElementById('allergies');
  if (allergiesInput) {
    allergiesInput.addEventListener('input', (e) => {
      userAllergies = e.target.value.split(',').map(a => a.trim()).filter(a => a);
      renderIngredients(searchInput ? searchInput.value : '');
      saveUserPreferences();
    });
  }

  function saveUserPreferences() {
    const preferences = {
      selectedIngredients: selectedIngredients,
      allergies: userAllergies,
      lastUsed: new Date().toISOString()
    };
    localStorage.setItem('smarty_chef_preferences', JSON.stringify(preferences));
  }

  function loadUserPreferences() {
    const saved = localStorage.getItem('smarty_chef_preferences');
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        selectedIngredients = preferences.selectedIngredients || [];
        userAllergies = preferences.allergies || [];

        if (allergiesInput && userAllergies.length > 0) {
          allergiesInput.value = userAllergies.join(', ');
        }

        renderIngredients();
        renderSelectedPills();
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }

  // Form handling for login/signup
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      const password = document.getElementById('signupPassword');
      const confirmPassword = document.getElementById('signupConfirmPassword');

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        e.preventDefault();
        showNotification('❌ Passwords do not match!', 'error');
        return;
      }

      showNotification('✅ Account created successfully!', 'success');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', () => {
      showNotification('✅ Login successful! Welcome back!', 'success');
      showPage('home');
    });
  }

  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const colors = {
      success: '#10b981',
      error: '#ef4444', 
      warning: '#f59e0b',
      info: '#3b82f6'
    };

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type] || colors.info};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      z-index: 10000;
      font-weight: 500;
      max-width: 300px;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
  }

  // Initialize app
  loadUserPreferences();
  renderIngredients();
  renderSelectedPills();

  console.log('✅ Smarty-Chef.PCS fully initialized!');
});

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => console.log('✅ Service Worker registered'))
      .catch(error => console.log('❌ Service Worker registration failed:', error));
  });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);