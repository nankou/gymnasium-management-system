<template>
  <el-dialog
      title="申请创建赛事"
      width="600px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="赛事名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="使用时间" prop="time">
        <date-time-picker :start.sync="form.startTime" :end.sync="form.endTime"/>
      </el-form-item>
      <el-form-item label="赛事类型" prop="type">
        <el-input v-model="form.type"></el-input>
      </el-form-item>
      <el-form-item label="比赛目的" prop="purpose">
        <el-input v-model="form.purpose"></el-input>
      </el-form-item>
<!--      <el-form-item label="场地数量" prop="numberCount">-->
<!--        <el-input-number-->
<!--            v-model="form.numberCount"-->
<!--            controls-position="right"-->
<!--            :precision="0"-->
<!--            :min="1">-->
<!--        </el-input-number>-->
<!--      </el-form-item>-->
      <el-form-item label="主办方" prop="sponsor">
        <el-input v-model="form.sponsor"></el-input>
      </el-form-item>
      <el-form-item label="赛事介绍" prop="introduce">
        <el-input type="textarea" v-model="form.introduce"></el-input>
      </el-form-item>
      <el-form-item label="规则介绍与奖惩" prop="rule">
        <el-input type="textarea" v-model="form.rule"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {resetForm} from "@/utils/common";
  import {addEventApi} from "../../api/event";

  export default {
    name: "addEvent",
    data() {
      return {
        visible: false,
        form: {
          name: "",
          type: "",
          purpose: "",
          sponsor: "",
          introduce: "",
          rule: "",
          fieldOrder: "",
          equipOrder: "",
          startTime: "",
          endTime: "",
          status: 0
        },
        rules: {
          name: {required: true, message: '请输入赛事名称', trigger: 'blur'},
          beginTime: {required: true, message: '请选择使用时间', trigger: 'change'},
          type: {required: true, message: '请输入赛事类型', trigger: 'blur'},
          phone: {required: true, message: '请输入联系方式', trigger: 'blur'},
          purpose: {required: true, message: '请输入赛事目的', trigger: 'blur'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          this.$refs.Submit.start();
          addEventApi(data).then(result => {
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
