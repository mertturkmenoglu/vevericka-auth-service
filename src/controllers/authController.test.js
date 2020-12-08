const request = require('supertest')
const mongoose = require('mongoose');

describe('Register Controller', () => {
    let server

    before(() => {
        process.env.NODE_ENV = 'test'
    })

    beforeEach(() => {
        delete require.cache[require.resolve('../app')];
        server = require('../app')
    })

    afterEach((done) => {
        try {
            mongoose.connection.close()
            server.close(done)
        } catch (e) {
            console.error(e)
        }
    })

    after(() => {
        console.log('Test done')
    })
})