const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
;

const api = supertest(app);

const initialBlogs = [
    {
        title: "Primer blog",
        author: "Juan Pérez",
        url: "http://primerblog.com",
        likes: 10,
    },
    {
        title: "Segundo blog",
        author: "Ana Gómez",
        url: "http://segundoblog.com",
        likes: 5,
    },
];

// Antes de cada test, limpiamos la base de datos y agregamos los blogs iniciales
beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
});

describe('Blog API tests', () => {
    test('Blogs are returned as JSON and the correct amount is received', async () => {
        const response = await api.
        get('/api/blogs')
        .expect(200)
        .expect('content-type',/application\/json/)
        expect(response.body).toHaveLength(initialBlogs.length);
    });

    test('Each blog post should have an id property instead of _id', async () => {
        const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('content-type',/application\/json/)

        response.body.forEach(blog => {
            expect(blog.id).toBeDefined(); // 🔹 Verifica que existe 'id'
            expect(blog._id).toBeUndefined(); // 🔹 Verifica que '_id' no existe
        });
    });

    test('Posting a blog', async () => {
        const newBlog = {
            title: "Third blog",
            author: "Maximo Meridio",
            url: "http://tercerblog.com",
            likes: 15,
        };
    
        // Obtener la cantidad inicial de blogs en la BD
        const blogsAtStart = await api.get('/api/blogs');
        const initialBlogsCount = blogsAtStart.body.length;
    
        // Enviar el nuevo blog con POST
        await api
            .post('/api/blogs')
            .send(newBlog) // Enviar el blog en el body
            .expect(201) // Código de estado esperado
            .expect('Content-Type', /application\/json/); 
    
        // Obtener la lista de blogs después de la inserción
        const blogsAtEnd = await api.get('/api/blogs');
        const finalBlogsCount = blogsAtEnd.body.length;
    
        // Verificar que el número de blogs aumentó en 1
        expect(finalBlogsCount).toBe(initialBlogsCount + 1);
    
        // Verificar que el nuevo blog se encuentra en la lista
        const titles = blogsAtEnd.body.map(blog => blog.title);
        expect(titles).toContain("Third blog");
    });
    
   
});

// Después de todas las pruebas, cerramos la conexión a la base de datos
afterAll(async () => {
    await mongoose.connection.close();
});


