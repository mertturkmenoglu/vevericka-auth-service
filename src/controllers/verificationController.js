const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { is } = require('../helpers/helper')

const isAdmin = async (req, res) => {
    const { token } = req.body;

    if (!is(token)) {
        return res.status(400).json({
            message: "Invalid request"
        });
    }

    let id;

    try {
        id = jwt.verify(req.body.token, process.env.JWT_SECRET_TOKEN)
    } catch (e) {
        return res.status(400).json({
            message: "Invalid request"
        });
    }

    if (!is(id)) {
        return res.status(400).json({
            message: "Invalid request"
        });
    }

    const user = await User.findById(id);

    if (!is(user)) {
        return res.status(400).json({
            message: "Invalid request"
        });
    }

    const isAdmin = user['is_admin'] || false;

    return res.status(200).json({
        isAdmin
    });
}

module.exports = {
    isAdmin,
};