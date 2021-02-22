import {axiosD, axiosFs, axiosG, axiosK, axiosL, axiosP} from "@/api";

/**
 * @module 台账
 * */
export const addLedgerApi = data => axiosK("/ledger/addLedger", data); // 添加台账
export const delLedgerApi = data => axiosD("/ledger/delLedger", data); // 删除台账
export const editLedgerApi = data => axiosP("/ledger/editLedger", data); // 更改台账
export const getLedgerApi = data => axiosG("/ledger/getLedger", data); // 获得台账详情
export const pageLedgerApi = data => axiosG("/ledger/pageLedger", data); // 分页获得台账

export const copyLedgerApi = data => axiosK("/ledger/copyLedger", data); // 复制台账
export const listLedgerNameApi = data => axiosG("/ledger/listLedgerName", data); // 搜索台账

export const addLedgerRowApi = data => axiosK("/ledger/addLedgerRow", data); // 添加台账行
export const delLedgerRowApi = data => axiosD("/ledger/delLedgerRow", data); // 删除台账行
export const editLedgerRowApi = data => axiosP("/ledger/editLedgerRow", data); // 更改台账行
export const getLedgerDetailApi = data => axiosG("/ledger/getLedgerDetail", data); // 获得完整的台账
export const gradeApi = data => axiosP("/ledger/grade", data); // 评分
export const pageLeaderScoreApi = data => axiosG("/ledger/pageLeaderScore", data); // 分页获得领导评分详情
export const pageOtherScoreApi = data => axiosG("/ledger/pageOtherScore", data); // 分页获得互评分详情
export const downloadTemplateApi = data => axiosL("/ledger/downloadTemplate", data); // 下载台账模板
export const importDataApi = data => axiosFs("/ledger/importData", data); // 导入台账数据

export const pageRankingApi = data => axiosG("/ledger/pageRanking", data); // 获得台账排名
