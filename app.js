const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog')

const app = express()

const mongoUrl = 'mongodb+srv://jasmine:Uqxxr35mYVQSImEk@cluster0.9pjao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(mongoUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB', error.message))

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)

module.exports = app