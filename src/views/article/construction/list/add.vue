<template>
  <el-dialog
      title="新增全景图"
      width="800px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="封面" prop="cover">
        <image-uploader v-model="form.cover"></image-uploader>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">单张</el-radio>
          <el-radio :label="1">六张</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.type===0" label="全景图" prop="path">
        <image-uploader v-model="form.path"></image-uploader>
      </el-form-item>
      <row-col v-if="form.type===1">
        <el-form-item label="左" prop="left">
          <image-uploader v-model="form.left"></image-uploader>
        </el-form-item>
        <el-form-item label="右" prop="right">
          <image-uploader v-model="form.right"></image-uploader>
        </el-form-item>
        <el-form-item label="顶" prop="top">
          <image-uploader v-model="form.top"></image-uploader>
        </el-form-item>
        <el-form-item slot="r" label="前" prop="front">
          <image-uploader v-model="form.front"></image-uploader>
        </el-form-item>
        <el-form-item slot="r" label="后" prop="back">
          <image-uploader v-model="form.back"></image-uploader>
        </el-form-item>
        <el-form-item slot="r" label="底" prop="bottom">
          <image-uploader v-model="form.bottom"></image-uploader>
        </el-form-item>
      </row-col>
      <el-form-item label="视频" prop="videoPath">
        <video-uploader v-model="form.videoPath"/>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <tree-select
            v-model="form.deptId"
            :tree="dept"
            placeholder="请选择"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addDeptPictureApi} from '@/api/construction';
  import {resetForm} from "@/utils/common";
  import VideoUploader from '../components/VideoUploader'

  export default {
    name: "Add",
    components: {VideoUploader},
    props: {
      dept: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        visible: false,
        form: {
          cover: '', // 图片
          deptId: null, // 部门
          path: '', // 全景图
          videoPath: '', // 视频

          type: 0,
          left: '',
          right: '',
          top: '',
          front: '',
          back: '',
          bottom: ''
        },
        rules: {
          cover: {required: true, message: '请上传封面', trigger: 'change'},
          deptId: {required: true, message: '请选择部门', trigger: 'change'},
          path: {required: true, message: '请上传图片', trigger: 'change'},
          left: {required: true, message: '请上传图片', trigger: 'change'},
          right: {required: true, message: '请上传图片', trigger: 'change'},
          top: {required: true, message: '请上传图片', trigger: 'change'},
          front: {required: true, message: '请上传图片', trigger: 'change'},
          back: {required: true, message: '请上传图片', trigger: 'change'},
          bottom: {required: true, message: '请上传图片', trigger: 'change'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {
            cover: this.form.cover,
            deptId: this.form.deptId,
            videoPath: this.form.videoPath
          }
          if (this.form.type === 0) { // 单张
            data.path = this.form.path
          } else { // 六张
            data.path = `${this.form.left},${this.form.front},${this.form.right},${this.form.back},${this.form.top},${this.form.bottom}`
          }
          this.$refs.Submit.start();
          addDeptPictureApi(data).then(result => {
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
