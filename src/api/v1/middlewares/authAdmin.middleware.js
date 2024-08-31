

const adminAccess = async (req, res, next) => {
    try {
        
        if(req.userRole !='admin'){
            return res.status(403).json({message: 'Access denied'});
        }
    } catch (err) {
         return res.error(err, err.message)
    }
    next();
}

module.exports = { adminAccess }