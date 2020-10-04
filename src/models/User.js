const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		maxLength: 32
	},
	name: {
		type: String,
		required: true,
		minLength: 6,
		maxLength: 255
	},
	email: {
		type: String,
		required: true,
		minLength: 6,
		maxLength: 255,
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
		maxLength: 1024,
	},
	create_date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', userSchema);