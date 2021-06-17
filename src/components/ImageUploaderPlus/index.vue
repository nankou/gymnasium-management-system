<template>
  <div>
    <el-upload
        ref="ImageUploaderPlus"
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
        :auto-upload="false">
      <i class="el-icon-plus"></i>
      <div class="el-upload__tip" slot="tip">只能上传{{accept}}文件，且不超过{{size}}MB</div>
    </el-upload>
    <el-dialog :visible.sync="visible" append-to-body>
      <img width="100%" :src="url" alt="">
    </el-dialog>
    <el-dialog
        title="图片剪裁"
        width="700px"
        :visible.sync="cropperVisible"
        append-to-body
        :close-on-click-modal="false">
      <div class="cropper">
        <vueCropper
            ref="cropper"
            :img="options.img"
            :output-size="options.size"
            :output-type="options.outputType"
            :info="options.info"
            :full="options.full"
            :fixed="options.fixed"
            :fixed-number="options.fixedNumber"
            :can-move="options.canMove"
            :can-move-box="options.canMoveBox"
            :fixed-box="options.fixedBox"
            :original="options.original"
            :auto-crop="options.autoCrop"
            :auto-crop-width="options.autoCropWidth"
            :auto-crop-height="options.autoCropHeight"
            :center-box="options.centerBox"
            :high="options.high"
            @imgLoad="imgLoad"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cropperVisible = false">取 消</el-button>
        <submit-button ref="Submit" @submit="submit"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {imageLimit} from "@/settings";
  import {VueCropper} from 'vue-cropper'

  export default {
    name: "ImageUploaderPlus",
    components: {VueCropper},
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
        default: imageLimit * 2
      },
      scale: { // 比例
        type: Array,
        default: () => [1, 1]
      }
    },
    data() {
      return {
        url: '',
        visible: false,
        cropperVisible: false,
        isHidden: false,
        isInit: true,
        accept: ".jpg, .png, .jpeg",
        limit: 1,
        fileList: [],
        options: {
          img: '', // 裁剪图片的地址
          info: false, // 裁剪框的大小信息
          outputSize: 1, // 裁剪生成图片的质量
          outputType: 'png', // 裁剪生成图片的格式 jpeg、png、webp
          canScale: false, // 图片是否允许滚轮缩放
          fixedBox: false, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: this.scale, // 截图框的宽高比例
          autoCrop: true, // 是否默认生成截图框
          full: false, // 是否输出原图比例的截图
          canMoveBox: true, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: true, // 截图框是否被限制在图片里面
          infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
          high: true,
          size: 1
        }
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
        if (file && file.status !== 'success') {
          file = file.raw
          const type = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
          const size = file.size / 1024 / 1024;
          if (!this.accept.includes(type)) {
            let accept = this.accept.replace(/[.]|[,]/g, "");
            this.$errorMsg(`上传图片只能是 ${accept} 格式!`);
            this.reset();
            return false;
          }
          if (size > this.size) {
            this.$errorMsg(`上传图片大小不能超过 ${this.size}MB!`);
            this.reset();
            return false;
          }
          this.$nextTick(() => {
            this.options.img = URL.createObjectURL(file);
            this.cropperVisible = true
          })
        }
      },
      onSuccess(result, file) {
        if (result.status !== 200) {
          file.status = 'fail'
          this.$errorMsg('上传失败')
          return
        }
        this.cropperVisible = false;
        this.$emit("input", result.resultParam.uploadFilePath);
        this.$parent.$emit('el.form.change');
      },
      onRemove(file, fileList) {
        this.changeHidden(fileList)
        this.$emit("input", '');
        this.$parent.$emit('el.form.change');
      },
      reset() {
        this.isInit = true
        this.fileList = [];
        this.changeHidden([])
        this.$refs.ImageUploaderPlus.clearFiles();
      },
      imgLoad(msg) {
        if (msg !== 'success') {
          this.$errorMsg("图片加载失败！")
        }
      },
      submit() {
        this.$refs.cropper.getCropBlob(data => {
          let _this = this.$refs.ImageUploaderPlus.uploadFiles[0]
          data.name = _this.name
          data.uid = _this.raw.uid
          _this.raw = data
          _this.url = URL.createObjectURL(data)
          this.$refs.ImageUploaderPlus.submit()
          this.cropperVisible = false;
        })
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

  .cropper {
    width: 100%;
    height: 340px;
    display: inline-block;
  }
</style>
