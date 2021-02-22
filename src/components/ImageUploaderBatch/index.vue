<template>
  <div>
    <el-upload
        ref="ImageUploaderBatch"
        list-type="picture-card"
        class="img-cover draggable-uploader"
        :class="{'uploader-hidden': isHidden}"
        :action="`${$baseApi}/file/uploadPictureFile`"
        :headers="headers"
        :data="{typePath}"
        :limit="limit"
        :multiple="true"
        :accept="accept"
        :file-list="fileList"
        :on-preview="onPreview"
        :on-change="onChange"
        :on-success="onSuccess"
        :on-remove="onRemove"
        :before-upload="beforeUpload"
        :on-exceed="onExceed">
      <i class="el-icon-plus"></i>
      <div class="el-upload__tip" slot="tip">只能上传{{accept}}文件，不超过{{size}}MB，且至多{{limit}}张</div>
    </el-upload>
    <el-dialog :visible.sync="visible" append-to-body>
      <img width="100%" :src="url" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import {imageLimit} from "@/settings";
  import Sortable from "sortablejs";

  export default {
    name: "ImageUploaderBatch",
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
      },
      limit: { // 数量限制
        type: Number,
        default: 9
      }
    },
    data() {
      return {
        url: '',
        visible: false,
        isHidden: false,
        isInit: true,
        accept: ".jpg, .png, .jpeg",
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
      // 拖拽
      this.$nextTick(() => {
        const el = document.querySelectorAll(".draggable-uploader > ul")[0];
        Sortable.create(el, {
          animation: 150,
          onEnd: e => {
            let arr = this.fileList;
            arr.splice(e.newIndex, 0, arr.splice(e.oldIndex, 1)[0]);
            this.$nextTick(() => {
              this.handEmit(arr)
            })
          },
        });
      })
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
        let list = this.value.split(',');
        this.fileList = list.map(item => ({pathUrl: item, url: this.$baseApi + item}));
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
      onSuccess(result, file, fileList) {
        if (result.status !== 200) {
          file.status = 'fail'
          this.$errorMsg('上传失败')
          return
        }
        file.pathUrl = result.resultParam.uploadFilePath
        this.handEmit(fileList)
      },
      onRemove(file, fileList) {
        this.changeHidden(fileList)
        this.handEmit(fileList)
      },
      handEmit(fileList) {
        this.fileList = fileList;
        let pathStr = '';
        fileList.forEach(item => {
          pathStr = pathStr + `${item.pathUrl},`;
        });
        pathStr = pathStr.substr(0, pathStr.length - 1);
        this.$emit("input", pathStr);
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
      onExceed() {
        this.$errorMsg(`至多上传${this.limit}张图片`)
      },
      reset() {
        this.isInit = true
        this.fileList = [];
        this.changeHidden([])
        this.$refs.ImageUploaderBatch.clearFiles();
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

  .img-cover {
    .img {
      object-fit: cover;
    }
  }
</style>
