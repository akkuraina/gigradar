const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gigradar', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/artists', require('./routes/artists'));
app.use('/api/venues', require('./routes/venues'));
app.use('/api/gigs', require('./routes/gigs'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/checkins', require('./routes/checkins'));
app.use('/api/external', require('./routes/external-apis'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GigRadar API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'GigRadar Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      artists: '/api/artists',
      venues: '/api/venues',
      gigs: '/api/gigs',
      external: '/api/external'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`GigRadar Backend running on port ${PORT}`);
}); 