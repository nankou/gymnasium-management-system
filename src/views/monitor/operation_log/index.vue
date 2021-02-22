<template>
  <card ref="Card" id="error-log">
    <expand-table :data="formData">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form class="log-table-expand">
            <el-form-item label="请求方法">
              <span>{{ props.row.method }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ props.row.params }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="工号/学号"/>
      <el-table-column prop="requestIp" label="IP"/>
      <el-table-column prop="address" label="IP来源"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column prop="browser" label="浏览器"/>
      <el-table-column label="请求耗时">
        <template slot-scope="scope">
          <el-tag>{{scope.row.time}}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
    </expand-table>
    <pagination ref="Pagination" @update="getData"></pagination>
  </card>
</template>

<script>
  import {getLogListApi} from '@/api/monitor/log'

  export default {
    name: "ErrorLog",
    data() {
      return {
        formData: []
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        this.$refs.Card.start();
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size
        };
        getLogListApi(param).then(result => {
          this.$refs.Card.stop();
          let response = result.resultParam.logIPage;
          this.formData = response.records;
          pagination.total = response.total;
        }).catch(() => {
          this.$refs.Card.stop();
        })
      }
    }
  }
</script>

<style lang="scss">
  #error-log {
    .log-table-expand {
      font-size: 0;
    }

    .log-table-expand label {
      width: 70px;
      color: #99a9bf;
    }

    .log-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 100%;
    }

    .log-table-expand .el-form-item__content {
      font-size: 12px;
    }
  }
</style>
