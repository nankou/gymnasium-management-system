import {axiosD, axiosG, axiosK, axiosP} from "@/api";

/**
 * @description 总学时
 * */
export const addLearnTimeApi = data => axiosK("video/addLearnTime", data); // 添加学时管理
export const delLearnTimeApi = data => axiosD("video/delLearnTime", data); // 删除学时管理
export const editLearnTimeApi = data => axiosP("video/editLearnTime", data); // 更改学时管理
export const getLearnTimeApi = data => axiosG("video/getLearnTime", data); // 获得学时管理详情
export const pageLearnTimeApi = data => axiosG("video/pageLearnTime", data); // 分页获得学时管理
