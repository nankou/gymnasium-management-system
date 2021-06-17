<template>
  <card ref="Card">
    <div slot="header">
      <el-input placeholder="输入岗位名称搜索" v-model="searchName" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add" v-permission="'addJob'">新增</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column prop="name" label="岗位名称"/>
      <el-table-column prop="sort" label="排序"/>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.enabled">启用</el-tag>
          <el-tag type="warning" v-else>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" v-permission="'editJob'"></el-button>
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delJob'"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"></pagination>
    <add ref="Add" @update="getData"></add>
    <edit ref="Edit" @update="getData"></edit>
  </card>
</template>

<script>
  import {getJobListApi, deleteJobApi} from '@/api/system/job';
  import {objectEvaluate} from "@/utils/common";
  import Add from './add';
  import Edit from './edit';

  export default {
    name: "Job",
    components: {Add, Edit},
    data() {
      return {
        searchName: '',
        formData: []
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          jobName: this.searchName
        };
        this.$refs.Card.start();
        getJobListApi(param).then(result => {
          this.$refs.Card.stop();
          let response = result.resultParam.jobList;
          this.formData = response.records;
          pagination.total = response.total;
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      add() {
        this.$refs.Add.visible = true
      },
      edit(obj) {
        let _this = this.$refs.Edit;
        if (obj.deptId === 0) obj.deptId = null;
        objectEvaluate(_this.form, obj);
        _this.visible = true
      },
      delData(id) {
        deleteJobApi({id: id})
          .then(() => {
            this.getData();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      }
    }
  }
</script>
