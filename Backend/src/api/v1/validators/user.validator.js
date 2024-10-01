const { check } = require('express-validator');


const validateRegister = [
    check('userName').notEmpty().withMessage('UserName is required!'),
    check('email').isEmail().withMessage('Invalid email!'),
    check('password').isLength({ min: 6 }).withMessage('Password must be atlease 6 characters long'),
    check('role').notEmpty().withMessage('Role is required!'),
    check('phone').notEmpty().isMobilePhone('en-IN'),
    check('location').notEmpty().withMessage('location is required!')
]

const validateLogin = [
    check('email').isEmail().withMessage('Invalid email!'),
    check('password').isLength({ min: 6 }).withMessage('Password must be atlease 6 characters long'),
    
]



module.exports = { validateRegister, validateLogin }