<template>
  <el-dialog
      title="编辑场地"
      width="600px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="场地名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="场地类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择场地类型">
          <el-option
                  v-for="item in options"
                  :key="item.type"
                  :label="item.label"
                  :value="item.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用时间" prop="time">
        <date-time-picker :start.sync="form.startTime" :end.sync="form.endTime"/>
      </el-form-item>
      <el-form-item label="场地价格(元/小时）" prop="charge">
        <el-input v-model="form.charge"></el-input>
      </el-form-item>
      <el-form-item label="场地状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择场地状态">
          <el-option
                  v-for="item in soptions"
                  :key="item.type"
                  :label="item.label"
                  :value="item.type">
          </el-option>
        </el-select>
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
import {editFieldApi} from "../../api/field";

export default {
  name: "editField",
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
        type: {required: true, message: '请输入场地类型', trigger: 'blur'},
        name: {required: true, message: '请输入场地名称', trigger: 'blur'},
        startTime: {required: true, message: '请选择使用时间', trigger: 'change'},
        status: {required: true, message: '请输入场地状态', trigger: 'blur'},
        position: {required: true, message: '请输入场地说明', trigger: 'blur'}
      },
      options:[{
        type: 0,
        label:'未预约'
      },{
        type:1,
        label:'个人'
      },{
        type:2,
        label:'赛事'
      },{
        type:3,
        label:'上课'
      },{
        type:4,
        label:'校队'
      }],
      soptions: [{
        type: 0,
        label: '未通过'
      }, {
        type: 1,
        label: '审核通过'
      }],
    }
  },
  methods: {
    submit() {
      this.$refs['Form'].validate(valid => {
        if (!valid) return false;
        let data = {...this.form};
        this.$refs.Submit.start();
        editFieldApi(data).then(result => {
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
