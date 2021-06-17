/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 * @description 是否外链
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} url
 * @returns {Boolean}
 * @description 是否url
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 * @description 是否小写字母
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 * @description 是否大写字母
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 * @description 是否字母
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str)
}

/**
 * @param {string} phone
 * @returns {Boolean}
 * @description 是否电话
 */
export function isvalidPhone(phone) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  return reg.test(phone)
}

/**
 * @param {string} str
 * @returns {Boolean}
 * @description 是否string
 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String;

}

/**
 * @param {Array} arg
 * @returns {Boolean}
 * @description 是否数组
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @description vue 表单验证
 * */

/* 是否邮箱*/
export function validEmail(rule, value, callback) {
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的邮箱'))
    } else {
      callback()
    }
  }
}

/* 是否合法IP地址*/
export function validateIP(rule, value, callback) {
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的IP地址'))
    } else {
      callback()
    }
  }
}

/* 是否手机号码或者固话*/
export function validatePhoneTwo(rule, value, callback) {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的电话号码或者固话号码'))
    } else {
      callback()
    }
  }
}

/* 是否固话*/
export function validateTelephone(rule, value, callback) {
  const reg = /0\d{2}-\d{7,8}/;
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的固话（格式：区号+号码,如010-1234567）'))
    } else {
      callback()
    }
  }
}

/* 是否手机号码*/
export function validatePhone(rule, value, callback) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的电话号码'))
    } else {
      callback()
    }
  }
}

/* 是否身份证号码*/
export function validateIdNo(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的身份证号码'))
    } else {
      callback()
    }
  }
}

/* 用户名 */
export function validateUsername(rule, value, callback) {
  const reg1 = /[\S]/;
  const reg2 = /^[a-zA-Z0-9_]*$/;
  const reg3 = /^[a-zA-Z0-9_]{2,16}$/;
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg1.test(value)) && value !== '') {
      callback(new Error('不能包括空格'))
    } else if ((!reg2.test(value)) && value !== '') {
      callback(new Error('只允许字母数字下划线'))
    } else if ((!reg3.test(value)) && value !== '') {
      callback(new Error('长度为2-16个字符'))
    } else {
      callback()
    }
  }
}

/* 密码 */
export function validatePassword(rule, value, callback) {
  const reg1 = /[\S]/;
  const reg2 = /^.{6,16}$/;
  const reg3 = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*~,?_.]+)*$/;
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg1.test(value)) && value !== '') {
      callback(new Error('不能包括空格'))
    } else if ((!reg2.test(value)) && value !== '') {
      callback(new Error('长度为6-16个字符'))
    } else if ((!reg3.test(value)) && value !== '') {
      callback(new Error('不能包括特殊字符'))
    } else {
      callback()
    }
  }
}
