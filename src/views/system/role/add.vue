<template>
  <el-dialog
      title="新增角色"
      width="600px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="120px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <row-col>
        <el-form-item label="角色级别" prop="level">
          <el-input-number
              v-model="form.level"
              controls-position="right"
              :precision="0"
              :min="level">
          </el-input-number>
        </el-form-item>
        <el-form-item slot="r" label="数据范围">
          <el-select v-model="form.dataScope">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="本级" value="本级"></el-option>
            <el-option label="自定义" value="自定义"></el-option>
          </el-select>
        </el-form-item>
      </row-col>
      <el-form-item label="数据权限" v-show="form.dataScope==='自定义'">
        <tree-select
            v-model="form.deptIds"
            :keys="1"
            :tree="dept"
            placeholder="请选择部门"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addRoleApi} from '@/api/system/role';
  import {resetForm} from "@/utils/common";

  export default {
    name: "Add",
    props: {
      dept: {
        type: Array,
        default: () => []
      },
      level: {
        type: Number
      }
    },
    data() {
      return {
        visible: false,
        form: {
          nameZh: '',
          name: '',
          dataScope: '本级',
          level: 1,
          deptIds: [],
          remark: ''
        },
        rules: {
          name: {required: true, message: '请输入名称', trigger: 'blur'},
          level: {required: true, message: '请输入角色级别', trigger: 'blur'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          if (data.dataScope !== '自定义') data.deptIds = [];
          this.$refs.Submit.start();
          addRoleApi(data).then(result => {
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
