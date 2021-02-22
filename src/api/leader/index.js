import {axiosA, axiosD, axiosG, axiosM} from "@/api";

/**
 * @module 领导设置
 * */
export const addLeaderApi = data => axiosA("/leader/addLeader", data); // 添加领导
export const delLeaderApi = data => axiosD("/leader/delLeader", data); // 删除领导
export const editLeaderApi = data => axiosM("/leader/editLeader", data); // 更改领导
export const getLeaderApi = data => axiosG("/leader/getLeader", data); // 获得领导详情
export const pageLeaderApi = data => axiosG("/leader/pageLeader", data); // 分页获得领导
export const listLedgerNameApi = data => axiosG("/ledger/listLedgerName", data); // 搜索台账
