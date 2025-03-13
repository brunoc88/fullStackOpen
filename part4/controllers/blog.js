const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async(request, response) => {
   const blogs = await Blog.find({});
   response.json(blogs);
})

blogRouter.post('/', async(request, response, next) => {
    const body = request.body;

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    await blog.save()
    .then(savedBlog =>{
        response.status(201).json(savedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogRouter;
