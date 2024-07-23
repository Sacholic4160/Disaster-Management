const express = require('express')
const PubNub = require('pubnub')
const app = express();

const pubnub = new PubNub({
    publishKey: 'pub-c-cfee3158-378c-4920-a60c-264321565feb',
    subscribeKey: 'sub-c-a73ecf59-d684-4f3f-9c2f-b4425f0e66bc'
})

app.use(express.static('public'));

app.listen( 4000, () => {
    console.log('Server is running on port 4000')
} )