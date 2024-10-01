const User = require("../models/user.model");
const Volunteer = require("../models/volunteer.model");
const { notifyUser } = require("../services/sms.service");
const axios = require('axios')

const alertUsersNearDisaster = async (disaster) => {
    try {
        // Find users in the affected postal code area
        const users = await User.findAll({
            where: {
                postal_code: disaster.postal_code
            }
        });

        // Find volunteers in the affected postal code area
        const volunteers = await Volunteer.findAll({
            where: {
                postal_code: disaster.postal_code
            }
        });

        // Notify users
        for (const user of users) {
            await notifyUser(user, disaster);
        }

        // Notify volunteers
        for (const volunteer of volunteers) {
            await notifyUser(volunteer, disaster);
        }

        console.log('Notification process completed successfully.');
        
    } catch (error) {
        console.error('Error alerting users and volunteers:', error);
    }
};


const getAddressFromLatLong = async(lat, lng) => {
    try {
        const apiKey =process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
   
        const response = await axios.get(url);
       if(response.data.status ==='OK'){
        const address = response.data.results[0].formatted_address;
        return address;
       }
       else{
        throw new Error('Error while fetching address from lat and long!');
       }
    } catch (error) {
        throw  new error(error.message);
    }
}




module.exports = {  getAddressFromLatLong, alertUsersNearDisaster }

