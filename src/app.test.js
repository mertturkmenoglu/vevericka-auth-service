const request = require('supertest')
const mongoose = require('mongoose');

describe('loadExpress', () => {
    let server

    before(() => {
        process.env.NODE_ENV = 'test'
    })

    beforeEach(() => {
        delete require.cache[require.resolve('./app')];
        server = require('./app')
    })

    afterEach((done) => {
        try {
            mongoose.connection.close()
            server.close(done)
        } catch (e) {
            console.error(e)
        }
    })

    it('Response to /api', (done) => {
        request(server)
            .get('/api')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    })

    it('404', (done) => {
        request(server)
            .get('/notFouNd')
            .expect(404, done)
    })
})