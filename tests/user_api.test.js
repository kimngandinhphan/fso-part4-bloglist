const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('../utils/list_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('POST api/users', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', name: "Admin", passwordHash })

        await user.save()
    })

    test('creation succeeds with valid info', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "rainn",
            name: "Rainn",
            password: 'rainn123'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        expect(usersAtEnd.map(u => u.username)).toContain(newUser.username)
    })

    test('creation fails with missing info', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "rainn",
            name: "Rainn", // missing password
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toContain('missing info')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        expect(usersAtEnd.map(u => u.username)).not.toContain(newUser.username)
    })

    test('creation fails with invalid info', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "rainn",
            name: "Rainn",
            password: "ra" // password < 3 characters
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toContain('invalid info')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        expect(usersAtEnd.map(u => u.username)).not.toContain(newUser.username)
    })

    test('creation fails with existing username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "root",
            name: "Rainn",
            password: "rainn123"
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toContain('username must be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})