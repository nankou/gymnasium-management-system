import {axiosG, axiosK} from "@/api";

/**
 * @module 登陆
 * */
export const getCodeApi = () => axiosG("admin/login/getCode"); // 获取验证码
export const loginApi = data => axiosK("admin/login/login", data); // 登陆
