# Now create the complete deployment package with the best UI and Spoonacular API
import zipfile
import os

# Create enhanced package.json for the best UI version
enhanced_package_json = '''{
  "name": "smarty-chef-pcs",
  "version": "2.0.0",
  "description": "Smart Recipe Generator with Spoonacular API and Best UI - Made by Clement",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "test": "echo \\"No test specified\\" && exit 0"
  },
  "keywords": [
    "recipe", "cooking", "spoonacular", "ingredients", "ai", "pwa", "clement"
  ],
  "author": "Clement",
  "license": "MIT",
  "dependencies": {
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "node-fetch": "^2.7.0"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}'''

# Enhanced service worker for the best UI
enhanced_service_worker = '''const CACHE_NAME = 'smarty-chef-pcs-v2.0.0';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Caching app resources');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  if (event.request.url.includes('/generate-recipe') || 
      event.request.url.includes('spoonacular.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

console.log('🍳 Smarty-Chef.PCS Service Worker - Made by Clement');'''

# Enhanced manifest for the best UI
enhanced_manifest = '''{
  "name": "Smarty-Chef.PCS - Smart Recipe Generator",
  "short_name": "Smarty-Chef.PCS",
  "description": "AI-powered recipe generator with visual ingredient selection and Spoonacular API. Made by Clement.",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "orientation": "portrait-primary",
  "scope": "./",
  "lang": "en",
  "icons": [
    {
      "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23667eea' width='100' height='100' rx='20'/%3E%3Ctext y='70' font-size='60' text-anchor='middle' x='50' fill='white'%3E🍳%3C/text%3E%3C/svg%3E",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23667eea' width='100' height='100' rx='20'/%3E%3Ctext y='70' font-size='60' text-anchor='middle' x='50' fill='white'%3E🍳%3C/text%3E%3C/svg%3E",
      "sizes": "512x512", 
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ],
  "categories": ["food", "lifestyle", "utilities", "productivity"],
  "screenshots": [
    {
      "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23667eea' width='300' height='200'/%3E%3Ctext y='110' font-size='40' text-anchor='middle' x='150' fill='white'%3ESmartý-Chef.PCS%3C/text%3E%3C/svg%3E",
      "sizes": "300x200",
      "type": "image/svg+xml",
      "form_factor": "wide",
      "label": "Smarty-Chef.PCS Recipe Generator"
    }
  ],
  "shortcuts": [
    {
      "name": "Generate Recipe",
      "short_name": "Generate",
      "description": "Quick recipe generation",
      "url": "./index.html#generator",
      "icons": [
        {
          "src": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23667eea' width='100' height='100' rx='20'/%3E%3Ctext y='70' font-size='60' text-anchor='middle' x='50' fill='white'%3E🔍%3C/text%3E%3C/svg%3E",
          "sizes": "96x96",
          "type": "image/svg+xml"
        }
      ]
    }
  ]
}'''

# Create deployment README
deployment_readme = '''# 🍳 Smarty-Chef.PCS - ULTIMATE VERSION

## 🎉 Best UI + Spoonacular API Integration

This is the **ULTIMATE** version combining your beautiful UI interface with powerful Spoonacular API integration!

## 🚀 Render Deployment Instructions

### 1. Upload to GitHub
- Extract all files to a folder
- Push to your GitHub repository (replace old files)

### 2. Create Render Web Service
- Connect your GitHub repo
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: (leave empty - all files in root)

### 3. Set Environment Variables
Add in Render dashboard:

| Variable Name | Value |
|---------------|-------|
| `SPOONACULAR_API_KEY` | `7800762921d34589b4b49897b5c09778` |
| `PORT` | `10000` |

### 4. Deploy & Enjoy! 🎉
- Your app will be live with both beautiful UI and live Spoonacular recipes!

## ✨ What Makes This ULTIMATE

### 🎨 **Best UI Features:**
- Beautiful gradient design with modern styling
- Smooth animations and transitions
- Visual ingredient selection (100+ ingredients)
- Mobile responsive design
- Progressive Web App support

### 🔥 **Powerful Spoonacular Integration:**
- **365K+ Real Recipes** from Spoonacular database
- Smart ingredient-based recipe matching
- Dietary preference filtering (Vegetarian, Vegan, etc.)
- Allergy awareness and filtering
- Detailed recipe information with cooking times
- Professional food photography

### 🌟 **Smart Features:**
- **Visual Ingredient Selection** - Click, don't type!
- **Indian Cuisine Specialization** with authentic spices
- **Local Recipe Saving** to build your cookbook
- **Intelligent Fallbacks** when API is unavailable
- **Real-time Notifications** for user feedback
- **User Preferences Storage** remembers your choices

## 📁 Project Structure
```
smarty-chef-pcs/
├── index.html         # Beautiful UI with all pages
├── style.css          # Modern responsive styling  
├── app.js             # Enhanced with Spoonacular API
├── server.js          # Express backend with API integration
├── package.json       # Dependencies and scripts
├── manifest.json      # PWA configuration
├── service-worker.js  # Offline support
└── README.md          # This file
```

## 🔧 Local Development
```bash
npm install
npm start
# Open http://localhost:3000
```

## 🌍 Live Features
- **Live Recipe Generation** from Spoonacular API
- **Smart Ingredient Matching** finds perfect recipes
- **Dietary Filtering** works with real recipe data
- **Rich Recipe Details** including prep time, servings, images
- **Fallback System** shows demo recipes if API unavailable

## 👨‍💻 Made by Clement
- Complete branding throughout
- Social media integration ready
- Professional about & privacy pages
- Modern responsive design

## 🎯 Why This is the BEST Version

1. **Beautiful UI** - Your stunning interface design
2. **Real API Data** - 365K+ recipes from Spoonacular  
3. **Smart Filtering** - Works with actual recipe metadata
4. **Indian Cuisine** - Specialized ingredient selection
5. **PWA Ready** - Installable as mobile app
6. **Production Ready** - Full error handling & fallbacks

**This is the ULTIMATE Smarty-Chef.PCS experience! 🚀**

Made with ❤️ by Clement
'''

# Create .env file
env_file = '''# Spoonacular API Configuration
SPOONACULAR_API_KEY=7800762921d34589b4b49897b5c09778
PORT=3000

# App Information  
APP_NAME=Smarty-Chef.PCS
APP_VERSION=2.0.0
AUTHOR=Clement

# 🚀 Ready for deployment!
# This version combines beautiful UI with Spoonacular API integration
# Made with ❤️ by Clement
'''

# Save all enhanced files
with open('package.json', 'w', encoding='utf-8') as f:
    f.write(enhanced_package_json)

with open('service-worker.js', 'w', encoding='utf-8') as f:
    f.write(enhanced_service_worker)

with open('manifest.json', 'w', encoding='utf-8') as f:
    f.write(enhanced_manifest)

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(deployment_readme)

with open('.env', 'w', encoding='utf-8') as f:
    f.write(env_file)

# Create ULTIMATE deployment ZIP
files_to_zip = [
    'index.html',  # Use the best UI version
    'style.css',   # Use the best UI styling
    'app.js',      # Enhanced with Spoonacular API
    'server.js',   # Enhanced with Spoonacular API
    'package.json',
    'manifest.json', 
    'service-worker.js',
    'README.md',
    '.env'
]

zip_filename = 'Smarty-Chef-PCS-ULTIMATE-BEST-UI-API.zip'

with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for filename in files_to_zip:
        if os.path.exists(filename):
            zipf.write(filename)
            print(f"✅ Added: {filename}")

print(f"\n🎉 ULTIMATE VERSION CREATED!")
print(f"📦 File: {zip_filename}")
print(f"\n🔥 FEATURES COMBINED:")
print("✅ Your beautiful UI interface")
print("✅ Spoonacular API integration (365K+ recipes)")
print("✅ Visual ingredient selection with Indian spices")
print("✅ Smart recipe matching and filtering")
print("✅ Progressive Web App support")
print("✅ Made by Clement branding")
print("✅ Complete login/privacy/about pages")
print("✅ Mobile responsive design")
print("✅ Deployment ready for Render")

print(f"\n🚀 READY TO DEPLOY:")
print("1. Extract and upload to GitHub")
print("2. Deploy on Render with environment variables")
print("3. Enjoy your ULTIMATE recipe app!")

zip_filename