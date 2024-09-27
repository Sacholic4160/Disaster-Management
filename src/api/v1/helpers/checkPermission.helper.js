const User = require("../models/user.model");
const UserPermission = require("../models/userPermission.model");


const getUserPermissions = async (user_id) => {
    try {
        const userWithPermission = await User.findOne({
            where: {id : user_id},
            include: {
                model: UserPermission,
                as: 'permisssions',
                attributes: [permission]
            },
            attributes: [id, role, name, email]
        })

        console.log(userWithPermission);
        ``
    } catch (error) {
        throw error;
    }
}