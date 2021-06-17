import router from './routers';
import store from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {deepClone} from "@/utils/common";
import {getMenuApi} from '@/api/system/menu';
import {getUserInfoApi} from '@/api/person';
import {startLoading, stopLoading} from '@/utils/EUI';
import {title} from '@/settings';
import {TraverseTree} from './TraverseTree';

NProgress.configure({showSpinner: false});

let layout = {
  name: 'layout',
  path: '/layout',
  redirect: "/home",
  component: () => import('@/layout'),
  children: [
    {
      name: 'home',
      path: '/home',
      meta: {title: '首页'},
      component: () => import('@/views/home')
    },
    {
      name: 'person',
      path: '/person',
      meta: {title: '个人中心'},
      component: () => import('@/views/person')
    },
    {
      name: 'error403',
      path: '/403',
      meta: {title: '403'},
      component: () => import('@/views/error/error403')
    },
    {
      name: 'redirect',
      path: '/redirect',
      meta: {title: ""},
      component: () => import('@/views/redirect')
    }
  ]
};

// 动态路由
export function generateRouter() {
  return new Promise((resolve, reject) => {
    startLoading()
    Promise.all([getUserInfoApi(), getMenuApi()])
      .then(result => {
        stopLoading()
        if (result[0].status !== 200 || result[1].status !== 200) {
          router.push({name: 'login'})
          return
        }
        // 获取个人信息
        const {user, roles} = result[0].resultParam.currentUser
        store.dispatch('setUser', user)
        store.dispatch('setRoles', roles)
        // 获取个人菜单
        const menu = result[1].resultParam.content;
        let tree = new TraverseTree(menu, deepClone(layout))
        store.dispatch('setMenu', menu);
        store.dispatch('setSearchMenu', tree.getList());
        store.dispatch('setHasGenerateRouter');
        router.addRoutes([tree.getLayout()]);
        router.addRoutes([{path: "*", redirect: "/404"}]);
        resolve()
      })
      .catch(error => {
        stopLoading()
        if (error.response.status !== 401) {
          router.push({name: 'login'})
        }
        reject()
      })
  })
}

// 路由守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + title
  }
  let isLogin = store.getters.token;
  if (to.path === "/") {
    isLogin
      ? next('/home')
      : next('/login');
    return
  }
  if (to.path === "/login") {
    next();
    return;
  }
  if (!isLogin) {
    next(`/login?redirect=${to.path}`);
    return;
  }
  // if (
  //   process.env.NODE_ENV === 'production'
  //   && (to.path === "/system/menu" || to.path === "/system/role")
  // ) {
  //   next('/404');
  //   return
  // }
  if (store.getters.hasGenerateRouter) {
    next()
  } else {
    generateRouter();
    next()
  }
});

router.afterEach(() => {
  NProgress.done()
});

export default router
