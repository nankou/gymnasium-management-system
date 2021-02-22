<template>
  <el-dialog
      title="详情"
      width="80%"
      @close="cancel"
      @opened="getData"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <card ref="Card">
      <el-table :data="formData">
        <el-table-column prop="username" label="工号/学号"/>
        <el-table-column prop="nickName" label="姓名"/>
        <el-table-column label="部门">
          <template slot-scope="scope">
            {{scope.row.dept | formatObj}}
          </template>
        </el-table-column>
        <el-table-column prop="answer" label="选项"/>
      </el-table>
      <pagination ref="Pagination" @update="getData"></pagination>
    </card>
  </el-dialog>
</template>

<script>
  import {pageResultDetailApi} from '@/api/evaluation';
  import {resetData} from "@/utils/common";

  export default {
    name: "Detail",
    props: {
      topicId: {
        required: true
      }
    },
    data() {
      return {
        visible: false,
        formData: []
      }
    },
    methods: {
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          topicId: this.topicId
        };
        this.$refs.Card.start();
        pageResultDetailApi(param).then(result => {
          this.$refs.Card.stop();
          let response = result.resultParam.testPaperDtoPage;
          this.formData = response.records.map(item => {
            return {...item, ...item.userDto}
          })
          pagination.total = response.total;
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      cancel() {
        resetData(this)
      }
    }
  }
</script>
