<template>
  <el-dialog
      title="组织关系转接编辑"
      width="650px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <row-col>
        <el-form-item label="转出支部" prop="outDeptId">
          <el-select v-model="form.outDeptId" filterable clearable>
            <el-option label="转出市外" :value="-1"/>
            <el-option label="转出省外" :value="0"/>
            <el-option v-for="item in dept" :label="item.name" :value="item.id" :key="item.id" :disabled="!isAdmin"/>
          </el-select>
        </el-form-item>
        <el-input slot="r" v-model="form.outDeptName" placeholder="具体支部名称"></el-input>
      </row-col>
      <row-col>
        <el-form-item label="转入支部" prop="intoDeptId">
          <el-select v-model="form.intoDeptId" filterable clearable>
            <el-option label="市外转入" :value="-1"/>
            <el-option label="省外转入" :value="0"/>
            <el-option v-for="item in dept" :label="item.name" :value="item.id" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-input slot="r" v-model="form.intDeptName" placeholder="具体支部名称"></el-input>
      </row-col>
      <el-form-item label="转接原因" prop="reason">
        <el-input v-model="form.reason" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {editTransferApi} from '@/api/member'
  import {resetForm} from "@/utils/common";

  export default {
    name: "Edit",
    props: {
      dept: {required: true}
    },
    data() {
      return {
        visible: false,
        form: {
          id: null,
          outDeptId: null, // 转出支部  -1转出市外 0转出省外
          outDeptName: '', // 具体支部名称
          intoDeptId: null, // 转入支部  -1市外转入 0省外转入
          intDeptName: '', // 具体支部名称
          reason: '', // 转接原因
          userId: null // 转接成员id
        },
        rules: {
          outDeptId: {required: true, message: '请选择转出支部', trigger: 'change'},
          intoDeptId: {required: true, message: '请选择转入支部', trigger: 'change'},
          reason: {required: true, message: '请输入转接原因', trigger: 'change'}
        }
      }
    },
    computed: {
      isAdmin() {
        return this.$storeGet.roles.includes('admin')
      }
    },
    methods: {
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          this.$refs.Submit.start();
          editTransferApi(data).then(result => {
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
