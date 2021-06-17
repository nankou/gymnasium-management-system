<template>
  <card ref="Card">
    <div slot="header">
      <el-input placeholder="输入部门名称搜索" v-model="searchName" clearable class="w-200" @keyup.enter.native="searchData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="searchData">搜索</el-button>
      <el-button type="warning" class="el-icon-folder-opened ml-5" @click="changeExpand" v-show="!isExpand">展开</el-button>
      <el-button type="warning" class="el-icon-folder ml-5" @click="changeExpand" v-show="isExpand">合拢</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add()" v-permission="'addDept'">新增</el-button>
    </div>
    <el-table
        v-if="flag"
        row-key="id"
        :data="formData"
        :default-expand-all="isExpand"
        :tree-props="{children: 'children'}">
      <el-table-column prop="name" label="部门名称">
        <template slot-scope="scope">
          <span @dblclick="add(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序">
        <template slot-scope="scope">
          <span @dblclick="edit(scope.row)">{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.enabled">启用</el-tag>
          <el-tag type="warning" v-else>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="210">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-plus" @click.stop="add(scope.row)" v-permission="'addDept'"></el-button>
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" v-permission="'editDept'"></el-button>
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delDept'"/>
        </template>
      </el-table-column>
    </el-table>
    <add ref="Add" :dept="dept" @update="getData"/>
    <edit ref="Edit" :dept="dept" @update="getData"/>
  </card>
</template>

<script>
  import {getDeptTreeApi, deleteDeptApi} from '@/api/system/dept'
  import {hasPermission, objectEvaluate} from "@/utils/common";
  import Add from './add'
  import Edit from './edit'

  export default {
    name: "Dept",
    components: {Add, Edit},
    data() {
      return {
        flag: true,
        isExpand: false,
        searchName: '',
        formData: [],
        dept: []
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      changeExpand() {
        this.isExpand = !this.isExpand
        this.flag = false
        this.$nextTick(() => {
          this.flag = true
        })
      },
      getData() {
        this.$refs.Card.start();
        getDeptTreeApi({deptName: ''}).then(result => {
          this.formData = result.resultParam.deptTree;
          this.dept = result.resultParam.deptTree;
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      searchData() {
        this.$refs.Card.start();
        getDeptTreeApi({deptName: this.searchName}).then(result => {
          this.$refs.Card.stop();
          this.formData = result.resultParam.deptTree;
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      add(obj) {
        if (!hasPermission('addDept')) return
        let _this = this.$refs.Add;
        if (obj) objectEvaluate(_this.form, {pid: obj.id}, this);
        _this.visible = true;
      },
      edit(obj) {
        if (!hasPermission('editDept')) return
        let _this = this.$refs.Edit;
        if (obj.pid === 0) obj.pid = null;
        objectEvaluate(_this.form, obj);
        _this.visible = true;
      },
      delData(id) {
        deleteDeptApi({deptId: id})
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
