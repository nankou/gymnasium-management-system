<template>
  <el-dialog
      title="上传缴费证明"
      width="700px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="季度" prop="quarter">
        <el-input-number
            v-model="form.quarter"
            controls-position="right"
            :precision="0"
            :min="1"
            :max="4">
        </el-input-number>
      </el-form-item>
      <row-col>
        <el-form-item label="金额" prop="price">
          <el-input-number
              v-model="form.price"
              controls-position="right"
              :precision="2"
              :min="0">
          </el-input-number>
        </el-form-item>
        <el-form-item slot="r" label="党员人数" prop="peopleNumber">
          <el-input-number
              v-model="form.peopleNumber"
              controls-position="right"
              :precision="0"
              :min="1">
          </el-input-number>
        </el-form-item>
      </row-col>
      <el-form-item label="图片" prop="picture">
        <image-uploader-batch :limit="4" v-model="form.picture"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addPayApi} from '@/api/dues';
  import {resetForm} from "@/utils/common";

  export default {
    name: "Add",
    data() {
      return {
        visible: false,
        form: {
          quarter: 1, // 季度
          price: 0, // 金额
          peopleNumber: 1, // 党员人数
          picture: '' // 图片
        },
        rules: {
          quarter: {required: true, message: '请输入季度', trigger: 'change'},
          price: {required: true, message: '请输入金额', trigger: 'change'},
          peopleNumber: {required: true, message: '请输入党员人数', trigger: 'change'},
          picture: {required: true, message: '请上传图片', trigger: 'change'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          this.$refs.Submit.start();
          addPayApi(data).then(result => {
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
