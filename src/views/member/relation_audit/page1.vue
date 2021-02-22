<template>
  <card ref="Card">
    <div slot="header">
      <el-input v-model="searchName" placeholder="输入姓名搜索" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
    </div>
    <expand-table :data="formData">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="expand-table-content">
            <span>转接原因:</span>
            <pre>{{props.row.reason}}</pre>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="outDept" label="转出支部">
        <template slot-scope="scope">
          {{scope.row | formatOut}}
        </template>
      </el-table-column>
      <el-table-column prop="intoDept" label="转入支部">
        <template slot-scope="scope">
          {{scope.row | formatInto}}
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="转接成员"/>
      <el-table-column v-if="state===1" prop="createTime" label="发起时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="state!==1" prop="updateTime" label="审核时间">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state===0" type="danger">未通过</el-tag>
          <el-tag v-if="scope.row.state===1" type="warning">审核中</el-tag>
          <el-tag v-if="scope.row.state===2" type="success">已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="300">
        <template slot-scope="scope">
          <el-button @click.stop="detail(scope.row)">查看</el-button>
          <el-button v-if="state===1" type="success" @click.stop="pass(scope.row)">通过</el-button>
          <el-button v-if="state===1" type="warning" @click.stop="reject(scope.row)">拒绝</el-button>
          <el-button v-if="state===1" type="danger" @click.stop="delData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </expand-table>
    <detail ref="Detail"></detail>
    <pagination ref="Pagination" @update="getData"/>
  </card>
</template>

<script>
  import {pageTransferApi, agreeTransferApi, disAgreeTransferApi, delTransferApi} from '@/api/member'
  import {objectEvaluate} from "@/utils/common";
  import Detail from "../components/Detail";

  export default {
    name: 'Page1',
    components: {Detail},
    data() {
      return {
        formData: [],
        state: 1, // 状态 不通过0 审核中1 通过2
        searchName: ''
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
          size: pagination.size,
          name: this.searchName,
          state: this.state
        };
        pageTransferApi(param).then(result => {
          let response = result.resultParam.transferDtoPage;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.Card.stop();
        })
      },
      detail(obj) {
        let _this = this.$refs.Detail;
        objectEvaluate(_this.form, obj, this);
        _this.visible = true
      },
      pass(obj) {
        this.$msgBox('确认通过？').then(() => {
          agreeTransferApi({id: obj.id}).then(result => {
            if (result.status !== 200) return
            this.getData()
          })
        })
      },
      reject(obj) {
        this.$msgBox('确认拒绝？').then(() => {
          disAgreeTransferApi({id: obj.id}).then(result => {
            if (result.status !== 200) return
            this.getData()
          })
        })
      },
      delData(obj) {
        this.$msgBox('确认删除？').then(() => {
          delTransferApi({id: obj.id}).then(result => {
            if (result.status !== 200) return
            this.getData()
          })
        })
      }
    }
  }
</script>
