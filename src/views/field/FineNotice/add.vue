<template>
  <el-dialog
      title="添加场馆公告"
      width="600px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input v-model="form.noticeTitle"></el-input>
      </el-form-item>
      <el-form-item label="公告内容" prop="noticeContent">
        <el-input  type="textarea" v-model="form.noticeContent"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
import {resetForm} from "@/utils/common";
import {addFineNoticeApi} from "../../../api/field";

export default {
  name: "addFineNotice",
  data() {
    return {
      visible: false,
      form: {
        noticeTitle: "",
        noticeContent: "",
      },
      rules: {
        noticeTitle: {required: true, message: '请输入公告编号', trigger: 'blur'},
        noticeContent: {required: true, message: '请输入公告标题', trigger: 'blur'},
      }
    }
  },
  methods: {
    submit() {
      this.$refs['Form'].validate(valid => {
        if (!valid) return false;
        let data = {...this.form};
        this.$refs.Submit.start();
        addFineNoticeApi(data).then(result => {
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
