const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, getBlogsFromDB, usersInDb } = require('./test_helper')

const api = supertest(app)

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword'
  }

  const createdUser = await api.post('/api/users').send(newUser)
  const loginResponse = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })

  token = loginResponse.body.token
  const userId = loginResponse.body.id

  const blogsWithUser = initialBlogs.map(blog => ({
    ...blog,
    user: userId
  }))

  await Blog.insertMany(blogsWithUser)
})


// 4.8 to 4.12
describe('Blog API tests', () => {
  describe('GET /api/blogs', () => {
    test('Blogs are returned as JSON and have the correct amount', async () => {
      const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('Each blog post should have an id property instead of _id', async () => {
      const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)

      response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
        expect(blog._id).toBeUndefined()
      })
    })
  })

  describe('POST /api/blogs', () => {
    test('Adding a new blog increases the count', async () => {
      //const users = await usersInDb()
      //console.log('ID', userId)
      const newBlog = {
        title: 'How to use Token',
        author: 'jwt.io',
        url: 'http://jwt.io',
        likes: 1500000
      }

      const blogsAtStart = await getBlogsFromDB()

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await getBlogsFromDB()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
      expect(blogsAtEnd.map(b => b.title)).toContain(newBlog.title)
    })

    test('Adding a blog fails with 401 Unauthorized if token is missing', async () => {
      const newBlog = {
        title: 'Unauthorized blog',
        author: 'Hacker',
        url: 'http://hacker.com',
        likes: 9999
      }
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401) 
        .expect('Content-Type', /application\/json/)
  
      const blogsAtEnd = await getBlogsFromDB()
      expect(blogsAtEnd.map(b => b.title)).not.toContain(newBlog.title)
    })

    test('if likes property is missing, it defaults to 0', async () => {
      const users = await usersInDb()
      //const userId = users[0].id
      const newBlog = {
        title: 'Cuarto blog',
        author: 'Michael Red',
        url: 'http://cuartoblog.com'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(response.body.likes).toBe(0)
    })

    test('if title or url are missing, return bad request', async () => {
      const blogWithoutTitle = { author: 'Javies Escuela', url: 'http://quintoblog.com', likes: 2000 }
      const blogWithoutUrl = { author: 'Javies Escuela', title: 'quinto blog', likes: 2000 }

      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blogWithoutTitle).expect(400)
      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blogWithoutUrl).expect(400)
    })
  })
})

// 4.13 to 4.14

describe('More testing', () => {
  test('Testing Delete a blog', async () => {
    const blogsAtStart = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
    const blogToDelete = blogsAtStart.body[0]
    console.log("blog a eliminar", blogToDelete)
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)

    expect(blogsAtEnd.body).toHaveLength(blogsAtStart.body.length - 1)
    expect(blogsAtEnd.body.map(blog => blog.id)).not.toContain(blogToDelete.id)
  })

  test('Update a blog', async () => {
    const blogsAtStart = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
    const blogToUpdate = blogsAtStart.body[0]

    const updatedData = { likes: 50 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(updatedData.likes)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
