
const jwt = require('jsonwebtoken')


const verifyJwt = async (req, res, next) => {
    const token = req?.cookies?.accessToken || req.header('Authorization')?.replace('Bearer', '')
    if (!token) return res.status(401).send({ message: 'No token provided'})
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN)
        req.user = verified
        next()
    } catch (error) {
      throw new error('Unauthorised request')  
    }
}

module.exports = verifyJwt