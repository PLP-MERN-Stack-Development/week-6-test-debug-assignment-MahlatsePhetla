
const express = require('express');
const postsRouter = require('./routes/Posts');
const authRouter = require('./routes/auth');
require('dotenv').config();


const app = express();
app.use(express.json());

app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);

module.exports = app;
