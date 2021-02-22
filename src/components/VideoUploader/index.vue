<template>
  <div>
    <el-upload
        ref="VideoUploader"
        list-type="text"
        :drag="true"
        :action="`${$baseApi}/file/uploadVideoFile`"
        :headers="headers"
        :data="{typePath}"
        :limit="limit"
        :accept="accept"
        :file-list="fileList"
        :on-preview="onPreview"
        :on-change="onChange"
        :on-success="onSuccess"
        :on-remove="onRemove"
        :before-upload="beforeUpload"
        :on-exceed="onExceed">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将视频拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传{{accept}}文件，不超过{{size}}MB，且至多{{limit}}个</div>
    </el-upload>
    <el-dialog :visible.sync="visible" append-to-body width="900px">
      <video v-if="visible" :src="url" controls="controls" width="100%">
        <span>您的浏览器不支持！</span>
      </video>
    </el-dialog>
  </div>
</template>

<script>
  import {videoLimit} from "@/settings";

  export default {
    name: "VideoUploader",
    props: {
      value: {
        type: String,
        default: ""
      },
      typePath: { // 上传路径
        type: String,
        default: 'video'
      },
      size: { // 大小限制(MB)
        type: Number,
        default: videoLimit
      },
      canPreview: { // 是否能预览
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        url: '',
        visible: false,
        isInit: true,
        accept: ".mp4, .webm",
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
        let list = this.value.split('/');
        this.fileList = [{name: list[list.length - 1], url: this.value}]
        this.isInit = false
      },
      onPreview(file) {
        if (!this.canPreview) return;
        this.visible = true;
        if (file.url) {
          this.url = file.url;
          return
        }
        if (file.raw) {
          this.url = URL.createObjectURL(file.raw)
        }
      },
      onChange() {
        this.isInit = false
      },
      onSuccess(result, file) {
        if (result.status !== 200) {
          file.status = 'fail'
          this.$errorMsg('上传失败')
          return
        }
        this.$emit("input", this.$baseApi + result.resultParam.uploadFilePath);
        this.$parent.$emit('el.form.change');
      },
      onRemove() {
        this.$emit("input", '');
        this.$parent.$emit('el.form.change');
      },
      beforeUpload(file) {
        const type = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
        const size = file.size / 1024 / 1024;
        if (!this.accept.includes(type)) {
          let accept = this.accept.replace(/[.]|[,]/g, "");
          this.$errorMsg(`上传视频只能是 ${accept} 格式!`);
          return false;
        }
        if (size > this.size) {
          this.$errorMsg(`上传视频大小不能超过 ${this.size}MB!`);
          return false;
        }
        return true
      },
      onExceed() {
        this.$errorMsg(`至多上传${this.limit}个视频`)
      },
      reset() {
        this.isInit = true
        this.fileList = [];
        this.$refs.VideoUploader.clearFiles();
      }
    }
  }
</script>
