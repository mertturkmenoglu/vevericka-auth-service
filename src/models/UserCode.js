const mongoose = require('mongoose');

const userCodeSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minLength: 6,
		maxLength: 255,
	},
	code: {
		type: String,
		required: true,
		maxLength: 1024
	},
	code_last_date: {
		type: Date,
		required: true,
	},
	create_date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('UserCode', userCodeSchema);