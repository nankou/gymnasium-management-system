import {axiosD, axiosG, axiosK, axiosP} from "@/api";

/**
 * @module 专家资料库
 * */
export const addExpertDataApi = data => axiosK("expertData/addExpertData", data); // 添加专家资料库
export const delExpertDataApi = data => axiosD("expertData/delExpertData", data); // 删除专家资料库
export const editExpertDataApi = data => axiosP("expertData/editExpertData", data); // 更改资料库
export const getExpertDataApi = data => axiosG("expertData/getExpertData", data); // 获得专家资料库详情
export const listRandomExpertApi = data => axiosG("expertData/listRandomExpert", data); // 获得随机的专家资料
export const pageExpertDataApi = data => axiosG("expertData/pageExpertData", data); // 分页获得专家资料库
