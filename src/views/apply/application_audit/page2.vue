<template>
  <card ref="Card">
    <el-table :data="formData">
      <el-table-column prop="applyCount" label="申请数量"/>
      <el-table-column prop="reason" label="申请原因" :show-overflow-tooltip="true"/>
      <el-table-column prop="phone" label="联系方式"/>
      <el-table-column prop="passState" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.passState===0" type="danger">未通过</el-tag>
          <el-tag v-if="scope.row.passState===1" type="warning">审核中</el-tag>
          <el-tag v-if="scope.row.passState===2" type="success">已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"/>
  </card>
</template>

<script>
  import {pageAdminPartyApplyApi} from '@/api/apply'

  export default {
    name: 'Page2',
    data() {
      return {
        formData: [] // 状态 0 不通过 1 审核中 2 通过
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
          size: pagination.size
        };
        pageAdminPartyApplyApi(param).then(result => {
          let response = result.resultParam.partyApplyPage;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.Card.stop();
        })
      }
    }
  }
</script>
