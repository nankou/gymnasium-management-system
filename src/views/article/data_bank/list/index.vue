<template>
  <card ref="Card">
    <div slot="header">
      <el-input v-model="searchName" placeholder="输入名称搜索" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add" v-permission="'addDataFile'">新增</el-button>
    </div>
    <el-table :data="formData" @row-click="view">
      <el-table-column prop="name" label="目录名称"/>
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
    <add ref="Add" @update="getData"></add>
    <edit ref="Edit" @update="getData"></edit>
  </card>
</template>

<script>
  import {pageDataFileApi, delDataFileApi} from '@/api/data';
  import {objectEvaluate} from "@/utils/common";
  import Add from './add';
  import Edit from './edit';

  export default {
    name: "List",
    components: {Add, Edit},
    data() {
      return {
        formData: [],
        searchName: ''
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      view(obj) {
        this.$router.push({
          name: 'data_bank_file',
          query: {
            id: obj.id,
            name: obj.name
          }
        })
      },
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          name: this.searchName,
          pId: 0
        };
        this.$refs.Card.start();
        pageDataFileApi(param).then(result => {
          let response = result.resultParam.dataFilePage;
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
        delDataFileApi({id: id})
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
