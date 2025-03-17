const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Content missing' })
  }

  if (username.length < 3 || password.length < 3) {
    return res.status(400).json({ error: 'Username and password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  return res.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })

  response.json(users)
})
module.exports = usersRouter
