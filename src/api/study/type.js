import {axiosD, axiosG, axiosK, axiosP} from "@/api";

/**
 * @description 课程类别
 * */
export const addVideoSortApi = data => axiosK("video/addVideoSort", data); // 添加视频类别
export const delVideoSortApi = data => axiosD("video/delVideoSort", data); // 删除视频类别
export const editVideoSortApi = data => axiosP("video/editVideoSort", data); // 更改视频类别
export const listVideoSortApi = data => axiosG("video/listVideoSort", data); // 获得视频类别列表
