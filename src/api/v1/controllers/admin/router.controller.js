const { validationResult } = require('express-validator')
const routerPermission = require('../../models/routePermission.model');
const { where } = require('sequelize');
//const Permission = require('../../models/permission.model');

const addOrUpdateRouterPermission = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(200).json({ message: "errors", errors: errors.array() })
        }

        const { router_endpoint, role, permission, permission_id } = req.body;

        const routerPermissionData = await routerPermission.find({
            router_endpoint, role
        })

        if (!routerPermissionData) {
            const newRouterPermission = new routerPermission({
                router_endpoint, role, permission, permission_id
            })
            await newRouterPermission.save()
            return res.status(200).json({ message: "Router Permission Added Successfully", data: newRouterPermission })
        }

        const updatedData = routerPermission.update({
            router_endpoint, role, permission, permission_id
        })

        return res.status(200).json({ message: "Router Permission Updated Successfully", data: updatedData })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error
        })
    }
}

const getAllRoutes = async (req,res) => {
    try {
        
        const routes = [];
 const tempRoutes = req.app._router.stack;
 tempRoutes.forEach((layer) => {
    if (layer.route) { // Check if the layer contains a route
        routes.push({
            path: layer.route.path,
            methods: layer.route.methods,
        });
    }
});


        return res.status(200).json({
            success: true,
            msg: 'All Routes Fetched Successfully',
            data: routes
        }) 

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        }) 
    }
}

const getRouterPermission = async(req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(200).json({ message: "errors", errors: errors.array() })
        }

        const { router_endpoint } = req.body;

        const routerPermissionData = await routerPermission.findAll(
      {
        where: {router_endpoint: router_endpoint},
        include: [
            {
                model: Permission,
                as: permission
            }
        ]
      }
    );

        return res.status(200).json({
            success: true,
            message:"Router Permission Fetched Successfully!",
            data: routerPermissionData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error
        }) 
    }
}
module.exports = { getAllRoutes, addOrUpdateRouterPermission, getRouterPermission }