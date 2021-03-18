import service from "@/api/axios";
import qs from "qs";

/**
 * @author chenjiajing
 * @description 个人中心
 * */

export function getUserInfoApi(data) { // 获取用户信息
  return service({
    method: "get",
    url: 'admin/login/getUserInfo',
    params: data,
    paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
  })
};

export function logoutApi(data) {  // 退出登录
  return service({
    method: "delete",
    url: 'admin/login/logout',
    params: data,
    paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
  })
};

export function updatePassApi(data) {  // 修改密码
  return service({
    method: "put",
    url: 'admin/user/editPass',
    data: data,
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    transformRequest: [data => qs.stringify(data)]
  })
};

export function editMyUserApi(data) {  // 修改个人信息
  return service({
    method: "put",
    url: 'admin/user/editMyUser',
    data: data,
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    transformRequest: [data => qs.stringify(data)]
  })
};

export function getUserLogApi(data) { // 个人日志
  return service({
    method: "get",
    url: 'log/pageUserLog',
    params: data,
    paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
  })
};

