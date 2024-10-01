const {check} = require('express-validator');

validateSendMessage = [
    check('text').optional().isString().withMessage('message cannot be empty!'),
    check('mediaUrl').optional().withMessage('media file is required!'),
    check('recieverId').notEmpty().isUUID().withMessage('recieverId is required!')
]

module.exports = { validateSendMessage}