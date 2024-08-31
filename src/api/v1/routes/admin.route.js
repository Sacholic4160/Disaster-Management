const express = require('express')
const router = express();
const verifyJwt = require('../middlewares/auth.middleware.js');
const { adminAccess } = require('../middlewares/authAdmin.middleware.js');
const { createPermission, getPermission, updatePermission, deletePermission } = require('../controllers/admin/permission.controller.js');


//......................Permission added by admin...............................//
router.post('/add-permission', verifyJwt, adminAccess, createPermission);
router.get('/get-permission',verifyJwt, adminAccess, getPermission)
router.post('/edit-permission/:id', verifyJwt, adminAccess, updatePermission);
router.delete('/delete-permission', verifyJwt, adminAccess, deletePermission)

module.exports = router;