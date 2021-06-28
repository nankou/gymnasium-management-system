import {axiosK, axiosD,axiosP,axiosG} from "@/api";

export const addEquipApi =data=>axiosK("/equip/addEquip",data);//添加器材
export const delEquipApi =data=>axiosD("/equip/delEquip",data);//删除器材
export const editEquipApi = data => axiosP("/equip/editEquip", data); // 更改赛事
export const getEquipApi =data=>axiosG("/equip/getEquip",data);//获得器材详情
export const pageEquipApi =data=>axiosG("/equip/pageEquip",data);//获得器材列表

export const addRentEquipmentApi =data=>axiosK("/rentEquipment/addRentEquipment",data);//添加器材状态
export const delRentEquipmentApi =data=>axiosD("/rentEquipment/delRentEquipment",data);//删除器材状态
export const editRentEquipmentApi =data=>axiosP("/rentEquipment/editRentEquipment",data);//更新器材状态
export const getRentEquipmentApi =data=>axiosG("/rentEquipment/getRentEquipment",data);//获得器材状态详情
export const pageRentEquipmentApi =data=>axiosG("/rentEquipment/pageRentEquipment",data);//获得器材状态列表


