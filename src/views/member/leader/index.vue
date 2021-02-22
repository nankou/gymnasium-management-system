<template>
  <card>
    <el-tabs v-model="active">
      <el-tab-pane label="党建测评" name="page0">
        <page0 :dept="dept" v-if="pages.includes('page0')"/>
      </el-tab-pane>
      <el-tab-pane label="党校培训课室(教三211)审核" name="page1">
        <page1 :dept="dept" v-if="pages.includes('page1')"/>
      </el-tab-pane>
      <el-tab-pane label="《入党培养登记表》使用审核" name="page2">
        <page2 :dept="dept" v-if="pages.includes('page2')"/>
      </el-tab-pane>
    </el-tabs>
  </card>
</template>

<script>
  import page0 from './page0'
  import page1 from './page1'
  import page2 from './page2'
  import {treeDeptApi} from '@/api/system/dept'

  export default {
    name: "Leader",
    components: {page0, page1, page2},
    data() {
      return {
        active: 'page0',
        pages: [],
        dept: []
      }
    },
    created() {
      this.pages.push(this.active)
      this.getDept()
    },
    watch: {
      active(value) {
        if (!this.pages.includes(value)) {
          this.pages.push(value)
        }
      }
    },
    methods: {
      getDept() {
        treeDeptApi({deptName: ''}).then(result => {
          this.dept = result.resultParam.deptTree;
        })
      }
    }
  }
</script>
