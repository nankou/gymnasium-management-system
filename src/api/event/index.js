import {axiosK, axiosD,axiosP,axiosG} from "@/api";

/**
 * @module 赛事管理
 * */

export const addEventApi = data => axiosK("event/addEvent", data); // 添加赛事
export const delEventApi = data => axiosD("event/delEvent", data); // 删除赛事
export const editEventApi = data => axiosP("event/editEvent", data); // 更改赛事
export const getEventApi = data => axiosG("event/getEvent", data); // 获得赛事详情
export const pageEventApi = data => axiosG("event/pageEvent", data); // 获得赛事列表

/**
 * @module 裁判公告
 * */
export const addJudgeNoticeApi = data => axiosK("judgeNotice/addJudgeNotice", data); // 添加裁判公告
export const delJudgeNoticeApi = data => axiosD("judgeNotice/delJudgeNotice", data); // 删除裁判公告
export const editJudgeNoticeApi = data => axiosP("judgeNotice/editJudgeNotice", data); // 更改裁判公告
export const getJudgeNoticeApi = data => axiosG("judgeNotice/getJudgeNotice", data); // 获得裁判公告详情
export const pageJudgeNoticeApi = data => axiosG("judgeNotice/pageJudgeNotice", data); // 获得裁判公告列表


/**
 * @module 赛事场地管理
 * */

export const addFieldReservationApi = data => axiosK("fieldReservation/addFieldReservation", data); // 添加场地预约
export const delFieldReservationApi = data => axiosD("fieldReservation/delFieldReservation", data); // 删除场地预约
export const editFieldReservationApi = data => axiosP("fieldReservation/editFieldReservation", data); // 更改场地预约
export const exportFieldReservationApi = data => axiosL("fieldReservation/exportFieldReservation", data); // 导出场地预约列表
export const getFieldReservationApi = data => axiosG("fieldReservation/getFieldReservation", data); // 获得场地预约详情
export const pageFieldReservationApi = data => axiosG("fieldReservation/pageFieldReservation", data); // 获得场地预约列表

/**
 * @module 赛事器材管理
 * */

export const addRentEquipmentApi = data => axiosK("rentEquipment/addRentEquipment", data); // 添加器材状态
export const delRentEquipmentApi = data => axiosD("rentEquipment/delRentEquipment", data); // 删除器材状态
export const editRentEquipmentApi = data => axiosP("rentEquipment/editRentEquipment", data); // 更改器材状态
export const exportRentEquipmentApi = data => axiosL("rentEquipment/exportRentEquipment", data); // 导出器材状态列表
export const getRentEquipmentApi = data => axiosG("rentEquipment/getRentEquipment", data); // 获得器材状态详情
export const pageRentEquipmentApi = data => axiosG("rentEquipment/pageRentEquipment", data); // 获得器材状态列表


