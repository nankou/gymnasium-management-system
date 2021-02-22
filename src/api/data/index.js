import {axiosD, axiosFs, axiosG, axiosK, axiosP} from "@/api";

/**
 * @description 大事记资料库
 * */
export const addDataFileApi = data => axiosK("dataFile/addDataFile", data); // 添加文件记录
export const delDataFileApi = data => axiosD("dataFile/delDataFile", data); // 删除文件记录
export const editDataFileApi = data => axiosP("dataFile/editDataFile", data); // 编辑文件记录
export const pageDataFileApi = data => axiosG("dataFile/pageDataFile", data); // 分页获得文件记录
export const uploadFileApi = data => axiosFs("dataFile/uploadFile", data); // 上传文件
