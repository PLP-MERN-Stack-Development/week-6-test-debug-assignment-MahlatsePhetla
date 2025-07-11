
// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const postsRouter = require('./src/routes/Posts');

dotenv.config(); // 

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Routes
app.use('/api/posts', postsRouter);

// Error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
