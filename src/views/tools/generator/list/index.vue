<template>
  <card ref="Card">
    <div slot="header">
      <el-input placeholder="请输入表名搜索" v-model="searchTableName" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column prop="tableName" label="表名"/>
      <el-table-column label="创建时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="engine" label="数据库引擎"/>
      <el-table-column prop="coding" label="编码集"/>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="jumpToConfig(scope.row.tableName)">配置</el-button>
          <el-button type="success" class="ml-5" @click="toGen(scope.row.tableName)">生成</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"></pagination>
  </card>
</template>

<script>
  import {generator, pageTables} from "@/api/tools/generator";

  export default {
    name: "List",
    data() {
      return {
        searchTableName: '',
        formData: []
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          tableName: this.searchTableName,
        };
        this.$refs.Card.start();
        pageTables(param).then(result => {
          this.$refs.Card.stop();
          let response = result.resultParam.tableInfoDtoPage;
          this.formData = response.records;
          pagination.total = response.total;
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      jumpToConfig(name) {
        this.$router.push({
          name: 'generator_config',
          params: {name}
        })
      },
      toGen(tableName) {
        let param = {
          tableName: tableName
        };
        this.$refs.Card.start();
        generator(param).then(() => {
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      }
    }
  }
</script>
