const express = require(`express`);
const postRouter = require(`./data/posts/posts-router`);
const commentRouter = require(`./data/comments/comments-router`);

const server = express();

server.use(express.json());

server.use(`/api/posts`, postRouter);
server.use(`/api/posts/:id`, postRouter);
server.use(`/api/posts`, commentRouter);
server.use(`/api/posts/:id`, commentRouter);


server.get(`/`, (req,res) => {
    res.send(`
    <h2> My Tech Blog </h2>
    <p> Nice to meet you! </p>`)
});

module.exports = server;