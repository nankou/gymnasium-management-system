import {axiosA, axiosD, axiosG, axiosK, axiosM, axiosP} from "@/api";

/**
 * @description 用户
 * */
export const getCurrentArticleDetailApi = data => axiosG("studentArticle/getCurrentArticleDetail", data); // 获得个人文章管理详情
export const pageCurrentArticleManageApi = data => axiosG("studentArticle/pageCurrentArticleManage", data); // 获得个人的文章管理
export const successLearnApi = data => axiosK("studentArticle/successLearn", data); // 完成一篇文章

/**
 * @description 文章管理
 * */
export const addArticleManageApi = data => axiosA("studentArticle/addArticleManage", data); // 添加文章管理
export const delArticleManageApi = data => axiosD("studentArticle/delArticleManage", data); // 删除文章管理
export const editArticleManageApi = data => axiosM("studentArticle/editArticleManage", data); // 更改文章管理
export const getArticleManageApi = data => axiosG("studentArticle/getArticleManage", data); // 获得文章管理详情
export const pageArticleManageApi = data => axiosG("studentArticle/pageArticleManage", data); // 分页获得文章管理
export const addStudyArticleApi = data => axiosK("studentArticle/addStudyArticle", data); // 添加文章
export const delStudyArticleApi = data => axiosD("studentArticle/delStudyArticle", data); // 删除文章
export const editStudyArticleApi = data => axiosP("studentArticle/editStudyArticle", data); // 更改文章
export const getStudyArticleApi = data => axiosG("studentArticle/getStudyArticle", data); // 获得文章详情
export const pageStudyArticleApi = data => axiosG("studentArticle/pageStudyArticle", data); // 分页获得文章
export const pageUserLearnRateApi = data => axiosG("studentArticle/pageUserLearnRate", data); // 获得成员学习进度

/**
 * @description 学习情况
 * */
export const pageUserArticleProgressApi = data => axiosG("studentArticle/pageUserProgress", data); // 获得用户的学习进度
