<template>
  <el-scrollbar
      :class="[isNight ? 'admin-menu-night' : 'admin-menu-light']"
      :id="isVertical ? 'admin-vertical-menu' : 'admin-horizontal-menu'">
    <el-menu
        :default-active="active"
        :class="isVertical ? 'el-menu-vertical-demo' : 'el-menu-demo'"
        :collapse="isCollapsed"
        :unique-opened="isUniqueOpened"
        :mode="isVertical ? 'vertical' : 'horizontal'"
        :text-color="isNight ? '#bfcbd9' : '#444444'"
        :background-color="isNight ? style.menuNightBg : style.menuLightBg"
        active-text-color="#409eff">
      <logo/>
      <!-- 一级菜单 -->
      <template v-for="firstMenu in menu">
        <el-submenu
            v-if="hasChildren(firstMenu.children)"
            v-show="!firstMenu.hidden"
            :key="firstMenu.id"
            :index="firstMenu.title"
            class="submenu-title">
          <template slot="title">
            <item :title="firstMenu.title" :icon="firstMenu.icon"></item>
          </template>
          <!-- 二级菜单 -->
          <template v-for="secondMenu in firstMenu.children">
            <el-submenu
                v-if="hasChildren(secondMenu.children)"
                v-show="!secondMenu.hidden"
                :key="secondMenu.id"
                :index="secondMenu.title"
                class="submenu-title">
              <template slot="title">
                <item :title="secondMenu.title" :icon="secondMenu.icon"></item>
              </template>
              <!-- 三级菜单 -->
              <template v-for="thirdMenu in secondMenu.children">
                <el-menu-item
                    v-show="!thirdMenu.hidden"
                    :key="thirdMenu.id"
                    :index="thirdMenu.title"
                    @click="jump($event, thirdMenu)"
                    class="menu-item">
                  <item :title="thirdMenu.title" :icon="thirdMenu.icon"></item>
                </el-menu-item>
              </template>
              <!-- 三级菜单 -->
            </el-submenu>
            <el-menu-item
                v-else
                v-show="!secondMenu.hidden"
                :key="secondMenu.id"
                :index="secondMenu.title"
                @click="jump($event, secondMenu)"
                class="menu-item">
              <item :title="secondMenu.title" :icon="secondMenu.icon"></item>
            </el-menu-item>
          </template>
          <!-- 二级菜单 -->
        </el-submenu>
        <el-menu-item
            v-else
            v-show="!firstMenu.hidden"
            :key="firstMenu.id"
            :index="firstMenu.title"
            @click="jump($event, firstMenu)"
            class="menu-item">
          <item :title="firstMenu.title" :icon="firstMenu.icon"></item>
        </el-menu-item>
      </template>
      <!-- 一级菜单 -->
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import Logo from "./Logo";
  import Item from "./Item";
  import Style from "../scss/index.scss"
  import {isEmpty} from "@/utils/common";

  export default {
    name: 'Menu',
    components: {Logo, Item},
    computed: {
      menu() {
        return this.$storeGet.menu
      },
      active() {
        return this.$storeGet.active
      },
      isDrawer() {
        return this.$storeGet.isDrawer
      },
      isCollapsed() {
        if (this.isDrawer) return false;
        if (this.isVertical) {
          return this.$storeGet.isCollapsed
        } else {
          return null
        }
      },
      isShowLogo() {
        return this.$storeGet.setting.isShowLogo
      },
      isVertical() {
        return this.$storeGet.setting.isVertical
      },
      isUniqueOpened() {
        return this.$storeGet.setting.isUniqueOpened
      },
      isNight() {
        return this.$storeGet.setting.isNight
      },
      style() {
        return Style
      }
    },
    methods: {
      jump(e, menu) {
        let name = menu.name;
        if (menu.iframe) {
          window.open(name);
          return
        }
        if (this.$route.name === name) return;
        // 改变面包屑
        this.$storeSet('setBreadcrumb', e.indexPath);
        // 添加tags
        this.$storeSet('addTags', {
          title: e.index,
          name: name,
          cache: menu.cache,
          indexPath: e.indexPath
        });
        // 改变当前激活菜单
        this.$storeSet('setActive', e.index);
        // 关闭抽屉菜单
        this.$storeSet('setDrawer', false);
        // 跳转
        this.$router.push({name: name});
      },
      hasChildren(value) {
        if (isEmpty(value)) return false;
        return value.some(item => !item.hidden)
      }
    },
  }
</script>

<style lang="scss">
  @import '../scss/index';

  /* 弹出菜单 */
  .el-menu--popup {
    min-width: $menu-popup-width;
  }

  /* 禁止选择 */
  .admin-menu-night,
  .admin-menu-light {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* 夜间模式 */
  .admin-menu-night {
    background-color: $night-menu-bg-color;

    .el-submenu__title:hover,
    .menu-item:hover {
      background-color: $night-menu-title-bg-hover-color !important;
    }

    .submenu-title.is-active .el-submenu__title {
      color: #f4f4f5 !important;
    }

    .submenu-title > .el-menu--inline .el-menu-item {
      background-color: $night-menu-item-bg-color !important;
    }

    .submenu-title.is-opened > .el-menu--inline .el-menu-item {
      &:hover {
        background-color: $night-menu-item-bg-hover-color !important;
      }
    }
  }

  /* 白昼模式 */
  .admin-menu-light {
    background-color: $light-menu-bg-color;

    .el-submenu__title:hover,
    .menu-item:hover {
      background-color: $light-menu-title-bg-hover-color;
    }

    .submenu-title.is-active .el-submenu__title {
      color: #1e1e1e !important;
    }

    .submenu-title > .el-menu--inline .el-menu-item {
      background-color: $light-menu-item-bg-color !important;
    }

    .submenu-title.is-opened > .el-menu--inline .el-menu-item {
      &:hover {
        background-color: $light-menu-item-bg-hover-color !important;
      }
    }
  }

  /* 水平菜单 */
  #admin-horizontal-menu {
    flex: none;
    height: $horizontal-menu-height + 1 !important;

    .el-scrollbar__wrap {
      overflow: hidden;
    }

    .el-menu--horizontal {
      display: flex;
      height: $horizontal-menu-height;
    }

    .el-submenu__title {
      height: $horizontal-menu-height;
      line-height: $horizontal-menu-height;
      border: 0;
    }

    .el-submenu__icon-arrow {
      display: none;
    }
  }

  /* 垂直菜单 */
  #admin-vertical-menu {
    height: 100%;

    .el-scrollbar__wrap {
      overflow-x: hidden;
      overflow-y: scroll;
    }

    .el-menu {
      border: 0;
    }

    .el-menu--collapse {
      width: $menu-collapse-width;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: $menu-width;
    }
  }
</style>
