const express = require('express');
const { isAdmin } = require('../controllers/verificationController')

const router = express.Router();

router.route('/is_admin').post(isAdmin);

module.exports = router;
