

import { RoleModel } from "../models/clt_roles.js"

export const addRoleService =  async(roles)=>{
    const data = await RoleModel.insertMany(roles);
    return data;
}