const { Op } = require('sequelize');
const Permission = require('../../models/permission.model');



const createPermission = async (req, res) => {
    try {
        let { permission_name, is_default } = req.body;
        console.log(permission_name, is_default);

        if (!permission_name) {
            return res.status(400).json({ message: 'Name of the permission is required!' });
        }

        const permission = await Permission.findOne({
            where: {
                permission_name: {
                    [Op.iLike]: `%${permission_name}%` // Fixed the template string syntax here as well
                }
            }
        });

        if (permission) {
            return res.status(400).json({ message: 'Permission name already exists!' });
        }

        if (is_default) is_default = parseInt(is_default);

        const permission_data = await Permission.create({
            permission_name: permission_name,
            is_default: is_default
        });

        return res.status(200).json({ message: 'Permission created successfully!', data: permission_data });

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}


const getPermission = async (req, res) => {
    try {

        if (req.body.permission_name) {
            const permission = await Permission.findOne({
                where: {
                    permission_name: {
                        [Op.iLike]: '%${permission_name}%'
                    }
                }
            })
            return res.status(200).json({ message: 'permission fetched successfully!', data: permission });
        }
        else if (req.params.id) {
            const permission = await Permission.findByPk(req.params.id);
            return res.status(200).json({ message: 'permission fetched successfully!', data: permission });

        }
        else {
            const permission = await Permission.findAll();
            return res.status(200).json({ message: 'permissions fetched successfully!', data: permission });
        }

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

const updatePermission = async (req, res) => {
    try {

        let { permission_name, is_default } = req.body;

        const isExists = await Permission.findByPk(req.params.id);

        if (!isExists) return res.status(404).json({ message: 'permission not found!' });

        const isNameAssigned = await Permission.findOne({
            where: {
                id: {
                    [Op.ne]: req.params.id
                },
                permission_name: {
                    [Op.iLike]: '%${permission_name}%'
                }
            }
        })
        console.log(isNameAssigned)

        if (isNameAssigned) return res.status(400).json({ message: 'permission name already assigned!' });

        if (is_default) is_default = parseInt(is_default);

        const updatedPermission = await Permission.update({
            permission_name: permission_name,
            is_default: is_default,

        },
            {

                where: { id: req.params.id }
            })



        return res.status(200).json({ message: 'permission updated successfully!', data: updatedPermission });


    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

const deletePermission = async (req, res) => {
    try {
        if (req.body.permission_name) {
            const permission = await Permission.findOne({
                where: {
                    permission_name: {
                        [Op.iLike]: '%${permission_name}%'
                    }
                }
            })
            if (!permission) return res.status(404).json({ message: 'permission not found!' })

            await Permission.destroy(permission);
            return res.status(200).json({ message: 'permission deleted successfully!' });
        }
        else {
            const permission = await Permission.findByPk(req.params.id);
            if (!permission) return res.status(404).json({ message: 'permission not found!' })

            await Permission.destroy(permission);
            return res.status(200).json({ message: 'permission deleted successfully!' });

        }

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

module.exports = { createPermission, getPermission, updatePermission, deletePermission }