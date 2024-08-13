const { validationResult } = require("express-validator");
const Channel = require("../models/channel.model");
const { Op } = require('sequelize');
const { createPersonalChannel } = require("./channel.controller");
const Message = require("../models/message.model");

const sendMessage = async (req, res, pubnub) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 'errors:': errors.array() });
        }

        const messageDetails = req.body;

        if (messageDetails.mediaUrl) messageDetails.mediaUrl = req.file.location;
        const senderId = req.userId;
        let channelId;

        if (messageDetails.groupId) {
            //sending to a group

            const channel = await Channel.findOne({ where: { groupId: messageDetails.groupId, isGroup: true } });
            if (!channel) return res.status(404).json({ message: "Group with this id not found" })
            channelId = channel.id;
            pubnubChannel = `group_${groupId}`;
        }
        else {
            //sending to a person

            const channel = createPersonalChannel(senderId, messageDetails.recieverId);

            channelId = channel.id;
            pubnubChannel = `direct_${senderId}_${receiverId}`;

        }

        const message = await Message.create({
            senderId,
            messageDetails,
            channelId
        })

        pubnub.publish({
            channel: pubnubChannel,
            message: message,
        }, (status, response) => {
            if (status.error) {
                console.error('Error publishing message:', status);
                return res.status(500).json({ message: 'Error sending message to PubNub!' });
            } else {
                console.log('Message published successfully:', response);
                return res.status(200).json({ data: message, message: 'Message sent successfully!' });
            }
        }
        )

        return res.status(200).json({ data: message, message: 'Message sent successfully!' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


module.exports = { sendMessage, }