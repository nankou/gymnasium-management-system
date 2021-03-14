import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import {isHistory} from "@/settings";

Vue.use(Router);

// 解决跳转到同一路径报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(error => error)
};

const constantRouterMap = [
  {
    name: 'error404',
    path: '/404',
    meta: {title: '404'},
    component: () => import('@/views/error/error404')
  },
  {
    name: 'login',
    path: '/login',
    meta: {title: '登录'},
    component: () => import('@/views/login')
  },

];

const createRouter = () => new Router({
  mode: isHistory ? "history" : "hash",
  routes: constantRouterMap
})

const router = createRouter()

export const resetRouter = () => {
  if (store.getters.hasGenerateRouter)
    router.matcher = createRouter().matcher
}

export default router
