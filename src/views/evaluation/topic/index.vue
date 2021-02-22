<template>
  <card ref="Card">
    <div slot="header">
      <go-back :content="title" @back="goBack"/>
      <el-input v-model="searchName" placeholder="输入姓名搜索" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add" v-permission="'addDataFile'">新增</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column prop="serial" label="序号"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="job" label="职务"/>
      <el-table-column prop="dept" label="部门"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" v-permission="'editDataFile'"/>
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delDataFile'"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"/>
    <add ref="Add" @update="getData" :id="id" :type="type"></add>
    <edit ref="Edit" @update="getData" :type="type"></edit>
  </card>
</template>

<script>
  import {pageTopicApi, delTopicApi} from '@/api/evaluation';
  import {objectEvaluate} from "@/utils/common";
  import Add from './add';
  import Edit from './edit';

  export default {
    name: "Topic",
    components: {Add, Edit},
    data() {
      return {
        formData: [],
        searchName: '',
        type: null
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      title() {
        return this.$route.query.title
      }
    },
    activated() {
      this.getData()
    },
    methods: {
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          name: this.searchName,
          evaluateId: this.id
        };
        this.$refs.Card.start();
        pageTopicApi(param).then(result => {
          this.type = result.resultParam.evaluate.type
          this.title = result.resultParam.evaluate.title
          let response = result.resultParam.topicPage;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      add() {
        this.$refs.Add.visible = true
      },
      edit(obj) {
        let _this = this.$refs.Edit;
        objectEvaluate(_this.form, obj);
        _this.visible = true
      },
      delData(id) {
        delTopicApi({id: id})
          .then(() => {
            this.getData();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      },
      goBack() {
        this.$router.push({
          name: 'evaluation_project'
        })
      }
    }
  }
</script>
