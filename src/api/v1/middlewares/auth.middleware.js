const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../config/redis'); // Ensure the correct path to your Redis client

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({ error: "Unauthorized request: No token provided" });
    }

    //console.log(`Token: ${token}`);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).json({ error: `Failed to authenticate token: ${err.message}` });
      }

      // Check if the token exists in Redis
      redisClient.get(`authToken:${decoded.userId}`, (err, result) => {
        if (err || result !== token) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        req.userId = decoded.userId;
        req.userRole = decoded.role;

        next();
      });
    });
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
};

module.exports = verifyJwt;
