<template>
  <el-dialog
      title="学习情况记录详情"
      width="700px"
      @close="cancel"
      @opened="getData"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" ref="Form" label-width="100px" v-loading="isLoading">
      <row-col>
        <el-form-item label="年份">
          {{year}}
        </el-form-item>
        <el-form-item slot="r" label="姓名">
          {{form.nickName}}
        </el-form-item>
      </row-col>
      <row-col>
        <el-form-item label="工号/学号">
          {{form.username}}
        </el-form-item>
        <el-form-item slot="r" label="手机号">
          {{form.phone}}
        </el-form-item>
      </row-col>
      <row-col>
        <el-form-item label="职务">
          {{form.job | formatObj}}
        </el-form-item>
        <el-form-item slot="r" label="部门">
          {{form.dept | formatObj}}
        </el-form-item>
      </row-col>
      <row-col>
        <el-form-item label="必修总学分">
          {{form.requiredTime}}
        </el-form-item>
        <el-form-item slot="r" label="必修课进度">
          <el-progress style="padding-top: 8px" :percentage="$getProgress(form.required)"/>
        </el-form-item>
      </row-col>
      <row-col>
        <el-form-item label="选修总学分">
          {{form.electiveTime}}
        </el-form-item>
        <el-form-item slot="r" label="选修课进度">
          <el-progress style="padding-top: 8px" :percentage="$getProgress(form.elective)"/>
        </el-form-item>
      </row-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">确 认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getLearnResultApi} from '@/api/study/video';
  import {resetForm} from "@/utils/common";

  export default {
    name: "Detail",
    props: {
      id: {
        require: true
      },
      year: {
        require: true
      }
    },
    data() {
      return {
        isLoading: false,
        visible: false,
        form: {
          nickName: '',
          username: '',
          phone: '',
          job: {},
          dept: {},
          requiredTime: 0,
          required: 0,
          electiveTime: 0,
          elective: 0
        }
      }
    },
    methods: {
      getData() {
        this.isLoading = true
        getLearnResultApi({id: this.id, year: this.year}).then(result => {
          this.isLoading = false
          let response = result.resultParam
          this.form = {...response, ...response.userDto}
        }).catch(() => {
          this.isLoading = false
        })
      },
      cancel() {
        resetForm(this)
      }
    }
  }
</script>
