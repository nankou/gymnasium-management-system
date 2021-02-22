<template>
  <card ref="Card">
    <div slot="header">
      <tree-select
          v-model="searchByDept"
          style="float: left;width: 200px;"
          :tree="dept"
          placeholder="选择部门搜索"
          @get="getData"/>
      <el-date-picker
          class="ml-5"
          v-model="searchYear"
          type="year"
          format="yyyy"
          value-format="yyyy"
          placeholder="选择年份"
          @change="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column prop="name" label="名称"/>
      <el-table-column label="所属部门">
        <template slot-scope="scope">
          {{scope.row.deptSmallDto | formatObj}}
        </template>
      </el-table-column>
      <el-table-column prop="year" label="年份"/>
      <el-table-column prop="description" label="描述" :show-overflow-tooltip="true"/>
      <el-table-column prop="totalScore" label="总分">
        <template slot-scope="scope">
          {{$fixScore(scope.row.totalScore)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="80">
        <template slot-scope="scope">
          <el-button type="success" @click.stop="detail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"/>
  </card>
</template>

<script>
  import {pageRankingApi} from '@/api/ledger';
  import {delNullKey, getCurrentYear} from "@/utils/common";
  import {treeDeptApi} from "@/api/system/dept";

  export default {
    name: "List",
    data() {
      return {
        formData: [],
        dept: [],
        searchByDept: null,
        searchYear: ''
      }
    },
    mounted() {
      this.searchYear = getCurrentYear()
      this.getData();
      this.getDept();
    },
    methods: {
      getDept() {
        treeDeptApi({deptName: ''}).then(result => {
          this.dept = result.resultParam.deptTree;
        })
      },
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          year: this.searchYear,
          deptId: this.searchByDept
        };
        delNullKey(param)
        this.$refs.Card.start();
        pageRankingApi(param).then(result => {
          let response = result.resultParam.ledgerDtoPage;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      detail(obj) {
        this.$router.push({
          name: 'ledger_sort_detail',
          query: {
            id: obj.id,
            name: obj.name
          }
        })
      }
    }
  }
</script>
