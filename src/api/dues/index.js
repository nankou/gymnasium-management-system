import {axiosD, axiosG, axiosK, axiosL, axiosP} from "@/api";

/**
 * @module 党费管理
 * */
export const addPayApi = data => axiosK("pay/addPay", data); // 添加党费管理
export const delPayApi = data => axiosD("pay/delPay", data); // 删除党费管理
export const editPayApi = data => axiosP("pay/editPay", data); // 更改党费管理
export const exportPayApi = data => axiosL("pay/exportPay", data); // 导出党费管理
export const getPayApi = data => axiosG("pay/getPay", data); // 获得党费管理详情
export const isRemindApi = data => axiosG("pay/isRemind", data); // 是否提醒缴费
export const pagePayApi = data => axiosG("pay/pagePay", data); // 分页获得党费管理
export const remindApi = data => axiosK("pay/remind", data); // 提醒缴费
