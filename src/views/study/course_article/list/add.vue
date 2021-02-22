<template>
  <el-dialog
      title="新增课程"
      width="800px"
      @opened="opened"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="100px">
      <el-form-item label="课程名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="年份" prop="year">
        <el-date-picker
            v-model="form.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="截至日期" prop="deadline">
        <el-date-picker
            v-model="form.deadline"
            clearable
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="分类" prop="sortId">
        <el-select v-model="form.sortId" clearable>
          <el-option v-for="item in type" :label="item.name" :value="item.id" :key="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="学分" prop="learnTime">
        <el-input-number
            v-model="form.learnTime"
            controls-position="right"
            :precision="1"
            :min="0">
        </el-input-number>
      </el-form-item>
      <el-form-item label="性质" prop="nature">
        <el-radio-group v-model="form.nature">
          <el-radio :label="0">选修</el-radio>
          <el-radio :label="1">必修</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="范围部门" prop="ids">
        <tree-select
            v-model="form.ids"
            :tree="dept"
            :keys="1"
            placeholder="请选择"/>
      </el-form-item>
      <el-form-item label="封面图片" prop="cover">
        <image-uploader v-model="form.cover"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addArticleManageApi} from '@/api/study/article';
  import {getCurrentYear, resetForm} from "@/utils/common";

  export default {
    name: "Add",
    props: {
      type: {
        required: true
      },
      dept: {
        required: true
      }
    },
    data() {
      return {
        visible: false,
        form: {
          name: '',
          year: '',
          deadline: '',
          sortId: null,
          learnTime: '',
          nature: 0,
          ids: [],
          cover: ''
        },
        rules: {
          name: {required: true, message: '请输入名称', trigger: 'blur'},
          year: {required: true, message: '请选择年份', trigger: 'change'},
          deadline: {required: true, message: '请选择截止日期', trigger: 'change'},
          sortId: {required: true, message: '请选择分类', trigger: 'change'},
          learnTime: {required: true, message: '请输入学时', trigger: 'blur'},
          nature: {required: true, message: '请选择性质', trigger: 'change'},
          ids: {required: true, message: '请选择范围部门', trigger: 'change'},
          cover: {required: true, message: '请选择封面', trigger: 'change'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate((valid) => {
          if (!valid) return;
          let data = {...this.form};
          this.$refs.Submit.start();
          addArticleManageApi(data).then(result => {
            this.$refs.Submit.stop();
            if (result.status !== 200) return
            this.$emit('update');
            this.visible = false;
          }).catch(() => {
            this.$refs.Submit.stop();
          })
        });
      },
      opened() {
        this.form.year = getCurrentYear()
      },
      cancel() {
        resetForm(this)
      }
    }
  }
</script>
