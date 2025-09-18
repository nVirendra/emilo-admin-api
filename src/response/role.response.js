export const RoleResponse =(role)=>({
    id: role._id,
    roleName: role.roleName,
    roleKey: role.roleKey,
    roleType: role.roleType,
    description: role.description,
    isActive: role.isActive,
})