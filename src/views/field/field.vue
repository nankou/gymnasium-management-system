<template>
  <card ref="Card">
    <div slot="header">
      <span class="title">场地管理</span>
      <el-input placeholder="输入场地名搜索" v-model="searchName" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">添加场地</el-button>
    </div>
    <expand-table :data="formData">
      <el-table-column prop="name" label="场地名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="场地类型">
        <template slot-scope="scope">
          <span>{{translate(scope.row.type)}}</span>
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
      <el-table-column prop="status" label="场地状态">
        <template slot-scope="scope">
          <span>{{translates(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="charge" label="场地价格（元/小时）"/>
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
  import {delFieldApi, getFieldApi, pageFieldApi} from "../../api/field";
  import {objectEvaluate} from "@/utils/common";

  export default {
    name: 'field',
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
      translates(status){
        switch (status) {
          case 0:
            return '未通过'
            break;
          case 1:
            return '审核通过'
            break;
          default:
                return '未通过'
        }
      },
      translate(type){
        switch (type) {
          case 0:
            return '未预约'
            break;
          case 1:
            return '个人'
            break;
          case  2:
            return '赛事'
            break;
          case 3:
            return '上课'
          break;
          case 4:
            return '校队'
            break;
          default:
            return '未预约'
        }
      },
      getData() {
        this.$refs.Card.start();
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          name : this.searchName
        };
        pageFieldApi(param).then(result => {
          let response = result.resultParam.fieldPage;
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
        getFieldApi({id: obj.id}).then(result => {
          let response = result.resultParam.field;
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
        delFieldApi({ids: id})
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