<template>
  <el-dialog
      title="组织关系转接详情"
      width="500px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" ref="Form" label-width="100px">
      <el-form-item label="转出支部">
        <span>{{form | formatOut}}</span>
      </el-form-item>
      <el-form-item label="具体支部名称">
        <span>{{form.outDeptName}}</span>
      </el-form-item>
      <el-form-item label="转入支部">
        <span>{{form | formatInto}}</span>
      </el-form-item>
      <el-form-item label="具体支部名称">
        <span>{{form.intDeptName}}</span>
      </el-form-item>
      <el-form-item label="转接成员">
        <span>{{form.nickName}}</span>
      </el-form-item>
      <el-form-item label="发起时间">
        <span>{{form.createTime | formatDateTime}}</span>
      </el-form-item>
      <el-form-item label="转接原因">
        <span>{{form.reason}}</span>
      </el-form-item>
      <el-form-item label="状态">
        <el-tag v-if="form.state===0" type="danger">未通过</el-tag>
        <el-tag v-if="form.state===1" type="warning">审核中</el-tag>
        <el-tag v-if="form.state===2" type="success">已通过</el-tag>
      </el-form-item>
      <el-form-item label="经办人" v-if="form.auditorName">
        <span>{{form.auditorName}}</span>
      </el-form-item>
      <el-form-item label="联系电话" v-if="form.auditorPhone">
        <span>{{form.auditorPhone}}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">确 认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {resetForm} from "@/utils/common";

  export default {
    name: "Detail",
    data() {
      return {
        visible: false,
        form: {
          outDeptId: null, // 转出支部id
          outDept: null, // 转出支部
          outDeptName: '', // 具体支部名称
          intoDeptId: null, // 转入支部id
          intoDept: null, // 转入支部
          intDeptName: '', // 具体支部名称
          nickName: '', // 转接成员
          reason: '', // 转接原因
          createTime: '', // 发起时间
          state: '', // 状态
          auditorName: "", // 经办人
          auditorPhone: "" // 联系电话
        }
      }
    },
    methods: {
      cancel() {
        resetForm(this)
      }
    }
  }
</script>
