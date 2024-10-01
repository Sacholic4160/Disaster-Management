const express = require('express');
const verifyJwt = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin } = require('../validators/user.validator');
const { registerUser, loginUser } = require('../controllers/auth.controller');
const router = express.Router();


router.post('/register', validateRegister, registerUser)

router.post('/login', validateLogin, loginUser)

module.exports = router