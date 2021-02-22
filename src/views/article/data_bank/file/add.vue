<template>
  <el-dialog
      title="上传文件"
      width="500px"
      @close="reset"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-upload
        ref="FileUploader"
        list-type="text"
        :drag="true"
        :action="`${$baseApi}/dataFile/uploadFile`"
        :headers="headers"
        :multiple="true"
        :on-success="onSuccess"
        :before-upload="beforeUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">上传的文件不能超过{{size}}MB</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="visible = false">完 成</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {addDataFileApi} from "@/api/data";

  export default {
    name: "Add",
    props: {
      pId: { // 目录id
        required: true
      }
    },
    data() {
      return {
        visible: false,
        size: 200
      };
    },
    computed: {
      headers() {
        return {Authorization: this.$storeGet.token}
      }
    },
    methods: {
      onSuccess(result, file) {
        if (result.status !== 200) {
          file.status = 'fail'
          this.$errorMsg(result.message)
          return
        }
        addDataFileApi({
          name: file.name,
          link: result.resultParam.uploadFilePath,
          pId: this.pId
        })
      },
      beforeUpload(file) {
        const size = file.size / 1024 / 1024;
        if (size > this.size) {
          this.$errorMsg(`上传文件大小不能超过 ${this.size}MB!`);
          return false;
        }
        return true
      },
      reset() {
        this.$refs.FileUploader.clearFiles();
        this.$emit('update');
      }
    }
  }
</script>
