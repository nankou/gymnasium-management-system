import Vue from "vue";
import store from "@/store";
import {Message, MessageBox, Notification, Loading} from 'element-ui';
import "./EUI_IN"


/**
 * @description 组件大小
 */
Vue.prototype.$ELEMENT = {size: store.getters.setting.layoutSize};


/**
 * @param {String} msg 提示信息
 */
const warnMsg = msg => Message.warning(msg);
const infoMsg = msg => Message.info(msg);
export const successMsg = msg => Message.success(msg);
export const errorMsg = msg => Message.error(msg);

const successNotify = msg => {
  Notification.success({
    title: "成功",
    message: msg
  });
};

const warnNotify = msg => {
  Notification.warning({
    title: "警告",
    message: msg
  });
};

const infoNotify = msg => {
  Notification.info({
    title: "消息",
    message: msg
  });
};

const errorNotify = msg => {
  Notification.error({
    title: "错误",
    message: msg
  });
};


/**
 * @param {String} text 提示信息
 * @param {String} confirmText 确认文字
 * @param {String} title 提示文字
 */
export const msgBox = (text = "确定执行此操作吗？", confirmText = "确定", title = "提示") => {
  return new Promise((resolve, reject) => {
    MessageBox.confirm(text, title, {
      confirmButtonText: confirmText,
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(result => resolve(result))
      .catch(error => reject(error))
  })
};


/**
 * @param {String} msg
 * @param {String} time
 * @description 报错信息不重复
 */
let errorText = '';
let isForbid = false;
export const errorMessage = (msg, time = 3000) => {
  if (isForbid && msg === errorText) return;
  isForbid = true;
  errorMsg(msg);
  errorText = msg;
  setTimeout(() => {
    isForbid = false;
  }, time);
};


/**
 * @description 加载提示
 */
let LOADING = null;
export const startLoading = (text = '加载中...') => {
  LOADING = Loading.service({
    text,
    lock: true,
    fullscreen: true,
    background: 'rgba(0, 0, 0, 0)',
    spinner: 'el-icon-loading'
  })
};

export const stopLoading = () => {
  LOADING.close();
};


/**
 * @description 全局注册
 */
Vue.prototype.$successMsg = successMsg;
Vue.prototype.$errorMsg = errorMsg;
Vue.prototype.$infoMsg = infoMsg;
Vue.prototype.$warnMsg = warnMsg;
Vue.prototype.$successNotify = successNotify;
Vue.prototype.$errorNotify = errorNotify;
Vue.prototype.$infoNotify = infoNotify;
Vue.prototype.$warnNotify = warnNotify;
Vue.prototype.$msgBox = msgBox;
Vue.prototype.$startLoading = startLoading;
Vue.prototype.$stopLoading = stopLoading;
