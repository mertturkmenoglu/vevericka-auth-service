const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
const mockList = require('../../mocks/invalidRegisterMock.json')
let server

describe('User Controller Integration Tests', () => {
    before(() => {
        process.env.NODE_ENV = 'test'
    })

    beforeEach(() => {
        server = require('../../../src/app')
    })

    afterEach(done => {
        server.close( () => {
            delete require.cache[require.resolve( '../../../src/app' )]
            done()
        })
    })

    it('Should not register name shorter than 6 characters', done => {
        const reqBody = {
            username: 'TestUsername',
            name: 'Short',
            email: 'test@mail.com',
            password: '12345678'
        }

        request(server)
            .post('/auth/register')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.statusCode).to.be.a('number')
                expect(res.statusCode).to.eq(400)
                expect(res.body).to.be.deep.eq(mockList)
                done()
            })
    })
})

