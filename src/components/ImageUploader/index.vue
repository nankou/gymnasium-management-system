<template>
  <div>
    <el-upload
        ref="ImageUploader"
        list-type="picture-card"
        :class="{'uploader-hidden': isHidden,'animation-none': true}"
        :action="`${$baseApi}/file/uploadPictureFile`"
        :headers="headers"
        :data="{typePath}"
        :limit="limit"
        :accept="accept"
        :file-list="fileList"
        :on-preview="onPreview"
        :on-change="onChange"
        :on-success="onSuccess"
        :on-remove="onRemove"
        :before-upload="beforeUpload">
      <i class="el-icon-plus"></i>
      <div class="el-upload__tip" slot="tip">只能上传{{accept}}文件，且不超过{{size}}MB</div>
    </el-upload>
    <el-dialog :visible.sync="visible" append-to-body>
      <img width="100%" :src="url" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {imageLimit} from "@/settings";

  export default {
    name: "ImageUploader",
    props: {
      value: {
        type: String,
        default: ""
      },
      typePath: { // 上传路径
        type: String,
        default: 'image'
      },
      size: { // 大小限制(MB)
        type: Number,
        default: imageLimit
      }
    },
    data() {
      return {
        url: '',
        visible: false,
        isHidden: false,
        isInit: true,
        accept: ".jpg, .png, .jpeg",
        limit: 1,
        fileList: []
      };
    },
    computed: {
      headers() {
        return {Authorization: this.$storeGet.token}
      }
    },
    mounted() {
      if (this.value) {
        this.init()
      }
    },
    watch: {
      value(val) {
        if (val && this.isInit) { // 赋值执行
          this.init()
        }
        if (!val) { // 清空执行
          this.reset()
        }
      }
    },
    methods: {
      init() {
        this.fileList = [{url: this.$baseApi + this.value}]
        this.changeHidden(this.fileList)
        this.isInit = false
      },
      changeHidden(fileList) {
        this.isHidden = fileList.length >= this.limit;
      },
      onPreview(file) {
        this.url = file.url;
        this.visible = true;
      },
      onChange(file, fileList) {
        this.isInit = false
        this.changeHidden(fileList)
      },
      onSuccess(result, file) {
        if (result.status !== 200) {
          file.status = 'fail'
          this.$errorMsg('上传失败')
          return
        }
        this.$emit("input", result.resultParam.uploadFilePath);
        this.$parent.$emit('el.form.change');
      },
      onRemove(file, fileList) {
        this.changeHidden(fileList)
        this.$emit("input", '');
        this.$parent.$emit('el.form.change');
      },
      beforeUpload(file) {
        const type = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
        const size = file.size / 1024 / 1024;
        if (!this.accept.includes(type)) {
          let accept = this.accept.replace(/[.]|[,]/g, "");
          this.$errorMsg(`上传图片只能是 ${accept} 格式!`);
          return false;
        }
        if (size > this.size) {
          this.$errorMsg(`上传图片大小不能超过 ${this.size}MB!`);
          return false;
        }
        return true
      },
      reset() {
        this.isInit = true
        this.fileList = [];
        this.changeHidden([])
        this.$refs.ImageUploader.clearFiles();
      }
    }
  }
</script>

<style lang="scss">
  .uploader-hidden {
    .el-upload--picture-card {
      display: none;
    }
  }

  .animation-none {
    .el-upload-list__item {
      transition: none;
      margin: 0;
    }

    .img {
      object-fit: cover;
    }
  }
</style>
