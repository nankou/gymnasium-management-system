import {axiosK, axiosD,axiosP,axiosG} from "@/api";

export const addFieldApi = data => axiosK("field/addField", data); // 添加场地
export const delFieldApi = data => axiosD("field/delField", data); // 删除场地
export const editFieldApi = data => axiosP("field/editField", data); // 更改场地
export const getFieldApi = data => axiosG("field/getField", data); // 获得场地详情
export const pageFieldApi = data => axiosG("field/pageField", data); // 获得场地列表


export const addFineNoticeApi = data => axiosK("fineNotice/addFineNotice", data); // 添加场馆公告
export const delFineNoticeApi = data => axiosD("fineNotice/delFineNotice", data); // 删除场馆公告
export const editFineNoticeApi = data => axiosP("fineNotice/editFineNotice", data); // 更改场馆公告
export const getFineNoticeApi = data => axiosG("fineNotice/getFineNotice", data); // 获得场馆公告详情
export const pageFineNoticeApi = data => axiosG("fineNotice/pageFineNotice", data); // 获得场馆公告列表
