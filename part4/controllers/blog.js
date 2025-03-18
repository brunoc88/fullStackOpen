const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

// Función para obtener el token del header
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// Obtener todos los blogs
blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

// Crear un nuevo blog
blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  
  
  
  let decodedToken = jwt.verify(getTokenFrom(request), SECRET)
  

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(401).json({ error: 'User not found' })
  }

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const newBlog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Eliminar un blog
blogRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  const findBlog = await Blog.findById(id)

  if (!findBlog) {
    return res.status(404).json({ error: 'Not Found' })
  }

  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})

// Actualizar un blog
blogRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const body = req.body

  const findBlog = await Blog.findById(id)
  if (!findBlog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  const response = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true })
  res.status(200).json(response)
})

module.exports = blogRouter
