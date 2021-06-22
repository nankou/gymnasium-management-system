<template>
  <el-dialog
      title="添加场地"
      width="600px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="场地名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="场地类型" prop="type">
        <el-input v-model="form.type"></el-input>
<!--        <div v-for="type" :key="index">-->
<!--          <el-select v-model="type">-->
<!--            <el-option value="个人">个人</el-option>-->
<!--            <el-option value="赛事">赛事</el-option>-->
<!--            <el-option value="校队">校队</el-option>-->
<!--            <el-option value="校队">上课</el-option>&ndash;&gt;-->
<!--          </el-select>-->
<!--        </div>-->
      </el-form-item>
      <el-form-item label="使用时间" prop="time">
        <date-time-picker :start.sync="form.startTime" :end.sync="form.endTime"/>
      </el-form-item>
      <el-form-item label="场地价格(元/小时）" prop="charge">
        <el-input v-model="form.charge"></el-input>
      </el-form-item>
      <el-form-item label="场地状态" prop="status">
        <el-input v-model="form.status"></el-input>
      </el-form-item>
      <el-form-item label="场地说明" prop="position">
        <el-input type="textarea" v-model="form.position"></el-input>
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
import {addFieldApi} from "../../api/field";

export default {
  name: "addField",
  data() {
    return {
      visible: false,
      form: {
        name: "",
        type: "",
        status: "",
        charge: "",
        position: "",
        startTime: "",
        endTime: "",
        reservationType: "",
      },
      rules: {
        name: {required: true, message: '请输入场地名称', trigger: 'blur'},
        startTime: {required: true, message: '请选择使用时间', trigger: 'change'},
        status: {required: true, message: '请输入场地状态', trigger: 'blur'},

      }
    }
  },
  methods: {
    submit() {
      this.$refs['Form'].validate(valid => {
        if (!valid) return false;
        let data = {...this.form};
        this.$refs.Submit.start();
        addFieldApi(data).then(result => {
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
