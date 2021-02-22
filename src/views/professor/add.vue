<template>
  <el-dialog
      title="新增专家资料"
      width="600px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="职务" prop="job">
        <el-input v-model="form.job"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="brief">
        <el-input v-model="form.brief" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="照片" prop="photo">
        <image-uploader v-model="form.photo"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addExpertDataApi} from '@/api/professor';
  import {resetForm} from "@/utils/common";

  export default {
    name: "Add",
    data() {
      return {
        visible: false,
        form: {
          name: '',
          phone: '',
          photo: '',
          brief: '',
          job: ''
        },
        rules: {
          name: {required: true, message: '请输入姓名', trigger: 'blur'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          this.$refs.Submit.start();
          addExpertDataApi(data).then(result => {
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
