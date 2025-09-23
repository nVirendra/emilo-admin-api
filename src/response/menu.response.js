export const menuResponse = (menu) => ({
  id: menu._id,
  title: menu.title,
  path: menu.path,
  icon: menu.icon || null,
  parentId: menu.parentId || null,
  order: menu.order,
  status: menu.status,
});
