<template>
  <div>
    <el-upload
        ref="AvatarUploader"
        action="avatar-upload"
        :accept="accept"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="changeUpload"
    >
      <el-avatar shape="circle" :size="120" :src="url">
        <img src="../../assets/notFound.png" alt="头像"/>
      </el-avatar>
    </el-upload>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog
        title="头像剪裁"
        width="700px"
        :visible.sync="visible"
        append-to-body
        :close-on-click-modal="false"
        @close="closeUpload">
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
            @imgLoad="imgLoad"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUpload">取 消</el-button>
        <submit-button ref="Submit" @submit="submit"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {VueCropper} from 'vue-cropper'
  import {editAvatarApi} from "@/api/system/user";
  import {getUserInfoApi} from "@/api/person"
  import {imageLimit} from '@/settings'

  export default {
    name: 'AvatarUploader',
    components: {VueCropper},
    props: {
      url: {
        type: String,
        default: ''
      },
      size: { // 大小限制(MB)
        type: Number,
        default: imageLimit
      }
    },
    data() {
      return {
        accept: ".jpg, .png, .jpeg",
        fileName: '',
        visible: false,
        options: {
          img: '', // 裁剪图片的地址
          info: false, // 裁剪框的大小信息
          outputSize: 1, // 裁剪生成图片的质量
          outputType: 'png', // 裁剪生成图片的格式 jpeg、png、webp
          canScale: false, // 图片是否允许滚轮缩放
          fixedBox: false, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [1, 1], // 截图框的宽高比例
          autoCrop: true, // 是否默认生成截图框
          full: false, // 是否输出原图比例的截图
          canMoveBox: true, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: true, // 截图框是否被限制在图片里面
          infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
          high: true,
          size: 1
        }
      }
    },
    methods: {
      changeUpload(result) {
        let file = result.raw;
        this.fileName = file.name;
        const type = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
        const size = file.size / 1024 / 1024;
        if (!this.accept.includes(type)) {
          let accept = this.accept.replace(/[.]|[,]/g, "");
          this.$errorMsg(`上传头像只能是 ${accept} 格式!`);
          return;
        }
        if (size > this.size) {
          this.$errorMsg(`上传头像大小不能超过 ${this.size}MB!`);
          return;
        }
        this.$nextTick(() => {
          this.options.img = URL.createObjectURL(file);
          this.visible = true
        })
      },
      // 点击裁剪，这一步是可以拿到处理后的地址
      submit() {
        this.$refs.cropper.getCropBlob(data => {
          let formData = new FormData();
          formData.append('avatar', data, this.fileName);
          this.$refs.Submit.start();
          editAvatarApi(formData)
            .then(() => {
              this.$refs.Submit.stop();
              this.closeUpload();
              return getUserInfoApi()
            })
            .then(result => {
              this.$storeSet('setUser', result.resultParam.currentUser.user);
            })
            .catch(() => {
              this.$refs.Submit.stop();
            })
        })
      },
      // 关闭上传及裁剪
      closeUpload() {
        this.options.img = '';
        this.visible = false;
      },
      // 图片加载情况
      imgLoad(msg) {
        if (msg !== 'success') {
          this.$errorMsg("图片加载失败！")
        }
      }
    }
  }
</script>

<style>
  .cropper {
    width: 100%;
    height: 340px;
    display: inline-block;
  }
</style>
