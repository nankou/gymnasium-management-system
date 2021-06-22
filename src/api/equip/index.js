import {axiosK, axiosD,axiosP,axiosG} from "@/api";

export const addEquipApi =data=>axiosK("/equip/addEquip",data);//添加器材
export const delEquipApi =data=>axiosD("/equip/delEquip",data);//删除器材
export const editEquipApi = data => axiosP("/equip/editEquip", data); // 更改赛事
export const getEquipApi =data=>axiosG("/equip/getEquip",data);//获得器材详情
export const pageEquipApi =data=>axiosG("/equip/pageEquip",data);//获得器材列表
