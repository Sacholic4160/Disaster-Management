const twilio = require('twilio');
const { getAddressFromLatLong } = require('../controllers/alert.controller');
require('dotenv').config();

// Correctly access environment variables
const twilioClient = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const notifyUser = async (user, disaster) => {
    try {
        if (user.phone) {
            const address = getAddressFromLatLong(disaster.location.coordinates[0], disaster.location.coordinates[1]);
            const messageBody = `ALERT: A disaster has been reported near your location (${address}). Details: ${disaster.description}. Stay safe!`;

            const message = await twilioClient.messages.create({
                body: messageBody,
                from: 'your-twilio-phone-number', // Replace with your Twilio phone number
                to: user.phone
            });

            console.log('SMS sent:', message.sid);
        } else {
            console.log(`User ${user.id} does not have a phone number.`);
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

module.exports = { notifyUser };
