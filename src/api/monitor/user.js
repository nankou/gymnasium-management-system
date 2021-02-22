import {axiosD, axiosG} from "@/api";

/**
 * @module 在线用户
 * */
export const getOnlineUserApi = data => axiosG("user/online/pageOnLineUser", data); // 查询在线用户
export const deleteOnlineUserApi = data => axiosD("user/online/kickOut", data); // 踢出用户
