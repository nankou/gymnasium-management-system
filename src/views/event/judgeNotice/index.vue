<template>
  <card ref="Card">
    <div slot="header">
      <span class="title">裁判公告</span>
      <el-input placeholder="输入裁判名称搜索" v-model="searchName" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">添加公告</el-button>
    </div>
    <expand-table :data="formData">
      <el-table-column prop="name" label="裁判名称">
        <template slot-scope="scope">
          <span>{{scope.row.judgeName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="judgeType" label="裁判类型"/>
      <el-table-column prop="cover" label="裁判照片">
        <template slot-scope="scope">
          <el-image
              fit="contain"
              style="height: 100px;width: 200px"
              :src="$baseApi + scope.row.judgePhotoUrl"
              :preview-src-list="[$baseApi + scope.row.judgePhotoUrl]">
            <div slot="error">
              <img src="../../../assets/notFound.png" alt="" style="height: 100px"/>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="judgeIntroduce" label="裁判简介"/>
      <el-table-column prop="createTime" label="创建日期">
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
import {delJudgeNoticeApi, getJudgeNoticeApi, pageJudgeNoticeApi} from "../../../api/event";
import {objectEvaluate} from "@/utils/common";

export default {
  name: 'judgeNotice',
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
        judgeName : this.searchName
      };
      pageJudgeNoticeApi(param).then(result => {
        let response = result.resultParam.judgeNoticePage;
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
      getJudgeNoticeApi({id: obj.id}).then(result => {
        let response = result.resultParam.judgeNotice;
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
      delJudgeNoticeApi({ids: id})
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

.title{
  padding: 10px;
}
</style>

