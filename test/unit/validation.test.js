const should = require('chai').should()

describe('Register Validation', () => {
    const registerValidation = require('../../src/validation').registerValidation
    let data

    beforeEach(() => {
        data = {
            username: 'abcdefgh',
            name: 'name12',
            email: 'test@mail.com',
            password: '12345678'
        }
    })

    afterEach(() => {
        data = undefined
    })

    it('Register - Base case should return true', (done) => {
        const expected = true
        const actual = registerValidation(data)
        actual.should.equal(expected)
        actual.should.be.a('boolean')
        done()
    })

    it('Register - Name shorter than 6 chars should return false', (done) => {
        data.name = 'name'
        const expected = false
        const actual = registerValidation(data)
        actual.should.equal(expected)
        actual.should.be.a('boolean')
        done()
    })
})

describe('Login Validation', () => {
    const loginValidation = require('../../src/validation').loginValidation
    let data

    beforeEach(() => {
        data = {
            email: 'test@mail.com',
            password: '12345678'
        }
    })

    afterEach(() => {
        data = undefined
    })

    it('Login - Base case should return true', (done) => {
        const expected = true
        const actual = loginValidation(data)
        actual.should.equal(expected)
        actual.should.be.a('boolean')
        done()
    })

    it('Login - Password shorter than 8 chars should return false', (done) => {
        data.password = '1234'
        const expected = false
        const actual = loginValidation(data)
        actual.should.equal(expected)
        actual.should.be.a('boolean')
        done()
    })
})