const express = require('express');
const PubNub = require('pubnub');
const sequelize = require('./src/api/v1/config/db.js');
const path = require('path');
const Rider = require('./src/api/v1/models/disaster.model.js')
const userRoutes = require('./src/api/v1/controllers/user.controller.js')
const verifyJwt = require('./src/api/v1/middlewares/auth.middleware.js')
const morgan = require('morgan');

const app = express();

const pubnub = new PubNub({
    publishKey: 'pub-c-cfee3158-378c-4920-a60c-264321565feb',
    subscribeKey: 'sub-c-a73ecf59-d684-4f3f-9c2f-b4425f0e66bc',
    userId: "sec-c-OGI2YzU5OGItNmE5ZS00MThmLTgzYjQtODIxMDRjOGE3ZDE1"
});

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


app.use(morgan('combined'));
sequelize.sync();

app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/update-location', async (req, res) => {
    const { name, latitude, longitude } = req.body;
    try {
        const location = await Rider.create({ name, latitude, longitude });
        pubnub.publish({
            channel: 'rider-locations',
            message: { name, latitude, longitude }
        });
        console.log('pubnub', pubnub)
        res.status(200).send(location);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint to get all rider locations
app.get('/locations', async (req, res) => {
    try {
        const locations = await Rider.findAll();
        res.status(200).send(locations);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
