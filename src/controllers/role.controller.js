
import * as roleService from "../services/role.service.js"
import responseHelper from "../helper/response.helper.js";
import { RoleResponse } from "../response/role.response.js";


export const addRole = async (req, res)=>{
    try{
        const roles = req.body;
        const result = await roleService.addRoleService(roles);
        return responseHelper.success(res, 'Roles added successfully', result.map(RoleResponse));
    }catch(err){
        console.error('Error in role.controller.controller inside addRole function');
    }
};