<template>
  <el-dialog
      title="组织关系转接发起"
      width="1200px"
      @close="cancel"
      @opened="opened"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-row :gutter="100">
      <el-col :span="14">
        <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
          <row-col>
            <el-form-item label="转出支部" prop="outDeptId">
              <el-select v-model="form.outDeptId" filterable clearable>
                <el-option label="转出市外" :value="-1"/>
                <el-option label="转出省外" :value="0"/>
                <el-option v-for="item in dept" :label="item.name" :value="item.id" :key="item.id" :disabled="!isAdmin"/>
              </el-select>
            </el-form-item>
            <el-input slot="r" v-model="form.outDeptName" placeholder="具体支部名称"></el-input>
          </row-col>
          <row-col>
            <el-form-item label="转入支部" prop="intoDeptId">
              <el-select v-model="form.intoDeptId" filterable clearable>
                <el-option label="市外转入" :value="-1"/>
                <el-option label="省外转入" :value="0"/>
                <el-option v-for="item in dept" :label="item.name" :value="item.id" :key="item.id"/>
              </el-select>
            </el-form-item>
            <el-input slot="r" v-model="form.intDeptName" placeholder="具体支部名称"></el-input>
          </row-col>
          <el-form-item label="转接原因" prop="reason">
            <el-input v-model="form.reason" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="10">
        <div style="height: 50px" class="clearfix">
          <el-button class="float-right ml-5" @click="reset">清空</el-button>
          <el-button class="float-right" @click="selectAll">全选</el-button>
        </div>
        <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            ref="Tree"
            highlight-current
            :props="defaultProps">
        </el-tree>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {getDeptAndNameApi} from '@/api/evaluation'
  import {addTransferApi} from '@/api/member'
  import {resetForm} from "@/utils/common";

  export default {
    name: "Add",
    props: {
      dept: {required: true}
    },
    data() {
      return {
        visible: false,
        data: [],
        defaultProps: {
          children: 'userList',
          label: 'nickName'
        },
        form: {
          outDeptId: null, // 转出支部  -1转出市外 0转出省外
          outDeptName: '', // 具体支部名称
          intoDeptId: null, // 转入支部  -1市外转入 0省外转入
          intDeptName: '', // 具体支部名称
          reason: '', // 转接原因
          ids: [] // 转接成员id
        },
        rules: {
          outDeptId: {required: true, message: '请选择转出支部', trigger: 'change'},
          intoDeptId: {required: true, message: '请选择转入支部', trigger: 'change'},
          reason: {required: true, message: '请输入转接原因', trigger: 'change'}
        }
      }
    },
    computed: {
      myDept() {
        return this.$storeGet.user.dept
      },
      isAdmin() {
        return this.$storeGet.roles.includes('admin')
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
          let response = result.resultParam.deptUserDtoList
          response.forEach(item => {
            item.nickName = item.name
          })
          if (this.isAdmin) { // 超管
            this.data = response
            return
          }
          response.some(item => { // 非超管
            if (item.id === this.myDept.id) {
              this.data = [item]
              return true
            }
          })
        })
      },
      opened() {
        if (!this.isAdmin) { // 非超管
          this.form.outDeptId = this.myDept.id
        }
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
          this.$warnMsg('请选择转接成员')
          return
        }
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          data.ids = keys
          this.$refs.Submit.start();
          addTransferApi(data).then(result => {
            this.$refs.Submit.stop();
            if (result.status !== 200) return;
            this.$emit('update');
            this.visible = false;
          }).catch(() => {
            this.$refs.Submit.stop();
          })
        });
      },
      cancel() {
        this.reset()
        resetForm(this)
      }
    }
  }
</script>
