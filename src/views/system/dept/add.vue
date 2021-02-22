<template>
  <el-dialog
      title="新增部门"
      width="500px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="dutyManId">
        <user-search-select v-model="form.dutyManId"/>
      </el-form-item>
      <el-form-item label="评分人" prop="scoreUserId">
        <user-search-select v-model="form.scoreUserId"/>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
            v-model="form.sort"
            controls-position="right"
            :precision="0"
            :min="1">
        </el-input-number>
      </el-form-item>
      <!--<el-form-item label="部门状态">-->
      <!--  <el-radio-group v-model="form.enabled">-->
      <!--    <el-radio :label="true">启用</el-radio>-->
      <!--    <el-radio :label="false">停用</el-radio>-->
      <!--  </el-radio-group>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="上级部门">-->
      <!--  <tree-select-->
      <!--      v-model="form.pid"-->
      <!--      :tree="dept"-->
      <!--      placeholder="默认顶级部门"-->
      <!--  />-->
      <!--</el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addDeptApi} from '@/api/system/dept';
  import {resetForm} from "@/utils/common";
  import UserSearchSelect from './components/UserSearchSelect'

  export default {
    name: "Add",
    components: {UserSearchSelect},
    props: {
      dept: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        visible: false,
        form: {
          name: '', // 部门名称
          dutyManId: null, // 负责人
          scoreUserId: null, // 评分人
          phone: '', // 联系方式
          sort: 999,
          enabled: true,
          pid: null
        },
        rules: {
          name: {required: true, message: '请输入名称', trigger: 'blur'},
          sort: {required: true, message: '请输入排序', trigger: 'change'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          if (!data.pid) data.pid = 0;
          this.$refs.Submit.start();
          addDeptApi(data).then(result => {
            this.$refs.Submit.stop();
            if (result.status !== 200) return
            this.$emit('update');
            this.visible = false;
          }).catch(() => {
            this.$refs.Submit.stop();
          })
        });
      },
      cancel() {
        resetForm(this)
      }
    }
  }
</script>
