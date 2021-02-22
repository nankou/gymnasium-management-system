import {axiosD, axiosG, axiosK, axiosP} from "@/api";

/**
 * @module 职业
 * */
export const addJobApi = data => axiosK("admin/job/addJob", data); // 新增职业
export const deleteJobApi = data => axiosD("admin/job/delJob", data); // 删除职业
export const editJobApi = data => axiosP("admin/job/editJob", data); // 编辑职业
export const getJobListApi = data => axiosG("admin/job/pageJob", data); // 分页获得职业列表
