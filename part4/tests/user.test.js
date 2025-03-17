const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../tests/test_helper')
const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    // assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    // assert(usernames.includes(newUser.username))
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(result.body.error).toContain('expected `username` to be unique')
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails when the length of the username or password are not valided', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'john',
      password: '12',
      username: 'jo'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(result.body.error).toContain('Username and password must be at least 3 characters long')
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails when username or password are empty', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'john',
      password: '',
      username: ''
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(result.body.error).toContain('Content missing')
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})
