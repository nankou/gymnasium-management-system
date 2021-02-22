import {axiosG, axiosK, axiosP} from "@/api";

/**
 * @description 业务办理(课室)
 * */
export const addPartyApplyApi = data => axiosK("apply/addPartyApply", data); // 添加入党申请书审核
export const pagePartyApplyApi = data => axiosG("apply/pagePartyApply", data); // 获得自己申请的入党申请书审核

export const pagePartyApplyAuditApi = data => axiosG("apply/pagePartyApplyAudit", data); // 获得自己审核的入党申请书审核
export const passPartyApplyApi = data => axiosP("apply/passPartyApply", data); // 入党申请书审核通过
export const noPassPartyApplyApi = data => axiosP("apply/noPassPartyApply", data); // 入党申请书审核不通过

export const pageAdminPartyApplyApi = data => axiosG("apply/pageAdminPartyApply", data); // 获得超级管理员备案的入党申请书审核

/**
 * @description 业务办理(申请书)
 * */
export const addClassRoomApplyApi = data => axiosK("apply/addClassRoomApply", data); // 添加教室审核
export const pageClassRoomApplyApi = data => axiosG("apply/pageClassRoomApply", data); // 获得自己申请的教室审核

export const pageAuditApi = data => axiosG("apply/pageAudit", data); // 获得自己审核的教室申请
export const passClassRoomApplyApi = data => axiosP("apply/passClassRoomApply", data); // 教室审核通过
export const noPassClassRoomApplyApi = data => axiosP("apply/noPassClassRoomApply", data); // 教室审核不通过

export const pageAdminClassRoomApplyApi = data => axiosG("apply/pageAdminClassRoomApply", data); // 获得超级管理员备案的教室申请
