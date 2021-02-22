<template>
  <el-pagination
      v-if="total > 0"
      class="pagination"
      :page-sizes="pageSizes"
      :page-size="size"
      :layout="layout"
      :total="total"
      :current-page.sync="current"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
  </el-pagination>
</template>

<script>
  export default {
    name: "Pagination",
    data() {
      return {
        current: 1,
        total: 0,
        size: 10,
        pageSizes: [10, 20, 50, 100, 200],
        layout: "total, sizes, prev, pager, next, jumper"
      }
    },
    created() {
      this.size = this.$storeGet.setting.pagingSize
    },
    watch: {
      total(newValue, oldValue) {
        let size = this.size;
        if (
          newValue !== 0
          && newValue / size === Math.floor(oldValue / size)
          || newValue / size === Math.floor(oldValue / size) - 1
        ) {
          setTimeout(() => {
            this.$emit("update");
          }, 500);
        }
      }
    },
    methods: {
      handleCurrentChange(current) {
        this.current = current;
        this.$emit("update");
      },
      handleSizeChange(size) {
        this.size = size;
        this.$emit("update");
      }
    }
  };
</script>

<style lang="scss">
  .pagination {
    background-color: #fff;
    padding-top: 10px;
  }
</style>
