<template>
  <card ref="Card">
    <div slot="header">
      <span>《入党培养登记表》使用申请</span>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">申请</el-button>
    </div>
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
    <add ref="Add" @update="getData"></add>
    <pagination ref="Pagination" @update="getData"/>
  </card>
</template>

<script>
  import {pagePartyApplyApi} from '@/api/apply'
  import Add from "./add";

  export default {
    name: 'ApplicationApply',
    components: {Add},
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
        pagePartyApplyApi(param).then(result => {
          let response = result.resultParam.partyApplyPage;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.Card.stop();
        })
      },
      add() {
        this.$refs.Add.visible = true
      }
    }
  }
</script>
