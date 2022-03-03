const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    const passwordCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false

    if (!(passwordCorrect && user)) {
        return response.status(401).json({ error: "invalid username or password" })
    }

    const userForToken = {
        id: user._id,
        username,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response.status(200).send({ token, username, name: user.name })
})

module.exports = loginRouter