<template>
  <el-dialog
      title="发送范围"
      width="500px"
      @close="reset"
      @opened="getScope"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <div style="height: 50px" class="clearfix">
      <el-button class="float-right ml-5" @click="reset">清空</el-button>
      <el-button class="float-right" @click="selectAll">全选</el-button>
    </div>
    <el-tree
        v-loading="isLoading"
        :data="data"
        show-checkbox
        node-key="id"
        ref="Tree"
        highlight-current
        :props="defaultProps">
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {getDeptAndNameApi} from '@/api/evaluation'
  import {editPublicUserApi, getWorkPlanScopeApi} from '@/api/plan'

  export default {
    name: "Range",
    props: {
      workPlanId: {
        required: true
      }
    },
    data() {
      return {
        visible: false,
        isLoading: false,
        data: [],
        defaultProps: {
          children: 'userList',
          label: 'nickName'
        }
      }
    },
    mounted() {
      this.getDeptAndName()
    },
    methods: {
      selectAll() {
        let tree = this.$refs.Tree;
        let nodes = []
        tree.root.childNodes.forEach(item => {
          if (item.childNodes.length > 0) {
            nodes = nodes.concat(item.childNodes)
          }
        })
        nodes.forEach(item => {
          tree.setChecked(item, true);
        })
      },
      reset() {
        let tree = this.$refs.Tree;
        let nodes = []
        tree.root.childNodes.forEach(item => {
          tree.setChecked(item, false);
          if (item.childNodes.length > 0) {
            nodes = nodes.concat(item.childNodes)
          }
        })
        nodes.forEach(item => {
          tree.setChecked(item, false);
        })
      },
      getDeptAndName() {
        getDeptAndNameApi().then(result => {
          this.data = result.resultParam.deptUserDtoList
          this.data.forEach(item => {
            item.nickName = item.name
          })
        })
      },
      getScope() {
        this.isLoading = true
        getWorkPlanScopeApi({workPlanId: this.workPlanId}).then(result => {
          let keys = result.resultParam.userIds
          let tree = this.$refs.Tree;
          let nodes = []
          tree.root.childNodes.forEach(item => {
            if (item.childNodes.length > 0) {
              nodes = nodes.concat(item.childNodes)
            }
          })
          nodes.forEach(item => {
            if (keys.includes(item.data.id)) {
              tree.setChecked(item, true);
            }
          })
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
      },
      submit() {
        let tree = this.$refs.Tree;
        let nodes = tree.getCheckedNodes()
        let keys = []
        nodes.forEach(item => {
          if (!Object.prototype.hasOwnProperty.call(item, 'userList')) {
            keys.push(item.id)
          }
        })
        if (keys.length === 0) {
          this.$warnMsg('请选择发送范围')
          return
        }
        let data = {
          workPlanId: this.workPlanId,
          ids: keys
        }
        this.$refs.Submit.start()
        editPublicUserApi(data).then(result => {
          this.$refs.Submit.stop()
          if (result.status !== 200) return
          this.visible = false
        }).catch(() => {
          this.$refs.Submit.stop()
        })
      }
    }
  }
</script>
