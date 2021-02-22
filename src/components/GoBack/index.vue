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
        this.$emit('back')
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
