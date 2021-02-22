<template>
  <div v-if="isShowLogo"
       :id="isVertical ? '' : 'logo-horizontal'"
       :class="['logo-container', isNight ? 'logo-night' : 'logo-light']">
    <div class="logo-box">
      <div class="logo">
        <img src="../../assets/logo.png" alt="logo">
      </div>
      <h1 class="logo-title">{{menuTitle}}</h1>
    </div>
  </div>
</template>

<script>
  import {menuTitle} from "@/settings";

  export default {
    name: "Logo",
    computed: {
      menuTitle() {
        return menuTitle
      },
      isShowLogo() {
        return this.$storeGet.setting.isShowLogo
      },
      isNight() {
        return this.$storeGet.setting.isNight
      },
      isVertical() {
        return this.$storeGet.setting.isVertical
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../scss/index';

  /* 夜间模式 */
  .logo-night {
    background-color: $night-menu-bg-color;
    border-bottom: 1px solid $night-menu-bg-color;

    .logo-title {
      color: $light-menu-bg-color;
    }
  }

  /* 白昼模式 */
  .logo-light {
    background-color: $light-menu-bg-color;
    border-bottom: 1px solid #e9ebef;

    .logo-title {
      color: $night-menu-bg-color;
    }
  }

  /* 菜单水平 */
  #logo-horizontal {
    border: none;
  }

  .logo-container {
    & .logo-box {
      width: $menu-width;
      height: $horizontal-menu-height;

      & .logo {
        display: inline-block;
        width: $menu-collapse-width;
        height: $horizontal-menu-height;
        text-align: center;

        & img {
          width: 50%;
          margin-top: $horizontal-menu-height / 4;
        }
      }

      & .logo-title {
        display: inline-block;
        width: $menu-width - $menu-collapse-width;
        font-weight: 600;
        line-height: $horizontal-menu-height;
        font-size: 14px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: top;
      }
    }
  }
</style>
