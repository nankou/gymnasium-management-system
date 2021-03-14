<template>
  <el-container id="layout">
    <admin-menu v-if="isVertical" v-show="!isSmall"/>
    <el-drawer
        v-if="isVertical"
        :class="[isNight ? 'night-drawer-menu' : 'light-drawer-menu']"
        :destroy-on-close="true"
        :visible.sync="isDrawer"
        :with-header="false"
        direction="ltr">
      <admin-menu/>
    </el-drawer>
    <el-container>
      <admin-menu v-if="!isVertical"/>
      <el-header>
        <div>
          <breadcrumb/>
          <nav-bar/>
        </div>
        <tag/>
      </el-header>
      <admin-main/>
      <admin-footer/>
    </el-container>
  </el-container>
</template>

<script>
  import AdminFooter from './Footer'
  import Breadcrumb from './Breadcrumb'
  import AdminMenu from './Menu'
  import AdminMain from './Main'
  import NavBar from './NavBar'
  import Tag from './Tag'

  export default {
    name: 'Layout',
    components: {AdminFooter, AdminMain, NavBar,AdminMenu, Breadcrumb, Tag},
    computed: {
      isDrawer: {
        get() {
          return this.$storeGet.isDrawer;
        },
        set(value) {
          this.$storeSet('setDrawer', value);
        }
      },
      isSmall() {
        return this.$storeGet.isSmall
      },
      isVertical() {
        return this.$storeGet.setting.isVertical
      },
      isNight() {
        return this.$storeGet.setting.isNight
      }
    },
    mounted() {
      this.initialListener();
      this.getWindowWidth();
    },
    methods: {
      // 事件监听
      initialListener() {
        window.addEventListener('resize', () => {
          this.getWindowWidth()
        })
      },
      // 获取屏幕宽度
      getWindowWidth() {
        if (window.innerWidth < 992) {
          this.$storeSet('setSmall', true);
          this.$storeSet('setCollapsed', true);
        } else {
          this.$storeSet('setSmall', false);
          this.$storeSet('setDrawer', false);
        }
      }
    }
  }
</script>

<style lang="scss">
  @import './scss/index';

  #layout {
    width: 100%;
    height: 100%;

    .night-drawer-menu,
    .light-drawer-menu {
      .el-drawer__body {
        height: 0;
      }

      .el-drawer {
        width: $menu-width !important;
      }
    }

    .night-drawer-menu {
      .el-drawer {
        background-color: $night-menu-bg-color
      }
    }

    .light-drawer-menu {
      .el-drawer {
        background-color: $light-menu-bg-color
      }
    }

    .el-container {
      overflow-x: hidden;
      overflow-y: auto;
    }

    .el-header {
      height: auto !important;
      padding: 0;

      & > div:first-child {
        display: flex;
        justify-content: space-between;
        padding: 0 15px;
        border-bottom: 1px solid rgb(233, 235, 239);
      }
    }

    .el-main {
      padding: 15px;
      background-color: $main-bg-color;
    }

    .el-footer {
      padding: 0;
      height: auto !important;

      > span {
        display: block;
        line-height: $footer-height !important;
        border-top: 1px solid #dcdfe6;
        color: #666;
        text-indent: 1rem;
        letter-spacing: 1px;
        font-size: 0.7rem;
      }
    }
  }
</style>
