import Cookies from "js-cookie"

/**
 * @description localStorage
 * */

export const setLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
};

export const getLocalStorage = key => {
  return JSON.parse(localStorage.getItem(key))
};

export const removeLocalStorage = key => {
  localStorage.removeItem(key)
};

export const clearLocalStorage = () => {
  localStorage.clear()
};

/**
 * @description sessionStorage
 * */

export const setSessionStorage = (key, data) => {
  sessionStorage.setItem(key, JSON.stringify(data))
};

export const getSessionStorage = key => {
  return JSON.parse(sessionStorage.getItem(key))
};

export const removeSessionStorage = key => {
  sessionStorage.removeItem(key)
};

export const clearSessionStorage = () => {
  sessionStorage.clear()
};

/**
 * @description cookiesStorage
 * */

export const removeCookiesStorage = (key) => {
  Cookies.remove(key);
};
