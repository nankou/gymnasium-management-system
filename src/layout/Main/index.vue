<template>
  <el-main>
    <transition name="Ryan-animation" mode="out-in">
      <keep-alive :include="cache">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
  </el-main>
</template>

<script>
  export default {
    name: "Main",
    computed: {
      key() {
        if (this.$route.meta.active) {
          return this.$route.meta.active
        } else {
          return this.$route.name
        }
      },
      cache() {
        return this.$storeGet.cache
      }
    }
  }
</script>

<style lang="scss">
  @import '../scss/index';

  .el-main {
    .Ryan-animation-enter-active {
      transition: all .3s;
    }

    .Ryan-animation-leave-active {
      transition: all .3s;
    }

    .Ryan-animation-enter {
      opacity: 0;
    }

    .Ryan-animation-leave-to {
      opacity: 0;
    }
  }
</style>
