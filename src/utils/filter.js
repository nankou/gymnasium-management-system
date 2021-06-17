import Vue from "vue";
import {isEmpty} from "@/utils/common";
import {format} from "@/utils/format";

/**
 * @description 过滤时间
 * @return YYYY-MM-DD
 **/
Vue.filter("formatDate", function (time) {
  if (!time) return '';
  return format(time, 'YYYY-MM-DD');
});

/**
 * @description 过滤时间
 * @return YYYY-MM-DD hh:mm:ss
 **/
Vue.filter("formatDateTime", function (time) {
  if (!time) return '';
  return format(time, 'YYYY-MM-DD HH:mm:ss');
});

/**
 * @description 对象获得名称
 * @return {String}
 **/
Vue.filter("formatObj", function (obj, key = 'name') {
  if (isEmpty(obj)) return '';
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key];
  } else {
    return ''
  }
});

/**
 * @description 数组获得名称
 * @return {String}
 **/
Vue.filter("formatArray", function (array, key = 'name') {
  if (isEmpty(array)) return '';
  let str = '';
  array.forEach(item => {
    if (!isEmpty(item) && Object.prototype.hasOwnProperty.call(item, key))
      str += `${item[key]} / `
  });
  str = str.replace(/[\s][/][\s]$/, '');
  return str
});
