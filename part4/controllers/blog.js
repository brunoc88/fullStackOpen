const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose');
const { userExtractor } = require('../utils/middleware')


blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})


blogRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  
  if (!request.user) {
    return response.status(401).json({ error: 'User authentication failed' })
  }

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const newBlog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: request.user._id
  })

  const savedBlog = await newBlog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()

  response.status(201).json(savedBlog)
})


blogRouter.delete('/:id', userExtractor, async (req, res) => {
  const id = req.params.id
  const blog = await Blog.findById(id)

  
  if (!blog) {
    return res.status(404).json({ error: 'Not Found' })
  }

  
  if (blog.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to delete this blog' })
  }
  
  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})


blogRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  if (!mongoose.Types.ObjectId.isValid(body.user)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const findBlog = await Blog.findById(id);
  if (!findBlog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  const response = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  res.status(200).json(response);
});

module.exports = blogRouter
