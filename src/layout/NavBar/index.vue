<template>
  <div id="nav-bar">
    <div class="search-menu" v-show="!isSmall">
      <search-menu/>
    </div>
    <div class="screen-full-button" v-show="!isSmall">
      <screen-full/>
    </div>
    <div class="code-copy" v-if="$isDev">
      <code-copy/>
    </div>
    <el-dropdown trigger="click">
      <div class="el-dropdown-link">
        <el-avatar shape="square" :size="44" :src="avatarUrl">
          <img src="../../assets/notFound.png" alt="头像"/>
        </el-avatar>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-s-custom" @click.native='goPerson'>个人中心</el-dropdown-item>
        <el-dropdown-item icon="el-icon-s-tools" @click.native="drawer = true">系统设置</el-dropdown-item>
        <el-dropdown-item icon="el-icon-s-promotion" divided @click.native='logout'>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-drawer
        :visible.sync="drawer"
        :with-header="false"
        :destroy-on-close="true">
      <drawer-setting/>
    </el-drawer>
  </div>
</template>

<script>
  import ScreenFull from './ScreenFull'
  import SearchMenu from './SearchMenu'
  import DrawerSetting from './DrawerSetting'
  import {logoutApi} from '@/api/person'

  export default {
    name: "NavBar",
    components: {
      ScreenFull, SearchMenu, DrawerSetting,
      CodeCopy: () => import('./CodeCopy')
    },
    data() {
      return {
        drawer: false
      }
    },
    computed: {
      avatarUrl() {
        return this.$baseApi + this.$storeGet.user.avatar
      },
      isSmall() {
        return this.$storeGet.isSmall
      }
    },
    methods: {
      // 进入个人中心
      goPerson() {
        if (this.$route.name === 'person') return;
        this.$storeSet('setBreadcrumb', ['个人中心']);
        this.$storeSet('addTags', {title: '个人中心', name: 'person', indexPath: ['个人中心']});
        this.$storeSet('setActive', '个人中心');
        this.$router.push({name: 'person'})
      },
      // 退出登录
      logout() {
        this.$msgBox('确定注销并退出系统吗？').then(() => {
          logoutApi().then(() => {
            this.$router.push({name: 'login'})
          }).catch(() => {
            this.$router.push({name: 'login'})
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../scss/index';

  #nav-bar {
    display: flex;

    .search-menu,
    .screen-full-button,
    .code-copy {
      padding-right: 15px;
    }

    .el-dropdown {
      height: $header-height;
    }

    .el-dropdown-link {
      display: flex;
      justify-items: center;
      margin-top: ($header-height - 44px) /2;
      cursor: pointer;
    }

    .el-drawer__body {
      height: 0;
    }

    .el-drawer {
      width: 350px !important;
    }
  }
</style>
