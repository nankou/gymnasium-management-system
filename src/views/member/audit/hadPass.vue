<template>
  <card ref="Card">
    <el-table :data="formData">
      <el-table-column prop="username" label="工号/学号"/>
      <el-table-column prop="nickName" label="姓名"/>
      <el-table-column prop="phone" label="电话" :show-overflow-tooltip="true"/>
      <el-table-column label="部门">
        <template slot-scope="scope">
          {{scope.row.dept | formatObj}}
        </template>
      </el-table-column>
      <el-table-column label="职务" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.job | formatObj}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"/>
  </card>
</template>

<script>
  import {pageCheckUserApi} from '@/api/member'

  export default {
    name: 'HadPassing',
    data() {
      return {
        formData: [],
        state: 2 // 状态 0 不通过 1 审核中 2 通过
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
          state: this.state
        };
        pageCheckUserApi(param).then(result => {
          let response = result.resultParam.userDtoPage;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.Card.stop();
        })
      }
    }
  }
</script>
