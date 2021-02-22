<template>
  <el-footer>
    <span v-show="isShowFooter">{{footerTxt}} - {{caseNumber}}</span>
    <el-backtop ref="BackTop" v-if="flag" :bottom="150" target=".back-top"/>
  </el-footer>
</template>

<script>
  import {caseNumber, footerTxt} from "@/settings";

  export default {
    name: "Footer",
    data() {
      return {
        flag: false
      }
    },
    computed: {
      isFixHeader() {
        return this.$storeGet.setting.isFixHeader
      },
      isShowFooter() {
        return this.$storeGet.setting.isShowFooter
      },
      footerTxt() {
        return footerTxt
      },
      caseNumber() {
        return caseNumber
      }
    },
    mounted() {
      this.fixHeader();
    },
    watch: {
      '$route.path'() {
        this.$refs.BackTop.scrollToTop()
      },
      isFixHeader() {
        this.fixHeader()
      }
    },
    methods: {
      fixHeader() {
        let main = document.querySelector('.el-main');
        let container = document.querySelectorAll('.el-container')[1];
        if (this.isFixHeader) {
          container.classList.remove('back-top');
          main.style.overflow = 'auto';
          main.classList.add('back-top')
        } else {
          container.classList.add('back-top');
          main.style.overflow = 'visible';
          main.classList.remove('back-top')
        }
        this.flag = false;
        this.$nextTick(() => {
          this.flag = true
        })
      }
    }
  }
</script>

<style lang="scss">
  .el-backtop {
    background-color: #409eff;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .5);
    transition: .3s;
    opacity: .5;

    &:hover {
      background-color: #409eff;
      opacity: 1;
    }

    .el-icon-caret-top {
      color: #fff;
    }
  }
</style>
