const User = require('../models/user.model.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router()
require('dotenv').config()

router.post('/register', async (req, res) => {
    try {
        const { userName, password, role, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ userName, password: hashedPassword, role, email })
        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({ error: 'user creation failed' })
    }

})

router.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' })

        const token = jwt.sign({ userId: user.id, email, role: user.id }, process.env.ACCESS_TOKEN, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
        res.json(token)
    } catch (error) {
        res.status(500).json({ error: 'user login failed!' })
    }
})


module.exports = router;
