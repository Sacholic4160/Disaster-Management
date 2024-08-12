const { check } = require('express-validator');

const validateAddDisaster = [
    check('name').notEmpty().withMessage('name is required'),
    check('description').notEmpty().withMessage('description is required'),
    check('status').notEmpty().isIn(['active', 'inactive']).withMessage('status is required'),
    check('location').notEmpty().withMessage('location is required')
]
const validateUpdateDisaster = [
    check('id').isUUID().withMessage('disaster ID is required'),
    check('name').optional().withMessage('name is required'),
    check('description').optional().withMessage('description is required'),
    check('status').optional().isIn(['active', 'inactive']).withMessage('status is required'),
    check('location').optional().custom(value=> {
        location = JSON.parse(value);
        if(!location.type || location.type != 'Point' || !Array.isArray(location.coordinates) || location.coordinates.length != 2){
            throw new error('Location must be a Point with two coordinates')
        }
        return true;
    }).withMessage('location is required')
]

module.exports = { validateAddDisaster, validateUpdateDisaster };