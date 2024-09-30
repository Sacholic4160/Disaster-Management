const  { getRouterPermission, getUserPermissions } = require("../helpers/checkPermission.helper");



const checkUserPermissions = async (req, res ) => {
    try {
        const user = req.user;
        if(user.role !== "admin") {
            const userId = user.id;
        
        const userPermission = await getUserPermissions(userId);
        const routerPermission = await getRouterPermission(req.path, user.role);

        console.log(userPermission, routerPermission);

        }
    } catch (error) {
        throw error
    }
}

module.exports = { checkUserPermissions }