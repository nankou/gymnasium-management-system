<template>
  <el-cascader
      v-model="selectedOptions"
      popper-class="region-select"
      clearable
      :placeholder="placeholder"
      @change="change"
      :props="{...{checkStrictly}, ...{value: 'label'}}"
      :options="options">
  </el-cascader>
</template>

<script>
  import {area} from './area'

  export default {
    name: "RegionSelect",
    props: {
      province: {type: String, default: ''},
      city: {type: String, default: ''},
      area: {type: String, default: ''},
      placeholder: {type: String, default: '选择位置'},
      checkStrictly: {type: Boolean, default: false} // true: 只有一个值，false: 一个或多个
    },
    data() {
      return {
        options: area,
        selectedOptions: []
      }
    },
    watch: {
      province(val, old) {
        if (val && !old) { // 第一次输入执行
          if (this.checkStrictly) return
          let options = []
          if (this.province) options.push(this.province)
          if (this.city) options.push(this.city)
          if (this.area) options.push(this.area)
          this.selectedOptions = options
        }
        if (!val && old) { // 外边清空
          if (this.checkStrictly) return
          this.selectedOptions = [];
        }
      }
    },
    methods: {
      change(array) {
        let length = array.length;
        if (this.checkStrictly) {
          if (length === 0) {
            this.$emit('update:province', '');
            this.$emit('update:city', '');
            this.$emit('update:area', '');
          } else if (length === 1) {
            this.$emit('update:province', array[0]);
            this.$emit('update:city', '');
            this.$emit('update:area', '');
          } else if (length === 2) {
            this.$emit('update:province', '');
            this.$emit('update:city', array[1]);
            this.$emit('update:area', '');
          } else {
            this.$emit('update:province', '');
            this.$emit('update:city', '');
            this.$emit('update:area', array[2]);
          }
        } else {
          if (length === 0) {
            this.$emit('update:province', '');
            this.$emit('update:city', '');
            this.$emit('update:area', '');
          } else if (length === 1) {
            this.$emit('update:province', array[0]);
            this.$emit('update:city', '');
            this.$emit('update:area', '');
          } else if (length === 2) {
            this.$emit('update:province', array[0]);
            this.$emit('update:city', array[1]);
            this.$emit('update:area', '');
          } else {
            this.$emit('update:province', array[0]);
            this.$emit('update:city', array[1]);
            this.$emit('update:area', array[2]);
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .region-select {
    .el-cascader-menu,
    .el-cascader-menu__wrap {
      height: 300px;
    }

    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
</style>
