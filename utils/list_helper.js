const _ = require('lodash')
const Blog = require('../models/blog')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    return likes.reduce((sum, current) => sum + current, 0)
}

const favoriteBlog = (blogs) => {
    return _.maxBy(blogs, blog => blog.likes)
}

const mostBlogs = (blogs) => {
    const authorsObj = _.groupBy(blogs, "author")
    const authors = []
    for (const key in authorsObj) {
        // const blogs = _.map(authorsObj[key], "likes").reduce((sum, current) => sum + current, 0)
        authors.push({ author: key, blogs: authorsObj[key].length })
    }
    return _.maxBy(authors, (author) => author.blogs)
}

const mostLikes = (blogs) => {
    const authorsObj = _.groupBy(blogs, "author")
    const authors = []
    for (const key in authorsObj) {
        const likes = _.map(authorsObj[key], "likes").reduce((sum, current) => sum + current, 0)
        authors.push({ author: key, likes })
    }
    return _.maxBy(authors, (author) => author.likes)
}

const blogsInDb = async () => {
    return await Blog.find({})
}


const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    }
]

const initialUsers = [
    {
        username: 'user001',
        name: "Robert C. Martin",
    },
    {
        username: 'user002',
        name: "Edsger W. Dijkstra",
    },

]

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    blogsInDb,
    initialBlogs,
    initialUsers
}