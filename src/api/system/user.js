import {axiosA, axiosD, axiosF, axiosG, axiosM} from "@/api";

/**
 * @module 角色
 * */
export const addUserApi = data => axiosA("admin/user/addUser", data);  // 新增用户
export const deleteUserApi = data => axiosD("admin/user/delUser", data);  // 删除用户
export const editUserApi = data => axiosM("admin/user/editUser", data);  // 编辑用户
export const editAvatarApi = data => axiosF("admin/user/editAvatar", data);  // 编辑头像
export const pageUserApi = data => axiosG("admin/user/pageUser", data);  // 获得用户列表
export const getUserLevelApi = () => axiosG("admin/user/getUserLevel");  // 获得角色级别
