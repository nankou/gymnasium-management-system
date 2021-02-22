import {axiosD, axiosG, axiosJ, axiosK, axiosP} from "@/api";

/**
 * @module 菜单
 * */
export const addMenuApi = data => axiosK("admin/menu/addMenu", data); // 新增菜单
export const deleteMenuApi = data => axiosD("admin/menu/delMenu", data); // 删除菜单
export const editMenuApi = data => axiosP("admin/menu/editMenu", data); // 编辑菜单
export const editRolesMenusApi = data => axiosJ("admin/menu/editRolesMenus", data); // 编辑权限
export const getMenuApi = () => axiosG("admin/menu/treeMenu"); // 获取菜单
export const getAllMenuApi = data => axiosG("admin/menu/treeAllMenu", data); // 获取所有菜单
