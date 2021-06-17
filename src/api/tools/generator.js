import {axiosG, axiosP} from "@/api";

/**
 * @description 代码生成
 * */
export const pageTables = data => axiosG("generator/pageTables", data); // 获得数据表列表
export const generator = data => axiosG("generator/generator", data); // 生成代码

/**
 * @description 代码生成配置
 * */
export const listColumns = data => axiosG("generator/listColumns", data); // 获得字段数据
export const editColumns = data => axiosP("generator/editColumns", data); // 更新字段数据
export const syncColumns = data => axiosP("generator/syncColumns", data); // 同步字段数据
export const editGenConfig = data => axiosP("generator/editGenConfig", data); // 更新配置
export const getGenConfig = data => axiosG("generator/getGenConfig", data); // 获得配置
