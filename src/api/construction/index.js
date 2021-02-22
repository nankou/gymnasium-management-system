import {axiosD, axiosG, axiosK, axiosP} from "@/api";

/**
 * @module 阵地建设
 * */
export const addDeptPictureApi = data => axiosK("deptPicture/addDeptPicture", data); // 添加阵地建设全景图
export const delDeptPictureApi = data => axiosD("deptPicture/delDeptPicture", data); // 删除阵地建设全景图
export const editDeptPictureApi = data => axiosP("deptPicture/editDeptPicture", data); // 更改阵地建设全景图
export const getDeptPictureApi = data => axiosG("deptPicture/getDeptPicture", data); // 获得阵地建设全景图详情
export const pageDeptPictureApi = data => axiosG("deptPicture/pageDeptPicture", data); // 分页获得阵地建设全景图
