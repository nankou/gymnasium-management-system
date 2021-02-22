<template>
  <el-row :gutter="20">
    <el-col :sm="24" :md="16" class="mb-15">
      <card ref="Card">
        <div slot="header">
          <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        </div>
        <el-table :data="formData" highlight-current-row @row-click="getLeader">
          <el-table-column label="姓名">
            <template slot-scope="scope">
              {{scope.row.user | formatObj('nickName')}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="开始日期">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deadline" label="结束日期">
            <template slot-scope="scope">
              <span>{{scope.row.deadline | formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)"/>
              <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData"/>
            </template>
          </el-table-column>
        </el-table>
        <pagination ref="Pagination" @update="getData"/>
        <add ref="Add" @update="getData" :type="type"></add>
        <edit ref="Edit" @update="getData" :type="type"></edit>
      </card>
    </el-col>
    <el-col :sm="24" :md="8">
      <card ref="TreeCard">
        <div slot="header">
          <tree-select
              v-model="searchByDept"
              class="w-250 mb-5"
              :tree="dept"
              placeholder="选择部门搜索"
              @get="listLedgerName"/>
          <el-input
              placeholder="输入党建测评名称搜索"
              v-model="searchName"
              clearable
              class="w-250 mb-5"
              @keyup.enter.native="listLedgerName"/>
          <br/>
          <el-date-picker
              v-model="searchYear"
              class="mb-5"
              type="year"
              :clearable="true"
              format="yyyy"
              @change="listLedgerName"
              value-format="yyyy"
              placeholder="选择年份搜索"/>
          <br/>
          <el-button type="success" class="el-icon-search" @click="listLedgerName">搜索</el-button>
          <submit-button ref="Submit" icon="el-icon-check" class="float-right" @submit="update" text="保存"/>
        </div>
        <checkbox-tree ref="RoleMenuTree" :ids="ledgerIds" :tree="tree"/>
      </card>
    </el-col>
  </el-row>
</template>

<script>
  import {pageLeaderApi, getLeaderApi, delLeaderApi, editLeaderApi, listLedgerNameApi} from '@/api/leader';
  import {delNullKey, formatDateTime, getCurrentYear, objectEvaluate} from "@/utils/common";
  import CheckboxTree from '../components/CheckboxTree'
  import Add from './add';
  import Edit from './edit';

  export default {
    name: "Page0",
    components: {CheckboxTree, Add, Edit},
    props: {
      dept: {type: Array}
    },
    data() {
      return {
        type: 0, // 台账0 党校培训课室审核1 入党申请书使用审核2
        formData: [],
        row: {},

        tree: [],
        ledgerIds: [],
        searchByDept: null,
        searchName: '',
        searchYear: ''
      }
    },
    mounted() {
      this.searchYear = getCurrentYear()
      this.listLedgerName()
      this.getData()
    },
    methods: {
      /**
       * @description 台帐分配
       * */
      listLedgerName() {
        let param = {
          deptId: this.searchByDept,
          name: this.searchName,
          year: this.searchYear
        }
        delNullKey(param)
        this.$refs.TreeCard.start();
        listLedgerNameApi(param).then(result => {
          this.$refs.TreeCard.stop();
          this.tree = result.resultParam.ledgerList
        }).catch(() => {
          this.$refs.TreeCard.stop();
        })
      },
      // 点击行
      getLeader(row) {
        this.row = row;
        this.$refs.Submit.cancelBan();
        this.$refs.RoleMenuTree.clear();
        this.$refs.TreeCard.start();
        getLeaderApi({id: row.id}).then(result => {
          this.$refs.TreeCard.stop();
          this.ledgerIds = result.resultParam.leaderProjectList.map(item => {
            if (item && item.projectId) return item.projectId
          });
        }).catch(() => {
          this.$refs.TreeCard.stop();
        })
      },
      // 更新
      update() {
        let row = this.row
        let data = {
          id: row.id,
          deadline: formatDateTime(row.deadline),
          type: row.type,
          userId: row.userId
        };
        data.ids = this.$refs.RoleMenuTree.get();
        if (data.ids.length === 0) {
          this.$errorMsg('请选择台账')
          return
        }
        this.$refs.Submit.start();
        editLeaderApi(data).then(() => {
          this.$refs.Submit.stop();
        }).catch(() => {
          this.$refs.Submit.stop();
        })
      },

      /**
       * @description 台帐领导列表
       * */
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          type: this.type
        };
        this.$refs.Card.start();
        pageLeaderApi(param).then(result => {
          let response = result.resultParam.leaderPage;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.RoleMenuTree.clear();
          this.$refs.Submit.ban();
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      add() {
        this.$refs.Add.visible = true
      },
      edit(obj) {
        let _this = this.$refs.Edit;
        this.$refs.Card.start();
        getLeaderApi({id: obj.id}).then(result => {
          this.$refs.Card.stop();
          obj.ids = result.resultParam.leaderProjectList.map(item => {
            if (item && item.projectId) return item.projectId
          });
          obj.deadline = formatDateTime(obj.deadline)
          objectEvaluate(_this.form, obj);
          _this.visible = true
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      delData(id) {
        delLeaderApi({id: id})
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
