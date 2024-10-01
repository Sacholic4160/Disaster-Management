const nodemailer = require('nodemailer')
const User = require('../models/user.model')
require('dotenv').config()

const sendMailTOAllUser = async (emails) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    const mailOptions = {
        from: 'Welcome to my heart!',
        to: emails,
        subject: 'Disaster Alert',
        text: 'This is to inform you about an ongoing lover far from you, i love you!'
    }

    

    transporter.sendMail(mailOptions, (res, error) => {
        if (err) {
            throw new error('Failed to send the email to User!', error)

        }
        else {
            res.json('sent mail to user! : ', res.response)

        }
    })
}
const sendMail = async () => {
    try {
        const users = await User.findAll();
        let emails = [];
        users.forEach((user) => {
            emails.push(user.email);
        })

        sendMailTOAllUser(emails);
    } catch (error) {
        throw new error('error while sending the email!')
    }
}

module.exports = sendMail;