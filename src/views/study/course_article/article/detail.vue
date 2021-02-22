<template>
  <card>
    <go-back :content="title + '文章'" @back="goBack"/>
    <el-form :model="form" :rules="rules" ref="Form" label-width="100px">
      <row-col>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item slot="r" label="排序" prop="sort">
          <el-input-number
              v-model="form.sort"
              controls-position="right"
              :precision="0"
              :min="1">
          </el-input-number>
        </el-form-item>
      </row-col>
      <custom-editor v-model="form.content"></custom-editor>
    </el-form>
    <div slot="footer">
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </card>
</template>

<script>
  import {editStudyArticleApi, addStudyArticleApi} from '@/api/study/article'
  import {filterHtml, resetForm} from "@/utils/common";

  export default {
    name: "Detail",
    props: {
      articleManageId: {
        required: true
      }
    },
    data() {
      return {
        title: '',
        id: 0,
        form: {
          title: '',
          sort: 1,
          content: '',
          txt: '',
          articleManageId: null
        },
        rules: {
          title: {required: true, message: '请输入标题', trigger: 'blur'},
          sort: {required: true, message: '请输入排序', trigger: 'change'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate((valid) => {
          if (!valid) return false;
          let data = {...this.form};
          data.txt = filterHtml(data.content)
          data.articleManageId = this.articleManageId
          this.$refs.Submit.start();
          if (this.title === '新增') {
            addStudyArticleApi(data).then(result => {
              this.$refs.Submit.stop();
              if (result.status !== 200) return
              this.$emit('update');
              this.goBack()
            }).catch(() => {
              this.$refs.Submit.stop();
            });
          } else {
            data.id = this.id;
            editStudyArticleApi(data).then(result => {
              this.$refs.Submit.stop();
              if (result.status !== 200) return
              this.$emit('update');
              this.goBack()
            }).catch(() => {
              this.$refs.Submit.stop();
            });
          }
        });
      },
      goBack() {
        this.$parent.isShow = true;
        resetForm(this)
      }
    }
  }
</script>
