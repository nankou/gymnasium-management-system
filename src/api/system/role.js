import {axiosD, axiosG, axiosJ, axiosU} from "@/api";

/**
 * @module 角色
 * */
export const addRoleApi = data => axiosJ("admin/role/addRole", data); // 新增角色
export const deleteRoleApi = data => axiosD("admin/role/delRole", data); // 删除角色
export const editRoleApi = data => axiosU("admin/role/editRole", data); // 编辑角色
export const listRoleApi = data => axiosG("admin/role/listRole", data); // 获得角色列表
export const getRoleApi = data => axiosG("admin/role/getRole", data); // 获得角色详情
export const getCurrentRoleApi = () => axiosG("admin/role/getCurrentRole"); // 获得当前用户的权限
export const getRoleTreeApi = () => axiosG("admin/role/treeRole"); // 获得权限树
