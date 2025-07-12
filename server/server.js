
// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const postsRouter = require('./src/routes/Posts');
const authRouter = require('./src/routes/auth');
const app = require('./src/app');

dotenv.config(); // 


// Connect to MongoDB
connectDB();

// Middleware

app.use(express.json()); 

//cors
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));



// Routes
app.use('/api/posts', postsRouter);
app.use('./api/auth', authRouter);

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
