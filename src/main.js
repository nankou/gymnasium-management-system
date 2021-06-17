import Vue from "vue";
import router from "./router"; // 路由
import store from "./store"; // vuex
import EVueContextmenu from "e-vue-contextmenu"; // 右键菜单
import "./styles/init.css"; // 样式初始化
import "./styles/global.css"; // 全局样式
import "./utils/EUI"; // element-ui
import "./utils/custom"; // 自定义组件
import "./utils/directive"; // 指令
import "./utils/filter"; // 过滤器
import "./icons"; // svg
import App from "./App.vue";

Vue.use(EVueContextmenu);
Vue.prototype.$nodeEnv = process.env.NODE_ENV;
Vue.prototype.$baseApi = process.env.VUE_APP_BASE_API;
Vue.prototype.$isDev = process.env.NODE_ENV === 'development';
Vue.prototype.$isProd = process.env.NODE_ENV === 'production';
Vue.prototype.$getImage = image => process.env.VUE_APP_BASE_API + image;
Vue.prototype.$getFirstImage = images => process.env.VUE_APP_BASE_API + images.split(',')[0];
Vue.prototype.$getImageList = images => images.split(',').map(image => process.env.VUE_APP_BASE_API + image);
// Vue.prototype.$fileSaver = require('file-saver'); // 下载文件

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
