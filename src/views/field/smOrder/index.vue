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
          <span>{{scope.row.type}}</span>
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
          <span>{{scope.row.status}}</span>
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
<!--          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" ></el-button>-->
<!--          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delRole'"/>-->
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
            <span>{{scope.row.type}}</span>
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
            <span>{{scope.row.status}}</span>
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
            <!--          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" ></el-button>-->
            <!--          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delRole'"/>-->
          </template>
        </el-table-column>
      </expand-table>
    </card>
  </card>
</template>


<script>
import {pageFieldApi} from "../../../api/field";
import {objectEvaluate} from "@/utils/common";

export default {
  name: 'smOrder',
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
      pageFieldApi(param).then(result => {
        let response = result.resultParam.fieldPage;
        this.formData = response.records;
        pagination.total = response.total;
        this.$refs.Card.stop();
      })
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
