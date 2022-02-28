const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogRouter.post('/', (request, response) => {
    let { title, url, author, likes } = request.body

    if (!title || !url) {
        return response.status(400).end()
    }

    if (!likes) {
        likes = 0
    }

    const newBlog = new Blog({ title, url, author, likes })

    newBlog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

blogRouter.delete('/:id', async (request, response) => {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (deletedBlog) {
        response.status(204).end()
    } else {
        response.status(400).end()
    }
})

blogRouter.put('/:id', async (request, response) => {
    const { likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true })
    if(updatedBlog) {
        response.json(updatedBlog)
    } else {
        response.status(400).end()
    }
})

module.exports = blogRouter