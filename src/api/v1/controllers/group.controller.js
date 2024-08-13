const Group = require('../models/group.model');
const Channel = require('../models/channel.model');

const createGroup = async (req, res) => {
  try {
    const groupDetails = req.body;

    const existingGroup = await Group.findOne({ where: { name: groupDetails.name } });
    if (existingGroup) return res.status(400).json({ message: 'Group with this name already exists!' });

    // Create the group
    const group = await Group.create({
      name: groupDetails.name,
      description: groupDetails.description,
      createdBy: req.userId,
      members: groupDetails.members
    });

    if (!group) return res.status(400).json({ message: 'Error while creating the group!' });

    // Create a dedicated channel for the group
    const channel = await Channel.create({
      isGroup: true,
      name: groupDetails.name,
      members: groupDetails.members,
      groupId: group.id
    });

    if (!channel) return res.status(400).json({ message: 'Error while creating the channel!' });

    return res.status(200).json({ data: { group, channel }, message: 'Group and channel created successfully!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const getGroup = async (req, res) => {
  try {
    const groupId = req.params.id;

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(400).json({ message: 'Group with this id does not exist!' });

    return res.status(200).json({ data: group, message: 'Group fetched successfully!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { createGroup, getGroup }
