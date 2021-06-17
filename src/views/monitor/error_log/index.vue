<template>
  <card ref="Card" id="operation-log">
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
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="requestIp" label="IP"/>
      <el-table-column prop="description" label="描述"/>
      <el-table-column label="创建日期" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常详情" width="100px" v-permission="'getErrorDetail'">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="info(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </expand-table>
    <pagination ref="Pagination" @update="getData"></pagination>
    <el-dialog :visible.sync="dialog" title="异常详情" :close-on-click-modal="false" top="30px" width="85%">
      <pre>{{errorInfo}}</pre>
    </el-dialog>
  </card>
</template>

<script>
  import {getErrorLogApi, getErrorDetailByIdApi} from '@/api/monitor/log'

  export default {
    name: "OperationLog",
    data() {
      return {
        formData: [],
        dialog: false,
        errorInfo: ''
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
        getErrorLogApi(param).then(result => {
          this.$refs.Card.stop();
          let response = result.resultParam.logPage;
          this.formData = response.records;
          pagination.total = response.total;
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      info(id) {
        this.$refs.Card.start();
        getErrorDetailByIdApi({id: id}).then(result => {
          this.dialog = true;
          this.$refs.Card.stop();
          this.errorInfo = result.resultParam.log.detail
        }).catch(() => {
          this.$refs.Card.stop();
        })
      }
    }
  }
</script>

<style lang="scss">
  #operation-log {
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

    .el-dialog__body {
      padding: 0 20px 10px 20px !important;
    }

    pre {
      white-space: pre-wrap;
    }
  }
</style>
