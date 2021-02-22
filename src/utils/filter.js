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
 * @return YYYY-MM-DD
 **/
Vue.filter("formatDateZh", function (time) {
  if (!time) return '';
  return format(time, 'YYYY年MM月DD日');
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
 * @description 获得转出
 * @return {String}
 **/
Vue.filter("formatOut", function (obj) {
  if (obj.outDept && obj.outDept.name) return obj.outDept.name
  if (obj.outDeptId === -1) return '转出市外'
  if (obj.outDeptId === 0) return '转出省外'
  return ''
});

/**
 * @description 获得转入
 * @return {String}
 **/
Vue.filter("formatInto", function (obj) {
  if (obj.intoDept && obj.intoDept.name) return obj.intoDept.name
  if (obj.intoDeptId === -1) return '市外转入'
  if (obj.intoDeptId === 0) return '省外转入'
  return ''
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

/**
 * @description 把秒数转化为天、时、分、秒
 * @return {String}
 **/
Vue.filter("formatSeconds", function (value) {
  if (isEmpty(value)) return '';
  let secondTime = parseInt(value) // 秒
  let minuteTime = 0 // 分
  let hourTime = 0 // 小时
  let dayTime = 0 // 天
  let result = ''
  if (value < 60) {
    result = secondTime + '秒'
  } else {
    if (secondTime >= 60) { // 如果秒数大于60，将秒数转换成整数
      // 获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60)
      // 获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60)
      // 如果分钟大于60，将分钟转换成小时
      if (minuteTime >= 60) {
        // 获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60)
        // 获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60)
        if (hourTime >= 24) {
          // 获取天数， 获取小时除以24，得到整数天
          dayTime = parseInt(hourTime / 24)
          // 获取小时后取余小时，获取分钟除以24取余的分；
          hourTime = parseInt(hourTime % 24)
        }
      }
    }
    if (secondTime > 0) {
      secondTime = parseInt(secondTime) >= 10 ? secondTime : '0' + secondTime
      result = '' + secondTime + '秒'
    }
    if (minuteTime > 0) {
      minuteTime = parseInt(minuteTime) >= 10 ? minuteTime : '0' + minuteTime
      result = '' + minuteTime + '分' + result
    }
    if (hourTime > 0) {
      result = '' + parseInt(hourTime) + '小时' + result
    }
    if (dayTime > 0) {
      result = '' + parseInt(dayTime) + '天' + result
    }
  }
  return result
});
