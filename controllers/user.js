const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const { is } = require('express/lib/request')
const { default: mongoose } = require('mongoose')
const User = require('../models/user')
const helper = require('../utils/list_helper')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.send(users)
})

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response.status(400).json({ error: "missing info" })
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: "invalid info" })
  }

  const existingUser = await User.findOne({ username }) 
  if (existingUser) {
    return response.status(400).json({ error: "username must be unique" })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = userRouter