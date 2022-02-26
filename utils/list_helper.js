const _ = require('lodash')

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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}