const User = require("../models/user.model.js");
const UserPermission = require("../models/userPermission.model.js");
const routerPermission = require("../models/routePermission.model.js");
const Permission = require("../models/permission.model.js");


const getUserPermissions = async (user_id) => {
    try {
        const userWithPermission = await User.findOne({
            where: {id : user_id},
            include: {
                model: UserPermission,
               // as: 'permissions',
                attributes: ['permission']
            },
            attributes: ['id', 'role', 'userName', 'email']
        })

       // console.log('userWithPermission: ', userWithPermission );
        return userWithPermission

    } catch (error) {
        throw error;
    }

}

const getRouterPermission = async(router, role) => {
    console.log(router, role)
    try {
        const routePermission = await routerPermission.findOne({
            where: {
                router_endpoint: router,
                role: role
            },
            include: Permission
        })
        console.log('routePermission: ', routePermission );
        if(routePermission) return routePermission
    } catch (error) {
        throw error
    }
}

module.exports = { getRouterPermission, getUserPermissions }