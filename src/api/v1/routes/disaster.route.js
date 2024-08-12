const express = require('express');
const verifyJwt = require('../middlewares/auth.middleware');
const { validateAddDisaster } = require('../validators/disaster.validator');
const { addDisaster } = require('../controllers/disaster.controller');
const upload = require('../middlewares/multer.middleware');
const router = express.Router();


router.post('/add', verifyJwt, upload.single('photo'), validateAddDisaster, (req, res) => addDisaster(req, res, req.pubnub))

//router.post('/login', validateLogin, loginUser)

module.exports = router