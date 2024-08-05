const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sendMail = require('../services/mail.service.js');
const redisClient = require('../config/redis.js');
require('dotenv').config();

const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userName, password, role, email, phone, location } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            userName,
            password: hashedPassword,
            role,
            email,
            phone,
            location: {
                type: 'Point',
                coordinates: location.coordinates
            }
        });

        res.status(201).json(user);

    } catch (error) {
        const message = error.message;
        console.log(message,error);
        res.status(500).json({ message: 'User creation failed' });
    }
};
const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id, email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

        // Ensure the Redis client is ready before using it
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        const redis = await redisClient.set(`authToken:${user.id}`, token, 'EX', process.env.ACCESS_TOKEN_EXPIRY);
        //console.log('redis', redis)
        if (user) {
            sendMail(user);
        }
        
        res.json(token);
    } catch (error) {
        const message = error.message;
        console.log(message);
        res.status(500).json({ message: 'User login failed' });
    }
};
module.exports = { registerUser, loginUser };
