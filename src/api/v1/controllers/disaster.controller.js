const { validationResult } = require("express-validator");
const Disaster = require("../models/disaster.model");
const { response } = require("express");
const { Sequelize } = require("sequelize");




const addDisaster = async (req, res, pubnub) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, status } = req.body;
        const location = JSON.parse(req.body.location);
        const fileUrl = req.file.location;
        const data = new Disaster({
            name,
            description,
            location: {
                type: location.type,
                coordinates: location.coordinates,
            },
            status,
            photo: fileUrl,
            informerId: req.userId
        })
        const disaster = await data.save();

        pubnub.publish({
            channel: 'disasters',
            message: disaster
        }, (status, response) => {
            if (status.error) {
                throw new error(`pubnub error: ${status.error}`)
            }
            else {
                console.log(`pubnub success: ${response}`)
            }
        })


        res.status(200).json({ disaster })


    } catch (error) {
        res.status(500).json(error.message)
    }
}

const updateDisaster = async (req, res, pubnub) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const updates = req.body;
        const id = req.params.id;
        if (updates.photo) updates.photo = req.file.location;
        if (updates.location) updates.location = JSON.parse(req.body.location);

        const disaster = await Disaster.findByPk(id);
        if (!disaster) {
            return res.status(404).json({ message: 'Disaster not found' });
        }

        const updateDisaster = await disaster.update(updates);

        pubnub.publish({
            channel: 'disaster',
            message: updateDisaster,
        }, (status, response) => {
            if (status.error) throw new error(status.error)
            else console.log(`message sent successfully!: ${response}`)
        })

        res.status(200).json({data: updateDisaster, message:'disaster updated successfully!'})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDisasters = async (req, res) => {
    try {
        const disasters = await Disaster.findAndCountAll();

        if (!disasters) throw new error('no disasters are present!');

        res.status(200).json({  message: 'disasters found!', data: disasters});


    } catch (error) {
        res.status(500).json(error.message)
    }
}


const getDisasterById = async (req, res) => {
    try {
        const id = req.params.id;

        const disaster = await Disaster.findByPk(id);

        if (!disaster) throw new error('no disaster is present for this id!');

        res.status(200).json({data:disaster, message:'disaster found!'});


    } catch (error) {
        res.status(500).json(error.message)
    }
}

const getDisastersNearYou = async (req, res) => {
    try {

        const { latitude, longitude, radius } = req.body;
        console.log(latitude,longitude,radius)

        if (!(latitude || longitude)) throw new error('latitude and longitude are required!');


        const disasters = await Disaster.findAll({
            where: Sequelize.where(
                Sequelize.fn('ST_DWithin',
                    Sequelize.col('location'),
                    Sequelize.fn('ST_MakePoint', latitude, longitude),
                     radius * 1000
                ),
                true,
            )

        })
     //   console.log(disasters)
        if (disasters.length == 0) res.status(200).json({message:'no disaster found in this radius near you!'});

        res.status(200).json({data: disasters, message:'disaster near you'})



    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { addDisaster, updateDisaster, getDisasters, getDisasterById, getDisastersNearYou }