import service from "@/api/axios";

/**
 * @author chenjiajing
 * @description 登录
 * */

export function getCodeApi(data) {
  return service({
    method: "get",
    url: 'admin/login/getCode',
    params: data,
    paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
  })
};

export function loginApi(data) {
  return service({
    method: "post",
    url: 'admin/login/login',
    data: data,
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    transformRequest: [data => qs.stringify(data)]
  })
};
