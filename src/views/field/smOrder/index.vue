<template>
  <card ref="Card">
    <div slot="header">
      <span class="title">场地预留</span>
      <el-input placeholder="输入场地名搜索" v-model="searchName" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
    </div>
    <expand-table :data="formData" >
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
          <el-button type="primary" @click="reserve(scope.row)" >预约</el-button>
        </template>
      </el-table-column>
    </expand-table>
    <pagination ref="Pagination" @update="getData" style="margin-bottom: 100px"/>

    <card ref="Card">
      <div slot="header">
        <span class="title">预留列表</span>
      </div>
      <expand-table :data="smformData">
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
        </el-table-column >
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
<!--            <el-button type="primary"  @click.stop="reserve(scope.row)" >预约</el-button>-->
          </template>
        </el-table-column>
      </expand-table>
    </card>
  </card>
</template>



<script>
  import { pageFieldApi} from "../../../api/field";
  //import {objectEvaluate} from "@/utils/common";

export default {
  name: 'smOrder',
  data() {
    return {
      formData: [],
      searchName: '',
      smformData:[],
      options:[{
        type: 0,
        label:'未预约'
      },{
        type:1,
        label:'个人'
      },{
        type:2,
        label:'赛事'
      },{
        type:3,
        label:'上课'
      },{
        type:4,
        label:'校队'
      }]
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
    reserve(obj) {
       this.smformData.push(obj);
    },
  }
}
</script>

<style>
.smOrder {
  padding: 10px 20px;
}
.title{
  padding: 10px;
}
</style>
