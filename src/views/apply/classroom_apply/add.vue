<template>
  <el-dialog
      title="党校培训课室(教三211)申请"
      width="500px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="使用时间" prop="time">
        <el-date-picker
            v-model="form.time"
            clearable
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请人" prop="applyUser">
        <el-input v-model="form.applyUser"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="参加人数" prop="numberCount">
        <el-input-number
            v-model="form.numberCount"
            controls-position="right"
            :precision="0"
            :min="1">
        </el-input-number>
      </el-form-item>
      <el-form-item label="参加领导" prop="leader">
        <el-input v-model="form.leader"></el-input>
      </el-form-item>
      <el-form-item label="申请原因" prop="reason">
        <el-input type="textarea" v-model="form.reason"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addClassRoomApplyApi} from '@/api/apply';
  import {resetForm} from "@/utils/common";

  export default {
    name: "Add",
    data() {
      return {
        visible: false,
        form: {
          time: '',
          applyUser: '',
          phone: '',
          numberCount: 1,
          leader: '',
          reason: ''
        },
        rules: {
          time: {required: true, message: '请选择使用时间', trigger: 'change'},
          applyUser: {required: true, message: '请输入申请人姓名', trigger: 'blur'},
          phone: {required: true, message: '请输入联系方式', trigger: 'blur'},
          reason: {required: true, message: '请输入申请原因', trigger: 'blur'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          this.$refs.Submit.start();
          addClassRoomApplyApi(data).then(result => {
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
