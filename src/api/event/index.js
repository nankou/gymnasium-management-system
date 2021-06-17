import {axiosK, axiosD,axiosP,axiosL,axiosG} from "@/api";

export const addEventApi = data => axiosK("event/addEvent", data); // 添加赛事
export const delEventApi = data => axiosD("event/delEvent", data); // 删除赛事
export const editEventApi = data => axiosP("event/editEvent", data); // 更改赛事
export const exportEventApi = data => axiosL("event/exportEvent", data); // 导出赛事列表
export const getEventApi = data => axiosG("event/getEvent", data); // 获得赛事详情
export const pageEventApi = data => axiosG("event/pageEvent", data); // 获得赛事列表
