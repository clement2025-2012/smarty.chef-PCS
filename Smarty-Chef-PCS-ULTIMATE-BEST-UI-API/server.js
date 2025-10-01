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

// --- Your route handlers & helpers here ---

function transformRecipe(recipe) {
  // ... (same as you posted)
}

function createFallbackRecipe(ingredients, dietaryPreference) {
  // ... (same as you posted)
}

app.post('/generate-recipe', async (req, res) => {
  // ... (same as you posted)
});

app.get('/health', (req, res) => {
  // ... (same as you posted)
});

app.get('/api-status', async (req, res) => {
  // ... (same as you posted)
});

// Serve index.html for root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all 404 for API and pages
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    availableEndpoints: [
      'GET / - Main application',
      'POST /generate-recipe - Recipe generator',
      'GET /health - Health check',
      'GET /api-status - API status',
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Smarty-Chef.PCS Server started on port ${PORT}`);
  console.log(`📱 Web App: http://localhost:${PORT}`);
  console.log(`🔧 Health Check: http://localhost:${PORT}/health`);
  console.log(`📊 API Status: http://localhost:${PORT}/api-status`);
  console.log(`🍳 Made with ❤️ by Clement`);
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
