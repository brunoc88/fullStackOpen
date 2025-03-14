const Blog = require('../models/blog');
const User = require('../models/user');

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

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = { initialBlogs, getBlogsFromDB, usersInDb };
