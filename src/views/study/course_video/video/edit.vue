<template>
  <el-dialog
      title="编辑视频"
      width="700px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="100px">
      <el-form-item label="视频名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="视频排序" prop="sort">
        <el-input-number
            v-model="form.sort"
            controls-position="right"
            :precision="0"
            :min="1">
        </el-input-number>
      </el-form-item>
      <el-form-item label="视频路径" prop="path">
        <el-input v-model.trim="form.path"></el-input>
      </el-form-item>
      <el-form-item label="点击上传视频">
        <video-uploader :can-preview="false" v-model="form.path"></video-uploader>
      </el-form-item>
    </el-form>
    <template v-if="visible">
      <video-player v-show="form.path" @getDuration="getDuration" :sources="form.path"/>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {editVideoApi} from '@/api/study/video';
  import {resetForm} from "@/utils/common";
  import VideoPlayer from '@/components/VideoPlayer'

  export default {
    name: "Edit",
    props: {
      id: {required: true}
    },
    components: {VideoPlayer},
    data() {
      return {
        visible: false,
        form: {
          id: null,
          videoManageId: null,
          name: '',
          sort: 1,
          path: '',
          videoTime: 0,
        },
        rules: {
          name: {required: true, message: '请输入名称', trigger: 'blur'},
          sort: {required: true, message: '请输入排序', trigger: 'change'},
          path: {required: true, message: '请上传视频或输入视频链接', trigger: 'change'}
        }
      }
    },
    methods: {
      getDuration(value) {
        this.form.videoTime = value
      },
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          data.videoManageId = this.id;
          if (!data.videoTime) {
            this.$errorMsg('无法获取时长，请检查视频能否正常播放')
            return
          }
          this.$refs.Submit.start();
          editVideoApi(data).then(result => {
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
