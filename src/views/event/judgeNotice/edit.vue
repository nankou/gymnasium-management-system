<template>
  <el-dialog
      title="编辑裁判公告"
      width="600px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="裁判名称" prop="judgeName">
        <el-input v-model="form.judgeName"></el-input>
      </el-form-item>
      <el-form-item label="裁判类型" prop="judgeType">
        <el-input v-model="form.judgeType"></el-input>
      </el-form-item>
      <el-form-item label="裁判照片" prop="cover">
        <image-uploader v-model="form.judgePhotoUrl"/>
      </el-form-item>
      <el-form-item label="裁判简介" prop="judgeIntroduce">
        <el-input type="textarea" v-model="form.judgeIntroduce"></el-input>
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
import {editJudgeNoticeApi} from "../../../api/event";

export default {
  name: "editEvent",
  data() {
    return {
      visible: false,
      form: {
        judgeName: "",
        judgeType: "",
        judgePhotoUrl: "",
        judgeIntroduce: "",
      },
      rules: {
        judgeName: {required: true, message: '请输入裁判名称', trigger: 'blur'},
        judgeType: {required: true, message: '请输入裁判类型', trigger: 'blur'},
        judgePhotoUrl: {required: true, message: '请上传裁判照片', trigger: 'blur'}
      }
    }
  },
  methods: {
    submit() {
      this.$refs['Form'].validate(valid => {
        if (!valid) return false;
        let data = {...this.form};
        this.$refs.Submit.start();
        editJudgeNoticeApi(data).then(result => {
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
