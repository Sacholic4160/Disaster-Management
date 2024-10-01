const Channel = require("../models/channel.model");


const createPersonalChannel = async(senderId, recieverId) =>{

  try {

 const channel = await Channel.findOne({
    where:{
        isGroup: false,
        members: {
            [Op.contains]:[senderId,recieverId]
        }
    }
 })
 if (!channel) {
    const newChannel = await Channel.create({
        isGroup: false,
        members: [senderId,recieverId],
        name: `${senderId}_${recieverId}`
        });

 }
 return channel;
  } catch (err) {
    throw new err(err.message)
  }
}

module.exports = { createPersonalChannel, }