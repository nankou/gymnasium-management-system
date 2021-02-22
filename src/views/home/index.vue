<template>
  <div id="home" :style="'height:' + (mainHeight - 30) + 'px'" v-show="isShow"></div>
</template>

<script>
  const elementResizeDetectorMaker = require("element-resize-detector");
  let mainResizeListen = elementResizeDetectorMaker();

  export default {
    name: "Home",
    data() {
      return {
        mainHeight: 0,
        isShow: false
      };
    },
    mounted() {
      this.addListen();
    },
    methods: {
      addListen() {
        let main = document.querySelector(".el-main");
        this.mainHeight = main.offsetHeight;
        this.isShow = true;
        mainResizeListen.listenTo(main, () => {
          this.$nextTick(() => {
            this.mainHeight = main.offsetHeight;
          });
        });
      }
    },
    beforeDestroy() {
      let main = document.querySelector(".el-main");
      mainResizeListen.uninstall(main);
    }
  };
</script>

<style lang="scss">
  #home {
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    background: url("../../assets/home.jpg") no-repeat center center;
    background-size: cover;
  }
</style>
