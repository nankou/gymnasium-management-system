import {axiosA, axiosD, axiosG, axiosK, axiosM, axiosP} from "@/api";

/**
 * @description 用户
 * */
export const recordApi = data => axiosP("video/record", data); // 记录一个视频的进度
export const getRecordApi = data => axiosG("video/getRecord", data); // 获得一个视频的进度
export const successLearnApi = data => axiosK("video/successLearn", data); // 完成一个视频
export const getCurrentVideoDetailApi = data => axiosG("video/getCurrentVideoDetail", data); // 获得个人视频管理详情
export const pageCurrentVideoManageApi = data => axiosG("video/pageCurrentVideoManage", data); // 获得个人的视频管理

/**
 * @description 课程管理
 * */
export const addVideoApi = data => axiosK("video/addVideo", data); // 添加视频
export const delVideoApi = data => axiosD("video/delVideo", data); // 删除视频
export const editVideoApi = data => axiosP("video/editVideo", data); // 更改视频
export const getVideoApi = data => axiosG("video/getVideo", data); // 获得视频详情
export const pageVideoApi = data => axiosG("video/pageVideo", data); // 分页获得视频
export const addVideoManageApi = data => axiosA("video/addVideoManage", data); // 添加视频管理
export const delVideoManageApi = data => axiosD("video/delVideoManage", data); // 删除视频管理
export const editVideoManageApi = data => axiosM("video/editVideoManage", data); // 更改视频管理
export const getVideoManageApi = data => axiosG("video/getVideoManage", data); // 获得视频管理详情
export const pageVideoManageApi = data => axiosG("video/pageVideoManage", data); // 分页获得视频管理
export const pageUserLearnRateApi = data => axiosG("video/pageUserLearnRate", data); // 获得成员学习进度

/**
 * @description 学习情况
 * */
export const pageLearnResultApi = data => axiosG("video/pageLearnResult", data); // 分页获得学习情况
export const pageUserVideoProgressApi = data => axiosG("video/pageUserProgress", data); // 获得用户的学习进度
export const getLearnResultApi = data => axiosG("video/getLearnResult", data); // 获得成员学习管理详情
