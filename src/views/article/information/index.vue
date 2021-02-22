<template>
  <card>
    <el-tabs v-model="active">
      <el-tab-pane v-for="item in options" :label="item.label" :name="item.name" :key="item.type"/>
    </el-tabs>
    <list :current="current"></list>
  </card>
</template>

<script>
  import List from './list'

  export default {
    name: "Information",
    components: {List},
    data() {
      return {
        active: 'page1',
        options: [
          {label: '新闻快讯', name: 'page1', type: 1},
          {label: '通知公告', name: 'page2', type: 2},
          {label: '党建风采', name: 'page3', type: 3},
          {label: '党务知识', name: 'page4', type: 4}
        ],
        current: {label: '新闻快讯', name: 'page1', type: 1}
      }
    },
    created() {
      this.current = this.options[0]
    },
    watch: {
      active(value) {
        this.options.some(item => {
          if (item.name === value) {
            this.current = item
            return true
          }
        })
      }
    }
  }
</script>
