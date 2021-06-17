import {axiosG} from "@/api";

/**
 * @module 日志
 * */
export const getErrorDetailByIdApi = data => axiosG("log/getErrorDetail", data); // 通过id获得报错信息的详情
export const getErrorLogApi = data => axiosG("log/pageErrorLog", data); // 获得报错日志
export const getLogListApi = data => axiosG("log/pageLog", data); // 分页获得日志列表
