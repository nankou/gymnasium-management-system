<template>
  <card>
    <el-tabs v-model="active">
      <el-tab-pane label="审核中" name="first">
        <passing v-if="pages.includes('first')"/>
      </el-tab-pane>
      <el-tab-pane label="已通过" name="second">
        <had-pass v-if="pages.includes('second')"/>
      </el-tab-pane>
      <el-tab-pane label="未通过" name="third">
        <no-pass v-if="pages.includes('third')"/>
      </el-tab-pane>
    </el-tabs>
  </card>
</template>

<script>
  import HadPass from './hadPass'
  import Passing from './passing'
  import NoPass from './noPass'

  export default {
    name: "Audit",
    components: {HadPass, Passing, NoPass},
    data() {
      return {
        active: 'first',
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
