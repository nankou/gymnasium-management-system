<template>
  <card>
    <el-tabs v-model="active">
      <el-tab-pane label="审核中" name="page1">
        <page1 v-if="pages.includes('page1')"/>
      </el-tab-pane>
      <el-tab-pane label="已通过" name="page2">
        <page2 v-if="pages.includes('page2')"/>
      </el-tab-pane>
      <el-tab-pane label="未通过" name="page3">
        <page3 v-if="pages.includes('page3')"/>
      </el-tab-pane>
    </el-tabs>
  </card>
</template>

<script>
  import page1 from './page1'
  import page2 from './page2'
  import page3 from './page3'

  export default {
    name: "RelationAudit",
    components: {page1, page2, page3},
    data() {
      return {
        active: 'page1',
        pages: []
      }
    },
    created() {
      this.pages.push(this.active)
    },
    watch: {
      active(value) {
        if (!this.pages.includes(value)) {
          this.pages.push(value)
        }
      }
    }
  }
</script>
