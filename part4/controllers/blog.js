const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
  const { title, author, url, likes, user } = req.body

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' })
  }

  const userExists = await User.findById(user)
  if (!userExists) {
    return res.status(400).json({ error: 'Invalid user ID' })
  }
  const newBlog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: userExists._id
  })

  const savedBlog = await newBlog.save()

  userExists.blogs = userExists.blogs.concat(savedBlog._id)
  await userExists.save()

  res.status(201).json(savedBlog)
}
)

blogRouter.delete('/:id', async (req, res) => {
  const id = req.params.id

  const findBlog = await Blog.findById(id)

  if (!findBlog) {
    return res.status(404).json('Not Found')
  }
  await Blog.findByIdAndDelete(id)

  return res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
  const id = req.params.id

  const body = req.body

  const findBlog = await Blog.findById(id)
  if (!findBlog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  const response = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true })
  return res.status(200).json(response)
})

module.exports = blogRouter
