const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const { initialBlogs, getBlogsFromDB } = require('./test_helper');
const { describe } = require('node:test');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
});
//4.8 to 4.12
describe('Blog API tests', () => {
    describe('GET /api/blogs', () => {
        test('Blogs are returned as JSON and have the correct amount', async () => {
            const response = await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/);
            
            expect(response.body).toHaveLength(initialBlogs.length);
        });

        test('Each blog post should have an id property instead of _id', async () => {
            const response = await api.get('/api/blogs');

            response.body.forEach(blog => {
                expect(blog.id).toBeDefined();
                expect(blog._id).toBeUndefined();
            });
        });
    });

    describe('POST /api/blogs', () => {
        test('Adding a new blog increases the count', async () => {
            const newBlog = {
                title: "Tercer blog",
                author: "Maximo Meridio",
                url: "http://tercerblog.com",
                likes: 15,
            };

            const blogsAtStart = await getBlogsFromDB();

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const blogsAtEnd = await getBlogsFromDB();

            expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
            expect(blogsAtEnd.map(b => b.title)).toContain(newBlog.title);
        });

        test('if likes property is missing, it defaults to 0', async () => {
            const newBlog = {
                title: "Cuarto blog",
                author: "Michael Red",
                url: "http://cuartoblog.com",
            };

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            expect(response.body.likes).toBe(0);
        });

        test('if title or url are missing, return bad request', async () => {
            const blogWithoutTitle = { author: 'Javies Escuela', url: 'http://quintoblog.com', likes: 2000 };
            const blogWithoutUrl = { author: 'Javies Escuela', title: 'quinto blog', likes: 2000 };

            await api.post('/api/blogs').send(blogWithoutTitle).expect(400);
            await api.post('/api/blogs').send(blogWithoutUrl).expect(400);
        });
    });
});

//4.13 to 4.14
describe('More testing', () => {
    test('Testing Delete a blog', async () => {
        const blogsAtStart = await api.get('/api/blogs');
        const blogToDelete = blogsAtStart.body[0]; 

        await api
            .delete(`/api/blogs/${blogToDelete.id}`) 
            .expect(204);

        const blogsAtEnd = await api.get('/api/blogs');
        
        expect(blogsAtEnd.body).toHaveLength(blogsAtStart.body.length - 1); 
        expect(blogsAtEnd.body.map(blog => blog.id)).not.toContain(blogToDelete.id); 
    });

    test('Update a blog', async () => {
        const blogsAtStart = await api.get('/api/blogs');
        const blogToUpdate = blogsAtStart.body[0];
    
        const updatedData = { likes: 50 };
    
        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`) 
            .send(updatedData)
            .expect(200) 
            .expect('Content-Type', /application\/json/);
    
        expect(response.body.likes).toBe(updatedData.likes); 
    });
    
});

afterAll(async () => {
    await mongoose.connection.close();
});
