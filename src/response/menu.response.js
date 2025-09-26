export const menuResponse = (menu) => ({
  id: menu._id,
  title: menu.title,
  path: menu.path,
  apiPath: menu.apiPath,
  icon: menu.icon || null,
  parentId: menu.parentId || null,
  order: menu.order,
  status: menu.status,
});



export const permissionResponse = (permission) => ({
  id: permission._id,
  key: permission.key,
  label: permission.label,
  description: permission.description,
  status: permission.status || null,
});
