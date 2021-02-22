<template>
  <el-dialog
      title="新增测评"
      width="650px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="题目类型" prop="type">
        <el-select v-model="form.type">
          <el-option label="单选题" :value="1"/>
          <el-option label="多选题" :value="2"/>
          <el-option label="简答题" :value="3"/>
        </el-select>
      </el-form-item>
      <el-form-item label="简介" prop="brief">
        <el-input type="textarea" v-model="form.brief"></el-input>
      </el-form-item>
      <el-form-item label="测评日期" prop="beginTime">
        <date-time-picker :start.sync="form.beginTime" :end.sync="form.deadline"/>
      </el-form-item>
      <el-form-item label="是否匿名" prop="isAnonymity">
        <el-radio-group v-model="form.isAnonymity">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addEvaluateApi} from '@/api/evaluation';
  import {resetForm} from "@/utils/common";

  export default {
    name: "Add",
    data() {
      return {
        visible: false,
        form: {
          title: '', // 标题
          type: 1, // 单选题1 多选题2 简答题3
          brief: '', // 简介
          beginTime: '', // 开始时间
          deadline: '', // 截止时间
          isAnonymity: true // 是否匿名
        },
        rules: {
          title: {required: true, message: '请输入标题', trigger: 'blur'},
          type: {required: true, message: '请选择题目类型', trigger: 'change'},
          beginTime: {required: true, message: '请选择日期', trigger: 'change'},
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          this.$refs.Submit.start();
          addEvaluateApi(data).then(result => {
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
        resetForm(this)
      }
    }
  }
</script>
