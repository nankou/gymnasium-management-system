import axios from "axios";
import router from "@/router";
import store from "@/store";
import {errorMessage, successMsg, errorMsg, msgBox} from "@/utils/EUI";
import {timeout} from "@/settings";

let errorStatus = null;
const service = axios.create({
  timeout: timeout,
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true
});

//请求拦截
service.interceptors.request.use(
  config => {
    let token = store.getters.token;
    let url = config.url;
    if (isAddToken(url)) config.headers.Authorization = token;
    return config;
  },
  error => {
    errorMessage("请求错误！");
    return Promise.reject(error);
  }
);

// 响应拦截
service.interceptors.response.use(
  response => {
    const {message, status} = response.data;
    if (message && status === 200)
      successMsg(message);
    if (message && status === 403) {
      if (process.env.NODE_ENV === 'development')
        errorMsg(`权限不足，无 ${response.config.url} 接口权限`)
      else
        errorMsg(`权限不足`)
    }
    if (message && status !== 200 && status !== 403) {
      if (message.includes('Data too long'))
        errorMsg('内容过长，请求失败')
      else
        errorMsg(message)
    }
    return response.data;
  },
  error => {
    /* 请求超时！*/
    if (error.toString().includes("timeout")) {
      errorMessage("网络请求超时！");
      return Promise.reject(error);
    }
    /* 请求中断 */
    if (
      Object.prototype.hasOwnProperty.call(error, "message") &&
      error.message === "Request Interruption"
    ) {
      return Promise.reject(error);
    }
    /* 网络错误 */
    if (
      Object.prototype.hasOwnProperty.call(error.response, "statusText") &&
      error.response.statusText === "Internal Server Error"
    ) {
      errorMessage("网络错误，无法连接到服务器！");
      return Promise.reject(error);
    }
    /* 请求体过大 */
    if (error.response.status === 413) {
      errorMessage('请求实体太大');
      return Promise.reject(error);
    }
    /* 代理请求超时 */
    if (error.response.status === 504) {
      errorMessage('代理请求超时');
      return Promise.reject(error);
    }
    const {status, message} = error.response.data;
    /* 401 */
    if (status === 401) {
      if (errorStatus === status) return;
      errorStatus = status;
      msgBox("登录状态已过期，您可以继续留在该页面，或者重新登录", "重新登录", "系统提示")
        .then(() => {
          router.push({name: 'login'})
        })
        .catch(() => (errorStatus = null))
    } else if (status === 403) {
      /* 403 */
      router.push({name: "error403"});
    } else {
      /* elseStatus */
      if (message) errorMessage(message);
    }
    return Promise.reject(error);
  }
);

/**
 * @description 白名单，不添加token的接口
 * */
const isAddToken = url =>
  ["admin/login/login", "admin/login/getCode"].every(item => url !== item);

export default service;
