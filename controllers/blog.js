const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    let { title, url, author, likes } = request.body

    if (!title || !url) {
        return response.status(400).end()
    }

    if (!likes) {
        likes = 0
    }

    if (!request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const newBlog = new Blog({ title, url, author, likes, user: request.user._id })

    const savedBlog = await newBlog.save()

    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.status(201).json(newBlog)

})

blogRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(400).json({ error: 'blog does not exist' })
    }

    if (!request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (request.user._id.toString() === blog.user.toString()) {
        const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
        if (deletedBlog) {
            request.user.blogs = request.user.blogs.filter(blog => deletedBlog._id.toString() === blog._id.toString())
            await request.user.save()
            response.status(204).end()
        } else {
            response.status(400).end()
        }
    } else {
        response.status(401).json({ error: 'permission denied' })
    }
})

blogRouter.put('/:id', async (request, response) => {
    const { likes } = request.body

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(400).json({ error: 'blog does not exist' })
    }

    if (!request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (request.user._id.toString() === blog.user.toString()) {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true })
        if (updatedBlog) {
            response.json(updatedBlog)
        } else {
            response.status(400).end()
        }
    } else {
        response.status(401).json({ error: 'permission denied' })
    }
})

module.exports = blogRouter