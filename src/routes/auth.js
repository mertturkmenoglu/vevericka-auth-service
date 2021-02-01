const express = require('express');
const { register, login, resetPassword, sendPasswordResetEmail } = require('../controllers/authController')

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/reset_password').post(resetPassword);
router.route('/send_password_reset_email').post(sendPasswordResetEmail);

module.exports = router;
