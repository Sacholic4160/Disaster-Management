const { check } = require("express-validator");

const addOrUpdateRouterValidator = [
    check('router_endpoint').notEmpty().withMessage('router_endpoint is required!'),
    check('permission_id').notEmpty().withMessage('permission_id is required'),
    check('permission').notEmpty().withMessage('permission is required!'),
    check('role').notEmpty().withMessage('role is required!')
]

const getRouterValidator = [
    check('router_endpoint').notEmpty().withMessage('router_endpoint is required!'),
]


module.exports = {addOrUpdateRouterValidator, getRouterValidator}