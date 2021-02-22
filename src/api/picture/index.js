import {axiosD, axiosG, axiosK} from "@/api";

/**
 * @module 图片管理
 * */
export const addPictureApi = data => axiosK("picture/addPicture", data); // 添加图片
export const delPictureApi = data => axiosD("picture/delPicture", data); // 删除轮播图
export const listPictureApi = data => axiosG("picture/listPicture", data); // 获得轮播图
