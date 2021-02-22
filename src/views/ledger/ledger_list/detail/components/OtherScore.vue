<template>
  <el-dialog
      title="互评评分详情"
      width="80%"
      @opened="opened"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <card ref="Card">
      <el-table :data="formData">
        <el-table-column prop="dept" label="部门">
          <template slot-scope="scope">
            <span>{{scope.row.dept | formatObj}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="评分"/>
      </el-table>
      <pagination ref="Pagination" @update="getData"/>
    </card>
  </el-dialog>
</template>

<script>
  import {pageOtherScoreApi} from '@/api/ledger';
  import {resetData} from "@/utils/common";

  export default {
    name: "OtherScore",
    data() {
      return {
        visible: false,
        formData: [],
        ledgerRowId: null
      }
    },
    methods: {
      opened() {
        this.getData()
      },
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          ledgerRowId: this.ledgerRowId
        };
        this.$refs.Card.start()
        pageOtherScoreApi(param).then(result => {
          this.$refs.Card.stop()
          let response = result.resultParam.otherScoreDtoPage;
          this.formData = response.records;
          pagination.total = response.total;
        }).catch(() => {
          this.$refs.Card.stop()
        })
      },
      cancel() {
        resetData(this)
      }
    }
  }
</script>
