<template>
  <card ref="Card">
    <div slot="header">
      <span class="title">场馆公告</span>
      <el-input placeholder="输入公告标题搜索" v-model="searchName" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">添加公告</el-button>
    </div>
    <expand-table :data="formData">
      <el-table-column prop="name" label="公告标题">
        <template slot-scope="scope">
          <span>{{scope.row.noticeTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noticeContent" label="公告内容">
        <template slot-scope="scope">
          <span>{{scope.row.noticeContent}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" ></el-button>
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delRole'"/>
        </template>
      </el-table-column>
    </expand-table>
    <add ref="Add" @update="getData"></add>
    <pagination ref="Pagination" @update="getData"/>
    <edit ref="Edit" @update="getData"/>
  </card>
</template>


<script>
import Add from './add'
import Edit from './edit'
import {delFineNoticeApi, getFineNoticeApi, pageFineNoticeApi} from "../../../api/field";
import {objectEvaluate} from "@/utils/common";

export default {
  name: 'FineNotice',
  components: {Add,Edit},
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
        noticeTitle : this.searchName
      };
      pageFineNoticeApi(param).then(result => {
        let response = result.resultParam.fineNoticePage;
        this.formData = response.records;
        pagination.total = response.total;
        this.$refs.Card.stop();
      })
    },
    add() {
      this.$refs.Add.visible = true
    },
    // 编辑
    edit(obj) {
      this.$refs.Card.start();
      this.$refs.Edit.visible = true
      getFineNoticeApi({id: obj.id}).then(result => {
        let response = result.resultParam.FineNotice;
        let _this = this.$refs.Edit;
        _this.form.id = obj.id; // 添加编辑的id
        objectEvaluate(_this.form, response, this);
        _this.visible = true;
        this.$refs.Card.stop();
      }).catch(() => {
        this.$refs.Card.stop();
      })
    },
    // 删除
    delData(id) {
      delFineNoticeApi({ids: id})
          .then(() => {
            this.getData();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
    },

  }
}
</script>

<style>
.field {
  padding: 10px 20px;
}
.title{
  padding: 10px;
}
</style>