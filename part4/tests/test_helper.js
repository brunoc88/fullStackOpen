const Blog = require('../models/blog');

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


const getBlogsFromDB = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

module.exports = { initialBlogs, getBlogsFromDB };
