import {axiosD, axiosG, axiosK, axiosP} from "@/api";

/**
 * @description 新闻 公告
 * */
export const addArticleApi = data => axiosK("article/addArticle", data); // 添加文章
export const delArticleApi = data => axiosD("article/delArticle", data); // 删除文章
export const editArticleApi = data => axiosP("article/editArticle", data); // 更改文章
export const pageArticleApi = data => axiosG("article/pageArticle", data); // 获得文章列表
export const getArticleApi = data => axiosG("article/getArticle", data); // 获得文章详情
