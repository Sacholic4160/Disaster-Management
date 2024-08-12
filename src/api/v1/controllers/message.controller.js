const { validationResult } = require("express-validator")

const sendMessage = async( req,res,pubnub) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({'errors:': errors.isArray()});
        
    }

    

}