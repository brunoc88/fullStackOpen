const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
})

blogRouter.post('/', async (req, res) => {
    const { title, author, url, likes } = req.body;

    if (!title || !url) {
        return res.status(400).json({ error: 'Title and URL are required' });
    }

    const newblog = new Blog({
        title,
        author,
        url,
        likes: likes || 0
    });


    const savedBlog = await newblog.save();
    return res.status(201).json(savedBlog);

});

blogRouter.delete('/:id', async(req, res) =>{
    const id = req.params.id;

    const findBlog = await Blog.findById(id);

    if(!findBlog){
        return res.status(404).json('Not Found');
    }
    await Blog.findByIdAndDelete(id);

    return res.status(204).end();
})

blogRouter.put('/:id', async(req, res) =>{
    const id = req.params.id;
    
    const body = req.body;

    const findBlog = await Blog.findById(id);
    if(!findBlog){
        return res.status(404).json({ error: 'Blog not found' });
    }

    const response = await Blog.findByIdAndUpdate(id,body, { new: true, runValidators: true })
    return res.status(200).json(response);
})

module.exports = blogRouter;
