<template>
  <el-dialog
      title="部门成员"
      width="80%"
      @close="cancel"
      @opened="getData"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <card ref="Card">
      <div slot="header">
        <el-input placeholder="输入工号/学号搜索" v-model="searchUsername" clearable class="w-200 ml-5" @keyup.enter.native="getData"/>
        <el-input placeholder="输入姓名搜索" v-model="searchNickName" clearable class="w-200 ml-5" @keyup.enter.native="getData"/>
        <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      </div>
      <el-table :data="formData">
        <el-table-column prop="username" label="工号/学号"/>
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
        <el-table-column prop="phone" label="电话"/>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">正常</el-tag>
            <el-tag type="warning" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatDateTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="Pagination" @update="getData"></pagination>
    </card>
  </el-dialog>
</template>

<script>
  import {pageUserApi} from '@/api/system/user';
  import {resetData} from "@/utils/common";

  export default {
    name: "Detail",
    props: {
      deptId: {
        required: true
      }
    },
    data() {
      return {
        visible: false,
        searchUsername: '',
        searchNickName: '',
        formData: []
      }
    },
    methods: {
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          deptId: this.deptId,
          username: this.searchUsername,
          nickName: this.searchNickName,
        };
        this.$refs.Card.start();
        pageUserApi(param).then(result => {
          this.$refs.Card.stop();
          let response = result.resultParam.userList;
          this.formData = response.records;
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
