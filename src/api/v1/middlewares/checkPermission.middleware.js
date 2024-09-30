const  { getRouterPermission, getUserPermissions } = require("../helpers/checkPermission.helper");



const checkUserPermissions = async (req, res, next ) => {
    try {
        const user = req.user;
        if(user.role !== "admin") {
            const userId = user.id;

        const userPermission = await getUserPermissions(userId);
        const routerPermission = await getRouterPermission(req.path, user.role);

        console.log('userPermission:', userPermission);
        console.log('routerPermission:', routerPermission);


        }
        next();
    } catch (error) {
        throw error
    }
}

module.exports = { checkUserPermissions }