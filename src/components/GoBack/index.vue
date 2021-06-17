<template>
  <el-page-header id="goBack" @back="goBack" :content="content"/>
</template>

<script>
  export default {
    name: "GoBack",
    props: {
      text: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      }
    },
    methods: {
      goBack() {
        this.$msgBox(this.text ? this.text : '确定返回？')
          .then(() => {
            this.$emit('back')
          })
          .catch(() => {
            return false
          })
      }
    }
  }
</script>

<style lang="scss">
  #goBack {
    padding-bottom: 25px;

    .el-page-header__content {
      font-weight: bold;
    }
  }
</style>