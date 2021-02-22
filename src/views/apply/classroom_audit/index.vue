<template>
  <card>
    <el-tabs v-model="active">
      <el-tab-pane label="负责人审核" name="page1">
        <page1 v-if="pages.includes('page1')"/>
      </el-tab-pane>
      <el-tab-pane v-if="isAdmin" label="超级管理员审核" name="page2">
        <page2 v-if="pages.includes('page2')"/>
      </el-tab-pane>
    </el-tabs>
  </card>
</template>

<script>
  import Page1 from './page1'
  import Page2 from './page2'

  export default {
    name: "ClassroomAudit",
    components: {Page1, Page2},
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
    },
    computed: {
      isAdmin() {
        return this.$storeGet.roles.includes('admin')
      }
    }
  }
</script>
