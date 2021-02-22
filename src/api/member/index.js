import {axiosA, axiosD, axiosG, axiosL, axiosP} from "@/api";

/**
 * @description 注册审核
 * */
export const pageCheckUserApi = data => axiosG("commentUser/pageCheckUser", data); // 获得审核的前端用户列表
export const passUserApi = data => axiosP("commentUser/passUser", data); // 审核通过
export const unPassUserApi = data => axiosP("commentUser/unPassUser", data); // 审核不通过

/**
 * @description 组织关系
 * */
export const addTransferApi = data => axiosA("transfer/addTransfer", data); // 增加组织关系转接
export const editTransferApi = data => axiosP("transfer/editTransfer", data); // 更改组织关系转接
export const getCurrentTransferApi = data => axiosG("transfer/getCurrentTransfer", data); // 获得自己申请的组织关系转接
export const exportTruncateApi = data => axiosL("transfer/exportTruncate", data); // 导出已通过的转接审核

export const pageTransferApi = data => axiosG("transfer/pageTransfer", data); // 分页获得组织关系转接
export const agreeTransferApi = data => axiosP("transfer/agreeTransfer", data); // 同意转接
export const disAgreeTransferApi = data => axiosP("transfer/disAgreeTransfer", data); // 拒绝转接

export const delTransferApi = data => axiosD("transfer/delTransfer", data); // 删除组织关系转接
export const getTransferApi = data => axiosG("transfer/getTransfer", data); // 获得组织关系转接详情
