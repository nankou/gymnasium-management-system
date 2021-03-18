import service from "@/api/axios";

/**
 * @author chenjiajing
 * @description 文件管理
 * */


export function uploadPictureApi(data) {
  return service({
    method: "post",
    url: 'file/uploadPictureFile',
    data: data,
    headers: {"Content-Type": "multipart/form-data"}
  })
};
