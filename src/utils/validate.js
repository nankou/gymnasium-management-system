/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
export function adjustWeight(array,target) {
  var weightSum = 0;
  var re = /^-?(\d+\.?\d+?)%$/;
  var len = array.length;
  for (var i = 0; i < len; i++) {
    var weight = array[i][target];
    if (re.test(weight)) {
      var str = weight.replace("%", "");
      weight = str / 100;

    } else {
      weight = parseFloat(weight);
    }
    
    weightSum += weight;
  }
  if (weightSum == 1||weightSum==100) {
    return true;
  } else {
    return false;
  }
}
//判断是否有重复值
export function isRepeat(arr, target) {
  var hash = {};
  for (var i in arr) {
    console.log(arr[i]);
    console.log(arr[i][target]);
    if (hash[arr[i][target]]) {
      console.log(hash);
      return true;
    }
    hash[arr[i][target]] = true;
  }
  console.log(hash);
  return false;
}
