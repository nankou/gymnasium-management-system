<template>
  <card>
    <go-back :content="title" @back="goBack"/>
    <card ref="CardNot" class="mb-20">
      <div slot="header">
        <span>未完成</span>
      </div>
      <el-table :data="formDataNot">
        <el-table-column prop="username" label="工号学号"/>
        <el-table-column prop="nickName" label="姓名"/>
        <el-table-column label="职务">
          <template slot-scope="scope">
            {{scope.row.job | formatObj}}
          </template>
        </el-table-column>
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
        <span>已完成</span>
      </div>
      <el-table :data="formDataHad">
        <el-table-column prop="username" label="工号学号"/>
        <el-table-column prop="nickName" label="姓名"/>
        <el-table-column label="职务">
          <template slot-scope="scope">
            {{scope.row.job | formatObj}}
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">
            {{scope.row.dept | formatObj}}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号"/>
      </el-table>
      <pagination ref="PaginationHad" @update="getDataHad"/>
    </card>
  </card>
</template>

<script>
  import {pageConditionApi} from '@/api/evaluation';

  export default {
    name: "Condition",
    data() {
      return {
        formDataNot: [],
        formDataHad: []
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      title() {
        return this.$route.query.title
      }
    },
    activated() {
      this.getDataNot()
      this.getDataHad()
    },
    methods: {
      getDataNot() {
        let pagination = this.$refs.PaginationNot;
        let param = {
          current: pagination.current,
          size: pagination.size,
          evaluateId: this.id,
          isSuccess: false
        };
        this.$refs.CardNot.start();
        pageConditionApi(param).then(result => {
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
          evaluateId: this.id,
          isSuccess: true
        };
        this.$refs.CardHad.start();
        pageConditionApi(param).then(result => {
          let response = result.resultParam.userDtoPage;
          this.formDataHad = response.records;
          pagination.total = response.total;
          this.$refs.CardHad.stop();
        }).catch(() => {
          this.$refs.CardHad.stop();
        })
      },
      goBack() {
        this.$router.push({
          name: 'evaluation_project'
        })
      }
    }
  }
</script>
