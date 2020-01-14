const express = require('express');
const postsRouter = require('../router/postsRouter');
const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).send(
       '<h2>Welcome to Young\'s Blog Post</h2>'
    )
})

server.use('/api/posts', postsRouter);

module.exports = server;