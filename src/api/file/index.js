import {axiosF, axiosFs} from "@/api";

/**
 * @module 图片
 * */
export const uploadPictureApi = data => axiosF('file/uploadPictureFile', data);
export const uploadPicturePlusApi = data => axiosFs('file/uploadPictureFile', data);

/**
 * @module 音频
 * */
export const uploadAudioApi = data => axiosF('file/uploadAudioFile', data);
export const uploadAudioPlusApi = data => axiosFs('file/uploadAudioFile', data);

/**
 * @module 视频
 * */
export const uploadVideoApi = data => axiosF('file/uploadVideoFile', data);
export const uploadVideoPlusApi = (data, callback, source) => axiosFs('file/uploadVideoFile', data, callback, source);

/**
 * @module 文档
 * */
export const uploadDocumentsApi = data => axiosF('file/uploadDocumentsFile', data);
export const uploadDocumentsPlusApi = data => axiosFs('file/uploadDocumentsFile', data);

export class addFieldApi {
}

export class addFileApi {
}

export class delFieldApi {
}

export class getFieldApi {
}

export class pageFieldApi {
}