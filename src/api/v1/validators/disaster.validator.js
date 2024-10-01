const { check } = require('express-validator');

const validateAddDisaster = [
    check('name').notEmpty().isString().withMessage('Name must be a string'),
    check('description').notEmpty().isString().withMessage('Description must be a string'),
    check('status').notEmpty().isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),
    check('location').notEmpty().custom(value=> {
        location = JSON.parse(value);
        if(!location.type || location.type != 'Point' || !Array.isArray(location.coordinates) || location.coordinates.length != 2){
            throw new error('Location must be a Point with two coordinates')
        }
        return true;
    }).withMessage('location is required')
]
const validateUpdateDisaster = [
   // check('id').isUUID().withMessage('disaster ID is required'),
    check('name').optional().isString().withMessage('Name must be a string'),
    check('description').optional().isString().withMessage('Description must be a string'),
    check('status').optional().isIn(['active', 'inactive']).withMessage('Status must be either active or inactive'),
    check('location').optional().custom(value=> {
        location = JSON.parse(value);
        if(!location.type || location.type != 'Point' || !Array.isArray(location.coordinates) || location.coordinates.length != 2){
            throw new error('Location must be a Point with two coordinates')
        }
        return true;
    }).withMessage('location is required')
]

module.exports = { validateAddDisaster, validateUpdateDisaster };