const jwt = require('jsonwebtoken');

const verify = async (req, res, next) => {
	const token = req.header('auth-token');
	console.log('token', token);

	if (!token) {
		return res.status(401).json({
			message: 'Access denied',
		});
	}

	try {
		const verified = await jwt.verify(token, process.env.JWT_SECRET_TOKEN);
		console.log('verified', verified);
		req.user = verified;
		next();
	} catch (err) {
		return res.status(400).status({
			message: "Invalid token",
		});
	}
};

module.exports = {
	verify,
};