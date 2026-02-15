// Simple development server for the deployment template
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Main deployment interface
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quest Tracker Deployment Guide</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            margin-bottom: 20px;
        }
        h1 { color: #2c3e50; text-align: center; font-size: 2.5em; }
        .step {
            background: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
        }
        .code {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
            margin: 10px 0;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 10px 0;
            border-radius: 6px;
        }
        .success {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 10px 0;
            border-radius: 6px;
        }
        ul { line-height: 1.6; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Quest Tracker Deployment Guide</h1>
        <p style="text-align: center; color: #7f8c8d; font-size: 1.1em;">
            Complete guide to deploy your Quest Tracker app to production
        </p>

        <div class="step">
            <h2>📋 Prerequisites</h2>
            <ul>
                <li><strong>GitHub Account</strong> - To store your code</li>
                <li><strong>Netlify Account</strong> - For frontend deployment (free tier available)</li>
                <li><strong>Railway Account</strong> - For backend deployment (free tier available)</li>
                <li><strong>Node.js 18+</strong> - Installed locally for development</li>
            </ul>
        </div>

        <div class="step">
            <h2>🎯 Step 1: Prepare Your Code</h2>
            <p>Organize your project structure:</p>
            <div class="code">
quest-tracker/
├── frontend/          # React app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── netlify.toml   # Netlify config
├── backend/           # Express API
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── railway.toml   # Railway config
└── README.md
            </div>
        </div>

        <div class="step">
            <h2>🌐 Step 2: Deploy Backend to Railway</h2>
            <ol>
                <li>Go to <a href="https://railway.app" target="_blank">railway.app</a> and sign up</li>
                <li>Click "New Project" → "Deploy from GitHub repo"</li>
                <li>Connect your GitHub account and select your repository</li>
                <li>Choose the <code>backend</code> folder as the root directory</li>
                <li>Railway will auto-detect Node.js and deploy automatically</li>
            </ol>

            <div class="warning">
                <strong>⚠️ Important:</strong> Set these environment variables in Railway:
                <ul>
                    <li><code>NODE_ENV=production</code></li>
                    <li><code>PORT=$PORT</code> (Railway provides this automatically)</li>
                    <li>Any other environment variables your API needs</li>
                </ul>
            </div>

            <p>Your API will be available at: <code>https://your-app.railway.app</code></p>
        </div>

        <div class="step">
            <h2>🎨 Step 3: Deploy Frontend to Netlify</h2>
            <ol>
                <li>Go to <a href="https://netlify.com" target="_blank">netlify.com</a> and sign up</li>
                <li>Click "New site from Git" → Connect to GitHub</li>
                <li>Select your repository</li>
                <li>Set build settings:</li>
                <ul>
                    <li><strong>Base directory:</strong> <code>frontend</code></li>
                    <li><strong>Build command:</strong> <code>npm run build</code></li>
                    <li><strong>Publish directory:</strong> <code>frontend/build</code></li>
                </ul>
                <li>Set environment variables in Netlify dashboard</li>
            </ol>

            <div class="warning">
                <strong>⚠️ Required Environment Variables for Frontend:</strong>
                <ul>
                    <li><code>REACT_APP_API_URL=https://your-api.railway.app</code></li>
                    <li><code>REACT_APP_API_KEY=demo_key_12345</code></li>
                    <li><code>REACT_APP_ENVIRONMENT=production</code></li>
                </ul>
            </div>

            <p>Your frontend will be available at: <code>https://your-app.netlify.app</code></p>
        </div>

        <div class="step">
            <h2>🔧 Step 4: Configure CORS</h2>
            <p>Update your backend's CORS configuration to allow requests from your Netlify domain:</p>
            <div class="code">
// In your server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.netlify.app'
  ],
  credentials: true
}));
            </div>
        </div>

        <div class="step">
            <h2>🧪 Step 5: Test Your Deployment</h2>
            <p>Run the automated health check script:</p>
            <div class="code">
npm run health-check https://your-app.netlify.app https://your-api.railway.app
            </div>

            <p>Manual testing checklist:</p>
            <ul>
                <li>✅ Frontend loads successfully</li>
                <li>✅ API health check responds</li>
                <li>✅ Authentication works</li>
                <li>✅ Quest creation and completion</li>
                <li>✅ Player profiles load</li>
                <li>✅ Categories display properly</li>
            </ul>
        </div>

        <div class="step">
            <h2>🎉 Step 6: Go Live!</h2>
            <div class="success">
                <strong>🎊 Congratulations!</strong> Your Quest Tracker app is now live on the internet!
                <ul>
                    <li><strong>Frontend:</strong> <code>https://your-app.netlify.app</code></li>
                    <li><strong>API:</strong> <code>https://your-api.railway.app</code></li>
                    <li><strong>API Docs:</strong> <code>https://your-api.railway.app/api/docs</code></li>
                </ul>
            </div>
        </div>

        <div class="step">
            <h2>📈 Next Steps</h2>
            <ul>
                <li><strong>Custom Domain:</strong> Set up a custom domain in Netlify/Railway</li>
                <li><strong>SSL Certificate:</strong> Both platforms provide free SSL</li>
                <li><strong>Monitoring:</strong> Set up uptime monitoring</li>
                <li><strong>Analytics:</strong> Add Google Analytics or similar</li>
                <li><strong>Database:</strong> Add a production database (PostgreSQL on Railway)</li>
                <li><strong>CI/CD:</strong> Set up automated deployments on git push</li>
            </ul>
        </div>

        <div class="step">
            <h2>🛠️ Available Scripts</h2>
            <div class="code">
# Deploy frontend to Netlify
npm run deploy:frontend

# Deploy backend to Railway
npm run deploy:backend

# Deploy both
npm run deploy:all

# Run health checks
npm run health-check

# Monitor deployment
npm run monitor
            </div>
        </div>

        <div class="step">
            <h2>🆘 Troubleshooting</h2>
            <ul>
                <li><strong>Build fails:</strong> Check Node.js version compatibility</li>
                <li><strong>API not accessible:</strong> Verify Railway deployment logs</li>
                <li><strong>CORS errors:</strong> Update allowed origins in backend</li>
                <li><strong>Environment variables:</strong> Double-check all required vars are set</li>
                <li><strong>404 errors:</strong> Ensure netlify.toml redirects are configured</li>
            </ul>
        </div>
    </div>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Deployment guide server running on port ${PORT}`);
  console.log(`📖 Open http://localhost:${PORT} to view the deployment guide`);
});