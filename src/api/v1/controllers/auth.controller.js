const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sendMail = require('../services/mail.service.js');
const redisClient = require('../config/redis.js');
const Permission = require('../models/permission.model.js');
const UserPermission = require('../models/userPermission.model.js');
const { where } = require('sequelize');
require('dotenv').config();

const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userName, password, role, email, phone, location, postal_code } = req.body;
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
            },
            postal_code
        });

        const defaultPermission = await Permission.findAll(
            { where: { is_default: 1 } });

        console.log(defaultPermission)

        const permissionArray = [];
        if (defaultPermission) {
            defaultPermission.forEach(permission => {
                permissionArray.push({
                    permission_name: permission.permission_name,
                    permission_value: [0, 1, 2, 3]
                })
            });
        }

        const userPermissions = await UserPermission.create({
            user_id: user.id,
            permission: permissionArray
        })
        console.log(userPermissions)


        return res.status(200).json({
            success: true,
            msg: 'User registered successfully!',
            data: user
        })

    } catch (error) {
        const message = error.message;
        console.log(message, error);
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

        const token = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });

        // Ensure the Redis client is ready before using it
        if (!redisClient.status === 'ready') {
            await redisClient.connect();
        }

        await redisClient.set(`authToken:${user.id}`, token, 'EX', 600000);

        // if (user) {
        //     sendMail(user);
        // }
        const result = await User.findOne({
            where: { id: user.id },
            include: {
                model: UserPermission,
                as: "permissions",
                attributes: ['permission']

            },
            attributes: ['id', 'userName', 'email', 'role', 'password']
        })
        console.log(result)
        res.status(200).json({ message: 'logIn successfully!', data: { result, token } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };

