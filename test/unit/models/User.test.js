const expect = require('chai').expect;
const User = require('../../../src/models/User');

describe('User Model Unit Tests', function() {
    it('Should be invalid if parameter is undefined', (done) => {
        const user = new User()

        user.validate((err) => {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('Should be valid for all correct cases', (done) => {
        const user = new User({
            username: 'test_username',
            name: 'Test User',
            email: 'testuser@mail.com',
            password: '1234678'
        })

        user.validate(err => {
            expect(err).to.not.exist
            done()
        })
    })
});