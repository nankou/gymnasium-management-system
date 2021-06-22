<template>
  <card ref="Card">
    <div slot="header">
      <span class="title">赛事查询</span>
      <el-input placeholder="输入赛事名称搜索" v-model="searchName" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
    </div>
    <expand-table :data="formData">
      <el-table-column prop="name" label="赛事名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="场地类型"/>
      <el-table-column prop="purpose" label="比赛目的"/>
      <el-table-column prop="sponsor" label="主办方"/>
      <!--      <el-table-column prop="fieldStatus" label="场地审批状态">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag v-if="scope.row.fieldOrder===0" type="danger">未通过</el-tag>-->
      <!--          <el-tag v-if="scope.row.fieldOrder===1" type="warning">审核中</el-tag>-->
      <!--          <el-tag v-if="scope.row.fieldOrder===2" type="success">已通过</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="equipStatus" label="器材审批状态">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag v-if="scope.row.equipOrder===0" type="danger">未通过</el-tag>-->
      <!--          <el-tag v-if="scope.row.equipOrder===1" type="warning">审核中</el-tag>-->
      <!--          <el-tag v-if="scope.row.equipOrder===2" type="success">已通过</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
    </expand-table>
    <pagination ref="Pagination" @update="getData"/>

  </card>
</template>

<script>
import {delEventApi, getEventApi, pageEventApi} from "../../api/event";
import {objectEvaluate} from "@/utils/common";

export default {
  name: 'event',
  data() {
    return {
      formData: [],
      searchName: ''
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$refs.Card.start();
      let pagination = this.$refs.Pagination;
      let param = {
        current: pagination.current,
        size: pagination.size,
        name : this.searchName
      };
      pageEventApi(param).then(result => {
        let response = result.resultParam.eventPage;
        this.formData = response.records;
        pagination.total = response.total;
        this.$refs.Card.stop();
      })
    },

  }
}
</script>

<style>
.event {
  padding: 10px 20px;
}
.title{
  padding: 10px;
}
</style>

