<template>
  <el-dialog
      title="阅读情况"
      @close="cancel"
      @opened="getData"
      :fullscreen="true"
      :visible.sync="visible">
    <card ref="CardNot" class="mb-20">
      <div slot="header">
        <span>未阅读</span>
      </div>
      <el-table :data="formDataNot">
        <el-table-column prop="username" label="工号学号"/>
        <el-table-column prop="nickName" label="姓名"/>
        <el-table-column label="部门">
          <template slot-scope="scope">
            {{scope.row.dept | formatObj}}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号"/>
      </el-table>
      <pagination ref="PaginationNot" @update="getDataNot"/>
    </card>
    <card ref="CardHad">
      <div slot="header">
        <span>已阅读</span>
      </div>
      <el-table :data="formDataHad">
        <el-table-column prop="username" label="工号学号"/>
        <el-table-column prop="nickName" label="姓名"/>
        <el-table-column label="部门">
          <template slot-scope="scope">
            {{scope.row.dept | formatObj}}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号"/>
      </el-table>
      <pagination ref="PaginationHad" @update="getDataHad"/>
    </card>
  </el-dialog>
</template>

<script>
  import {pageReadConditionApi} from '@/api/plan';
  import {resetData} from "@/utils/common";

  export default {
    name: "Condition",
    props: {
      workPlanId: {
        required: true
      }
    },
    data() {
      return {
        visible: false,
        formDataNot: [],
        formDataHad: []
      }
    },
    methods: {
      getData() {
        this.getDataNot()
        this.getDataHad()
      },
      getDataNot() {
        let pagination = this.$refs.PaginationNot;
        let param = {
          current: pagination.current,
          size: pagination.size,
          workPlanId: this.workPlanId,
          isSuccess: false
        };
        this.$refs.CardNot.start();
        pageReadConditionApi(param).then(result => {
          let response = result.resultParam.userDtoPage;
          this.formDataNot = response.records;
          pagination.total = response.total;
          this.$refs.CardNot.stop();
        }).catch(() => {
          this.$refs.CardNot.stop();
        })
      },
      getDataHad() {
        let pagination = this.$refs.PaginationHad;
        let param = {
          current: pagination.current,
          size: pagination.size,
          workPlanId: this.workPlanId,
          isSuccess: true
        };
        this.$refs.CardHad.start();
        pageReadConditionApi(param).then(result => {
          let response = result.resultParam.userDtoPage;
          this.formDataHad = response.records;
          pagination.total = response.total;
          this.$refs.CardHad.stop();
        }).catch(() => {
          this.$refs.CardHad.stop();
        })
      },
      cancel() {
        resetData(this)
      }
    }
  }
</script>
