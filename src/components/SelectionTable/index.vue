<template>
  <el-table :data="data" @selection-change="getSelected">
    <el-table-column type="selection" width="55"/>
    <slot/>
  </el-table>
</template>

<script>
  export default {
    name: "SelectionTable",
    props: {
      keys: {
        type: Array,
        default: () => []
      },
      data: {
        type: Array,
        default: () => []
      },
      rowKey: {
        type: String,
        default: "id"
      }
    },
    methods: {
      getSelected(array) {
        this.$emit(
          "update:keys",
          array.map(item => item[this.rowKey])
        )
      }
    }
  }
</script>
