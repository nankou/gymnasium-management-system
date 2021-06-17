<template>
  <card ref="Card">
    <div slot="header">
      <el-input placeholder="全表模糊搜索" v-model="searchText" clearable class="w-200"
                @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column prop="userName" label="用户名"/>
      <el-table-column prop="nickName" label="用户昵称"/>
      <el-table-column prop="dept" label="部门"/>
      <el-table-column prop="ip" label="登陆IP"/>
      <el-table-column prop="address" label="登陆地点"/>
      <el-table-column prop="browser" label="浏览器"/>
      <el-table-column prop="loginTime" label="登陆时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.loginTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="70" v-permission="'kickOut'">
        <template slot-scope="scope">
          <delete-button
              :ref="scope.row.key"
              :id="scope.row.key"
              :msg="'确定强制退出该用户吗？'"
              type="text"
              text="强退"
              @start="delData"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"></pagination>
  </card>
</template>

<script>
  import {getOnlineUserApi, deleteOnlineUserApi} from "@/api/monitor/user";

  export default {
    name: "OnlineUser",
    data() {
      return {
        formData: [],
        searchText: ''
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        this.$refs.Card.start();
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          filter: this.searchText
        };
        getOnlineUserApi(param).then(result => {
          this.$refs.Card.stop();
          let response = result.resultParam.userListPageUtil;
          this.formData = response.records;
          pagination.total = response.total;
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      delData(key) {
        deleteOnlineUserApi({keys: key})
          .then(() => {
            this.getData();
            this.$refs[key].close()
          })
          .catch(() => {
            this.$refs[key].stop();
          })
      }
    }
  }
</script>
