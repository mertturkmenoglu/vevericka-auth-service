const express = require('express');
const router = express.Router();

const { verify } = require('./tokenVerify');

router.get('/', verify, (req, res) => {
	res.json({
		posts: [
			{
				_id: "1234",
				username: "Mert",
				content: "Kotlin is great"
			},
			{
				_id: "2345",
				username: "Cagdas",
				content: "React is great"
			}
		]
	});
});

module.exports = router;
