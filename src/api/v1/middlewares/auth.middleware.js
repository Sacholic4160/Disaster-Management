
const jwt = require('jsonwebtoken')


const verifyJwt = async (req, res, next) => {
    const token = req?.cookies?.accessToken || req.header('Authorization')?.replace('Bearer', '')
    if (!token) return res.status(401).send({ message: 'No token provided'})
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
    
        // Check if the token exists in Redis
        redisClient.get(`authToken:${decoded.userId}`, (err, result) => {
          if (err || result !== token) return res.status(401).json({ error: 'Invalid token' });
    console.log(result)
          req.userId = decoded.userId;
          req.userRole = decoded.role;
          
        next()
      });
    });
    } catch (error) {
      throw new error('Unauthorised request')  
    }
}

module.exports = verifyJwt