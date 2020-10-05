const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
	const isValid = registerValidation(req.body);

	if (!isValid) {
		return res.status(400).json({
			message: "Invalid request"
		});
	}

	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		username: req.body.username,
		name: req.body.name,
		email: req.body.email,
		password: hashed
	});

	const dbEmailUser = await User.findOne({ email: user.email });

	if (dbEmailUser) {
		return res.status(400).json({
			message: "User already exists"
		});
	}

	const dbUsernameUser = await User.findOne({ username: user.username });

	if (dbUsernameUser) {
		return res.status(400).json({
			message: "User already exists"
		});
	}

	try {
		const savedUser = await user.save()
		return res.send(savedUser);
	} catch (err) {
		return res.status(400).json({
			message: err.message
		});
	}
});

router.post('/login', async (req, res) => {
	const isValid = loginValidation(req.body);

	if (!isValid) {
		return res.status(400).json({
			message: "Invalid request"
		});
	}

	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return res.status(400).json({
			message: "Email or password is wrong"
		});
	}

	const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

	if (!isPasswordValid) {
		return res.status(400).json({
			message: "Email or password is wrong"
		});
	}

	const payload = { _id: user._id };
	const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN)

	return res.header('auth-token', token).json({
		message: 'Login success'
	});
});

module.exports = router;
