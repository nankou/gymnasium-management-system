import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Cookies from "js-cookie";
import {tokenCookieExpires, prefix} from '@/settings'
import {deepClone} from "@/utils/common";

Vue.use(Vuex);

// 自动获取modules下的*.js
const modulesFiles = require.context("./modules", true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
const cloneModules = deepClone(modules);

// vuex持久化
const plugins = [
  createPersistedState({
    key: `${prefix}-INFO`,
    storage: window.localStorage,
    reducer: val => ({info: val.info})
  }),
  createPersistedState({
    key: `${prefix}-SETTINGS`,
    storage: window.localStorage,
    reducer: val => ({settings: val.settings})
  }),
  createPersistedState({
    key: `${prefix}-LAYOUT`,
    storage: window.sessionStorage,
    reducer: val => ({layout: val.layout})
  }),
  createPersistedState({
    key: `${prefix}-TOKEN`,
    storage: {
      getItem: key => Cookies.get(key),
      setItem: (key, value) =>
        Cookies.set(key, value, {expires: modules.user.state.rememberMe ? tokenCookieExpires : 1}),
      removeItem: key => Cookies.remove(key)
    },
    reducer: val => ({token: val.token})
  })
];

const store = new Vuex.Store({
  modules,
  plugins
});

// 重置vuex
export const resetStore = () => {
  for (let module in store.state) {
    if (['info', 'settings'].includes(module)) continue
    for (let key in store.state[module])
      store.state[module][key] = deepClone(cloneModules[module].state[key])
  }
}

Vue.prototype.$storeGet = store.getters;
Vue.prototype.$storeSet = store.dispatch;

export default store
