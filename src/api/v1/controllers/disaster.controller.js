const { validationResult } = require("express-validator");
const Disaster = require("../models/disaster.model");



const addDisaster = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, location, status, photo } = req.body
        const fileUrl = req.file.location;
        const token = req.header('Authorization')?.replace('Bearer', '')
        const informerId = token.userId
        console.log(location, fileUrl, token, informerId)
        const data = new Disaster({
            name,
            description,
            location: {
                type: 'Point',
                coordinates: location.coordinates,
            },
            status,
            photo: fileUrl,
            informerId
        })
        const disaster = await data.save();

        res.status(200).json({ disaster })


    } catch (error) {
        res.status(500).json(error.message)
    }
}




module.exports = { addDisaster, }