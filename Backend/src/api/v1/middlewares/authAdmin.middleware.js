

const adminAccess = async (req, res, next) => {
    try {
        
        if(req.userRole !='admin'){
            return res.status(403).json({message: 'You are not authorized to access this route!!'});
        }
    } catch (err) {
         return res.error(err, err.message)
    }
    next();
}

module.exports = { adminAccess }