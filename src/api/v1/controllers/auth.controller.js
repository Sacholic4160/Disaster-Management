const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sendMail = require('../services/mail.service.js');
const redisClient = require('../config/redis.js');
const Permission = require('../models/permission.model.js');
const UserPermission = require('../models/userPermission.model.js');
const sequelize = require('../config/db.js');
require('dotenv').config();

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userName, password, role, email, phone, location, postal_code } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const transaction = await sequelize.transaction();

    try {
        // Ensure the location coordinates are valid
        if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
            throw new Error("Invalid location format. Expected coordinates array [longitude, latitude].");
        }

        const longitude = location.coordinates[0]; // Longitude is the first element
        const latitude = location.coordinates[1];  // Latitude is the second element

        // Log the parsed coordinates
        console.log("Parsed Longitude:", longitude, "Parsed Latitude:", latitude);

        // Create user with properly formatted geometry
        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            role,
            phone,
            postal_code,
            location: {
               type: location.type,
               coordinates: [longitude, latitude]
        }}, {
            transaction
        });

        console.log("User Created:", user);

        // Handle permissions (if needed)
        const defaultPermission = await Permission.findAll({ where: { is_default: 1 }, transaction });

        if (defaultPermission.length > 0) {
            const permissionArray = defaultPermission.map(permission => ({
                permission_name: permission.permission_name,
                permission_value: [0, 1, 2, 3]
            }));

            await UserPermission.create({
                user_id: user.id,
                permission: permissionArray
            }, { transaction });
        }

        await transaction.commit();

        return res.status(200).json({
            success: true,
            msg: 'User registered successfully!',
            data: user
        });
    } catch (error) {
        await transaction.rollback();
        console.log("Error:", error.message);
        return res.status(500).json({ message: 'User creation failed', error: error.message });
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
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

        if (redisClient.status !== 'ready') {
            try {
                await redisClient.connect();
            } catch (redisError) {
                console.error('Redis connection failed:', redisError.message);
                return res.status(500).json({ message: 'Redis error' });
            }
        }

        await redisClient.set(`authToken:${user.id}`, token, 'EX', process.env.REDIS_TOKEN_EXPIRY || 600000);

        const result = await User.findOne({
            where: { id: user.id },
            include: {
                model: UserPermission,
               // as: 'permissions',
                attributes: ['permission']
            },
            attributes: ['id', 'userName', 'email', 'role']
        });

        if (!result) {
            return res.status(404).json({ message: 'User or permissions not found' });
        }

        res.status(200).json({ message: 'Login successful', data: { result, token } });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: error.message });
    }
};


module.exports = { registerUser, loginUser };

