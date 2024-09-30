const express = require('express')
const router = express();
const verifyJwt = require('../middlewares/auth.middleware.js');
const { adminAccess } = require('../middlewares/authAdmin.middleware.js');
const { createPermission, getPermission, updatePermission, deletePermission } = require('../controllers/admin/permission.controller.js');
const { validateRouterPermission, addOrUpdateRouterValidator } = require('../validators/router.validator.js');
const { addOrUpdateRouterPermission, getAllRoutes, getRouterPermission } = require('../controllers/admin/router.controller.js');
const { checkUserPermissions } = require('../middlewares/checkPermission.middleware.js');



//......................Permission added by admin...............................//
router.post('/add-permission', verifyJwt, checkUserPermissions,  adminAccess, createPermission);
router.get('/get-permission',verifyJwt, adminAccess, getPermission)
router.post('/edit-permission/:id', verifyJwt, adminAccess, updatePermission);
router.delete('/delete-permission', verifyJwt, adminAccess, deletePermission)



//...................Router Permission.................................//
router.post('/addOrEdit', verifyJwt, checkUserPermissions, addOrUpdateRouterValidator, addOrUpdateRouterPermission);
router.get('/allRoutes', verifyJwt, checkUserPermissions, getAllRoutes)
router.get('/routerPermission', verifyJwt, checkUserPermissions, getRouterPermission)

module.exports = router;