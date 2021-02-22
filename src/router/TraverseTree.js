/**
 * @author 王业鹏
 * @description 根据树状结构菜单自动引入.vue文件
 * @date 2020/03/16 21:44
 * @class TraverseTree
 * @constructor menu
 * @constructor layout
 * @return layout
 * */

export class TraverseTree {
  constructor(menu, layout) {
    this.menu = menu; // 菜单
    this.layout = layout; // 路由集合
    this.list = []; // 搜索集合
    this.run()
  }

  hasChildren(value) {
    if (!value || value.length === 0) return false;
    return value.some(item => !item.hidden)
  }

  operate(item) {
    // 搜索菜单
    if (item.hidden === false) {
      this.list.push({
        indexPath: item.indexPath,
        index: item.title,
        cache: item.cache,
        name: item.name,
        path: item.path,
        iframe: item.iframe
      })
    }

    // 路由
    if (item.iframe === false && item.name) {
      if (item.child) {
        let children = item.child.split(',')
        let route = {
          name: item.name,
          path: item.path,
          redirect: `${item.path}/${children[0]}`,
          component: () => import(`@/views${item.path}`),
          children: []
        }
        children.forEach(child => {
          route.children.push({
            name: `${item.name}_${child}`,
            path: `${item.path}/${child}`,
            meta: {title: item.title, active: item.name},
            component: () => import(`@/views${item.path}/${child}`),
          })
        })
        this.layout.children.push(route)
      } else {
        this.layout.children.push({
          name: item.name,
          path: item.path,
          meta: {title: item.title},
          component: () => import(`@/views${item.path}`)
        })
      }
    }
  }

  run() {
    // 遍及一级
    this.menu.forEach(fistItem => {
      fistItem.path = `/${fistItem.name}`;
      fistItem.indexPath = [fistItem.title];
      if (this.hasChildren(fistItem.children)) {
        // 遍历二级
        fistItem.children.forEach(secondItem => {
          secondItem.path = `/${fistItem.name}/${secondItem.name}`;
          secondItem.indexPath = [fistItem.title, secondItem.title];
          if (this.hasChildren(secondItem.children)) {
            // 遍历三级
            secondItem.children.forEach(thirdItem => {
              thirdItem.path = `/${fistItem.name}/${secondItem.name}/${thirdItem.name}`;
              thirdItem.indexPath = [fistItem.title, secondItem.title, thirdItem.title];
              this.operate(thirdItem) // 添加三级
            })
          } else {
            this.operate(secondItem) // 添加二级
          }
        })
      } else {
        this.operate(fistItem) // 添加一级
      }
    })
    this.menu = null;
  }

  getLayout() {
    return this.layout;
  }

  getList() {
    return this.list;
  }
}
