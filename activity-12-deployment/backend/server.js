const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.API_RATE_LIMIT || 1000
});
app.use('/api/', limiter);

// General middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());

// Sample data
const quests = [
  { id: 1, title: "Dragon Slayer", difficulty: "Hard", reward: "1000 gold", completed: false },
  { id: 2, title: "Potion Collection", difficulty: "Easy", reward: "100 gold", completed: true },
  { id: 3, title: "Rescue Mission", difficulty: "Medium", reward: "500 gold", completed: false }
];

const players = [
  { name: "alex", level: 15, class: "Warrior", quests_completed: 5 },
  { name: "sarah", level: 12, class: "Mage", quests_completed: 3 },
  { name: "mike", level: 18, class: "Rogue", quests_completed: 8 }
];

// API Key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.query.api_key || req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY || 'demo_key_12345';
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  
  res.json({
    status: 'healthy',
    uptime: uptime,
    memory: memory,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.get('/api/quests', validateApiKey, (req, res) => {
  res.json({
    total_quests: quests.length,
    quests: quests
  });
});

app.get('/api/quests/:id', validateApiKey, (req, res) => {
  const quest = quests.find(q => q.id === parseInt(req.params.id));
  if (!quest) {
    return res.status(404).json({ error: 'Quest not found' });
  }
  res.json(quest);
});

app.get('/api/players/:name', validateApiKey, (req, res) => {
  const player = players.find(p => p.name === req.params.name.toLowerCase());
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  res.json(player);
});

app.get('/api/categories', validateApiKey, (req, res) => {
  res.json({
    categories: [
      { name: "Combat", count: 2 },
      { name: "Collection", count: 1 },
      { name: "Rescue", count: 1 }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Quest Tracker API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎮 API docs: http://localhost:${PORT}/api/quests?api_key=demo_key_12345`);
});

module.exports = app;
