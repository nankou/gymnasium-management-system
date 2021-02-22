<template>
  <el-dialog
      title="新增台账领导"
      width="500px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="领导" prop="userId">
        <user-search-select v-model="form.userId"/>
      </el-form-item>
      <el-form-item label="结束时间" prop="deadline">
        <el-date-picker
            v-model="form.deadline"
            clearable
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addLeaderApi} from '@/api/leader';
  import {resetForm} from "@/utils/common";
  import UserSearchSelect from '../components/UserSearchSelect'

  export default {
    name: "Add",
    components: {UserSearchSelect},
    props: {
      type: {required: true}
    },
    data() {
      return {
        visible: false,
        form: {
          userId: null,
          deadline: '',
          type: null
        },
        rules: {
          userId: {required: true, message: '请选择领导', trigger: 'change'},
          deadline: {required: true, message: '请选择结束日期', trigger: 'change'}
        }
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          data.type = this.type
          this.$refs.Submit.start();
          addLeaderApi(data).then(result => {
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
