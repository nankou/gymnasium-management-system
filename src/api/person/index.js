import {axiosD, axiosG, axiosP} from "@/api";

/**
 * @module 个人中心
 * */
export const getUserInfoApi = () => axiosG("admin/login/getUserInfo"); // 获取用户信息
export const logoutApi = () => axiosD("admin/login/logout"); // 退出登录
export const updatePassApi = data => axiosP("admin/user/editPass", data); // 修改密码
export const editMyUserApi = data => axiosP("admin/user/editMyUser", data); // 修改个人信息
export const getUserLogApi = data => axiosG("log/pageUserLog", data); // 个人日志
