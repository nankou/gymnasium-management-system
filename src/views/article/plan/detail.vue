<template>
  <card>
    <go-back :content="title + '工作计划'" @back="goBack"/>
    <el-form :model="form" :rules="rules" ref="Form" label-width="100px">
      <row-col>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
      </row-col>
      <el-form-item label="截至日期" prop="deadlineTime">
        <el-date-picker
            v-model="form.deadlineTime"
            clearable
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="属性" prop="isPrivate">
        <el-radio-group v-model="form.isPrivate" :disabled="title === '编辑'">
          <el-radio :label="false">公开</el-radio>
          <el-radio :label="true">私密</el-radio>
        </el-radio-group>
      </el-form-item>
      <custom-editor v-model="form.content"></custom-editor>
    </el-form>
    <div slot="footer">
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </card>
</template>

<script>
  import {editWorkPlanApi, addWorkPlanApi} from '@/api/plan'
  import {filterHtml, resetForm} from "@/utils/common";

  export default {
    name: "Detail",
    data() {
      return {
        title: '',
        id: 0,
        form: {
          title: '', // 标题
          deadlineTime: '', // 截止日期
          isPrivate: false, // 公开 私密
          content: '', // 内容
          txt: '' // 纯文本
        },
        rules: {
          title: {required: true, message: '请输入标题', trigger: 'blur'},
          deadlineTime: {required: true, message: '请选择日期', trigger: 'change'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate((valid) => {
          if (!valid) return false;
          let data = {...this.form};
          data.txt = filterHtml(data.content)
          this.$refs.Submit.start();
          if (this.title === '新增') {
            addWorkPlanApi(data).then(result => {
              this.$refs.Submit.stop();
              if (result.status !== 200) return
              this.$emit('update');
              this.goBack()
            }).catch(() => {
              this.$refs.Submit.stop();
            });
          } else {
            data.id = this.id;
            editWorkPlanApi(data).then(result => {
              this.$refs.Submit.stop();
              if (result.status !== 200) return
              this.$emit('update');
              this.goBack()
            }).catch(() => {
              this.$refs.Submit.stop();
            });
          }
        });
      },
      goBack() {
        this.$parent.isShow = true;
        resetForm(this)
      }
    }
  }
</script>
