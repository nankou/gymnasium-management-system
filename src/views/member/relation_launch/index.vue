<template>
  <card ref="Card">
    <div slot="header">
      <span>组织关系转接发起</span>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">发起</el-button>
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
      <el-table-column prop="createTime" label="发起时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state===0" type="danger">未通过</el-tag>
          <el-tag v-if="scope.row.state===1" type="warning">审核中</el-tag>
          <el-tag v-if="scope.row.state===2" type="success">已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200">
        <template slot-scope="scope">
          <el-button @click.stop="detail(scope.row)">查看</el-button>
          <el-button :disabled="scope.row.state!==2 || noReceipt(scope.row)" @click.stop="receipt(scope.row)">回执</el-button>
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)"></el-button>
        </template>
      </el-table-column>
    </expand-table>
    <add ref="Add" @update="getData" :dept="dept"></add>
    <edit ref="Edit" @update="getData" :dept="dept"></edit>
    <detail ref="Detail"></detail>
    <receipt ref="Receipt"></receipt>
    <pagination ref="Pagination" @update="getData"/>
  </card>
</template>

<script>
  import {getCurrentTransferApi} from '@/api/member'
  import {treeDeptApi} from "@/api/system/dept";
  import {objectEvaluate} from "@/utils/common";
  import Add from "./add";
  import Edit from "./edit";
  import Detail from "../components/Detail";
  import Receipt from "../components/Receipt";

  export default {
    name: 'RelationLaunch',
    components: {Add, Edit, Detail, Receipt},
    data() {
      return {
        formData: [], // 状态 0 不通过 1 审核中 2 通过
        dept: []
      }
    },
    mounted() {
      this.getData();
      this.getDept()
    },
    methods: {
      noReceipt(obj) {
        return (
          obj.outDeptId === -1
          || obj.outDeptId === 0
          || obj.intoDeptId === -1
          || obj.intoDeptId === 0
        )
      },
      getDept() {
        treeDeptApi({deptName: ''}).then(result => {
          this.dept = result.resultParam.deptTree;
        })
      },
      getData() {
        this.$refs.Card.start();
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size
        };
        getCurrentTransferApi(param).then(result => {
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
      receipt(obj) {
        let _this = this.$refs.Receipt;
        objectEvaluate(_this.form, obj, this);
        _this.visible = true
      },
      add() {
        this.$refs.Add.visible = true
      },
      edit(obj) {
        let _this = this.$refs.Edit;
        objectEvaluate(_this.form, obj, this);
        _this.visible = true
      }
    }
  }
</script>
