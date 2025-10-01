const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files from root directory

const PORT = process.env.PORT || 3000;
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || 'YOUR_API_KEY_HERE';

// Your existing API route handlers here (e.g., /generate-recipe)...

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

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`🌐 Open http://localhost:${PORT}`);
  console.log(`🔑 API key is ${SPOONACULAR_API_KEY ? 'configured' : 'missing'}`);
});
