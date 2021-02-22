<template>
  <el-dialog
      title="组织关系转接回执"
      width="800px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">

    <div ref="Print">
      <div style="background-color: #F2F2F2!important;padding: 25px">
        <p style="text-align: center;font-size: 22px">组织关系介绍信电子回执</p>
        <div style="font-size: 17px;padding: 5px 0">
          <span style="text-decoration: underline">{{form.outDept | formatObj}}：</span>
        </div>
        <div style="padding: 5px 0 5px 36px;font-size: 17px;">
          <span style="text-decoration: underline;">{{form.nickName}}</span>
          <span>同志的党组织关系已转达到我处，特此回复。</span>
        </div>
        <div style="min-height: 80px!important;"></div>
        <div style="text-align: right;font-size: 17px;padding: 5px 0">{{form.updateTime | formatDateZh}}</div>
        <div style="text-align: right;font-size: 17px;padding: 5px 0">{{form.intoDept | formatObj}}</div>
        <div style="font-size: 17px">
          <span>经办人：{{form.auditorName}}</span>
          <span style="margin-left: 30px">联系电话：{{form.auditorPhone}}</span>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="warning" @click="print">打印</el-button>
      <el-button @click="visible = false">确 认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {resetData} from "@/utils/common";

  export default {
    name: "Receipt",
    data() {
      return {
        visible: false,
        form: {
          outDept: null, // 转出支部
          intoDept: null, // 转入支部
          nickName: '', // 转接成员
          updateTime: '', // 审核时间
          auditorName: "", // 经办人
          auditorPhone: "" // 联系电话
        }
      }
    },
    methods: {
      print() {
        this.$print(this.$refs['Print'])
      },
      cancel() {
        resetData(this, 'form')
      }
    }
  }
</script>
