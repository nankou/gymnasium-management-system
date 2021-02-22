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
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      <copy class="float-right" @update="getData"/>
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
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="350">
        <template slot-scope="scope">
          <el-button type="success" @click.stop="detail(scope.row)">查看</el-button>
          <el-button type="warning" @click.stop="content(scope.row)">内容</el-button>
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)"/>
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"/>
    <add ref="Add" @update="getData" :dept="dept"></add>
    <edit ref="Edit" @update="getData" :dept="dept"></edit>
  </card>
</template>

<script>
  import {pageLedgerApi, delLedgerApi} from '@/api/ledger';
  import {treeDeptApi} from '@/api/system/dept';
  import {getCurrentYear, objectEvaluate} from "@/utils/common";
  import Add from './add';
  import Edit from './edit';
  import Copy from './copy';

  export default {
    name: "List",
    components: {Add, Edit, Copy},
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
      this.getData()
      this.getDept()
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
        this.$refs.Card.start();
        pageLedgerApi(param).then(result => {
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
          name: 'ledger_list_detail',
          query: {
            id: obj.id,
            name: obj.name
          }
        })
      },
      content(obj) {
        this.$router.push({
          name: 'ledger_list_content',
          query: {
            id: obj.id,
            name: obj.name
          }
        })
      },
      add() {
        this.$refs.Add.visible = true
      },
      edit(obj) {
        let _this = this.$refs.Edit;
        objectEvaluate(_this.form, obj, this);
        _this.visible = true
      },
      delData(id) {
        delLedgerApi({id: id})
          .then(() => {
            this.getData();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      }
    }
  }
</script>
