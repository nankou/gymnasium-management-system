import service from "./axios"
import qs from "qs";


/**
 * @author 王业鹏
 * @description {[]}: 对象中可带数组； {}：对象。
 * @example axiosG   get     {[]} 获取
 * @example axiosD   delete  {[]} 删除
 * @example axiosA   post    {[]} 新增
 * @example axiosM   put     {[]} 修改
 * @example axiosL   get     {[]} 下载
 * @example axiosK   post    x-www-form-urlencoded {} 新增
 * @example axiosP   put     x-www-form-urlencoded {} 修改
 * @example axiosJ   post    json {} 新增
 * @example axiosU   put     json {} 修改
 * @example axiosF   post    form-data FormData() 上传
 * @example axiosFs  post    form-data {[]} 上传
 * */


/**
 * @param {String} url 请求地址
 * @param {Object=} param 参数
 * @description get
 * */
export const axiosG = (url, param) => {
  return service({
    method: "get",
    url: url,
    params: param,
    paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
  })
};


/**
 * @param {String} url 请求地址
 * @param {Object=} param 请求地址
 * @description delete，删除数据。
 * */
export const axiosD = (url, param) => {
  return service({
    method: "delete",
    url: url,
    params: param,
    paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
  })
};


/**
 * @param {String} url 请求地址
 * @param {Object=} param 请求地址
 * @description post，数组。
 * */
export const axiosA = (url, param) => {
  return service({
    method: "post",
    url: url,
    params: param,
    paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
  })
};


/**
 * @param {String} url 请求地址
 * @param {Object=} param 请求地址
 * @description put，数组。
 * */
export const axiosM = (url, param) => {
  return service({
    method: "put",
    url: url,
    params: param,
    paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
  })
};


/**
 * @param {String} url 请求地址
 * @param {Object} param {name: LiHua, age: 18}
 * @description post，键值对格式。
 * */
export const axiosK = (url, param) => {
  return service({
    method: "post",
    url: url,
    data: param,
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    transformRequest: [data => qs.stringify(data)]
  })
};


/**
 * @param {String} url 请求地址
 * @param {Object} param {name: LiHua, age: 18}
 * @description put，键值对格式。
 * */
export const axiosP = (url, param) => {
  return service({
    method: "put",
    url: url,
    data: param,
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    transformRequest: [data => qs.stringify(data)]
  })
};


/**
 * @param {String} url 请求地址
 * @param {Object} param {name: LiHua, age: 18}
 * @description post，JSON格式。
 * */
export const axiosJ = (url, param) => {
  return service({
    method: "post",
    url: url,
    data: param,
    headers: {"Content-Type": "application/json"},
    transformRequest: [data => JSON.stringify(data)]
  })
};


/**
 * @param {String} url 请求地址
 * @param {Object} param {name: LiHua, age: 18}
 * @description put，JSON格式。
 * */
export const axiosU = (url, param) => {
  return service({
    method: "put",
    url: url,
    data: param,
    headers: {"Content-Type": "application/json"},
    transformRequest: [data => JSON.stringify(data)]
  })
};


/**
 * @param {String} url 请求地址
 * @param {FormData} param new FormData()
 * @description post，文件格式。
 * */
export const axiosF = (url, param) => {
  return service({
    method: "post",
    url: url,
    data: param,
    headers: {"Content-Type": "multipart/form-data"}
  })
};


/**
 * @param {String} url 请求地址
 * @param {Object} param {id: 1, file: [1.png, 2.png]}
 * @param {Function=} callback 回调函数
 * @param {Object=} source 中断请求
 * @description post，文件格式。
 * */
export const axiosFs = (url, param, callback, source) => {
  let cancelToken;
  if (source) cancelToken = source.token;
  return service({
    method: "post",
    timeout: 10 * 60 * 1000,
    url: url,
    data: param,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    transformRequest: [
      data => {
        const formData = new FormData();
        for (let key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (data[key] instanceof Array)
              for (let i = 0; i < data[key].length; i++)
                formData.append(key, data[key][i]);
            else
              formData.append(key, data[key])
          }
        }
        return formData;
      }
    ],
    cancelToken: cancelToken,
    onUploadProgress: progress => {
      if (callback)
        callback(Math.round((progress.loaded / progress.total) * 100));
    }
  })
};


/**
 * @param {String} url 请求地址
 * @param {Object=} param 请求地址
 * @description 下载文件。
 * */
export const axiosL = (url, param) => {
  return service({
    method: "get",
    url: url,
    responseType: "blob",
    params: param,
    paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
  })
};
