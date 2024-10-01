const express = require('express');
const verifyJwt = require('../middlewares/auth.middleware');
const { validateAddDisaster, validateUpdateDisaster } = require('../validators/disaster.validator');
const { addDisaster, updateDisaster, getDisasters, getDisasterById, getDisastersNearYou } = require('../controllers/disaster.controller');
const upload = require('../middlewares/multer.middleware');
const router = express.Router();


router.post('/add', verifyJwt, upload.single('photo'), validateAddDisaster, (req, res) => addDisaster(req, res, req.pubnub))

router.patch('/edit/:id', verifyJwt, upload.single('photo'), validateUpdateDisaster, (req, res) => updateDisaster(req, res, req.pubnub))

router.get('/', verifyJwt, getDisasters);

router.get('/:id', verifyJwt, getDisasterById);

router.get('/nearBy', verifyJwt, getDisastersNearYou);

module.exports = router