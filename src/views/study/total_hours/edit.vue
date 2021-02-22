<template>
  <el-dialog
      title="编辑总学分"
      width="700px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="100px">
      <el-form-item label="年份" prop="year">
        <el-date-picker
            v-model="form.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="总学分要求" prop="allLearnTime">
        <el-input-number
            v-model="form.allLearnTime"
            controls-position="right"
            :precision="1"
            :min="0">
        </el-input-number>
      </el-form-item>
      <el-form-item label="性质" prop="nature">
        <el-radio-group v-model="form.nature">
          <el-radio :label="0">选修</el-radio>
          <el-radio :label="1">必修</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <tree-select
            v-model="form.deptId"
            :tree="dept"
            placeholder="请选择"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {editLearnTimeApi} from '@/api/study/time';
  import {resetForm} from "@/utils/common";

  export default {
    name: "Edit",
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
          id: null,
          year: '', // 年份
          allLearnTime: 1, // 总学时
          nature: 0, // 性质  0选修 1必修
          deptId: null // 部门
        },
        rules: {
          year: {required: true, message: '请选择年份', trigger: 'change'},
          allLearnTime: {required: true, message: '请输入总学时', trigger: 'change'},
          nature: {required: true, message: '请选择性质', trigger: 'change'},
          deptId: {required: true, message: '请选择部门', trigger: 'change'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          this.$refs.Submit.start();
          editLearnTimeApi(data).then(result => {
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
