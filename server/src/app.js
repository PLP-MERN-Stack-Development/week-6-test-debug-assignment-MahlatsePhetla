const express = require('express');
const postsRouter = require('./routes/posts');
const authMiddleware = require('./middleware/auth.js');

const app = express();

app.use(express.json());

app.use('/api/posts', postsRouter);

module.exports = app;
