const { check } = require('express-validator');

const validateAddDisaster = [
    check('name').notEmpty().withMessage('name is required'),
    check('description').notEmpty().withMessage('description is required'),
    check('status').notEmpty().withMessage('status is required'),
    check('location').notEmpty().withMessage('location is required')
]

module.exports = { validateAddDisaster, };