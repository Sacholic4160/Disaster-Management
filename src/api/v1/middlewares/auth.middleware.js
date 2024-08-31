const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../config/redis');

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({ error: "Unauthorized request: No token provided" });
    }

    //console.log(`Token: ${token}`);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(500).json({ error: `Failed to authenticate token: ${err.message}` });
      }
     // console.log('decoded token: ', decoded);

      // Check if the token exists in Redis
      const result = await redisClient.get(`authToken:${decoded.id}`);
      if (result !== token) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      //console.log('result:', result);

      req.userId = decoded.userId;
      req.userRole = decoded.role;
     // console.log('userId and userRole:', req.userId,req.userRole);

      next();
    });
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
};

module.exports = verifyJwt;
