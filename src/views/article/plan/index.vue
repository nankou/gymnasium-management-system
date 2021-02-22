<template>
  <div>
    <card ref="Card" v-show="isShow">
      <div slot="header">
        <el-input placeholder="搜索" v-model="searchTitle" class="w-200" clearable @keyup.enter.native="getData"/>
        <el-button type="success" class="ml-5" @click="getData">搜索</el-button>
        <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      </div>
      <el-table :data="formData">
        <el-table-column prop="title" show-overflow-tooltip label="标题"/>
        <el-table-column prop="isPrivate" label="属性">
          <template slot-scope="scope">
            <span v-if="scope.row.isPrivate===false">公开</span>
            <span v-if="scope.row.isPrivate===true">私密</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布日期">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deadlineTime" label="截止日期">
          <template slot-scope="scope">
            <span>{{ scope.row.deadlineTime | formatDateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="250">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isPrivate" type="success" icon="el-icon-position" @click.stop="viewRange(scope.row)"/>
            <el-button style="opacity: 0" v-else icon="el-icon-position"/>
            <el-button icon="el-icon-search" @click.stop="viewCondition(scope.row)"></el-button>
            <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)"></el-button>
            <delete-button :ref="scope.row.id" :id="scope.row.id" @start="deleteData"/>
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="Pagination" @update="getData"></pagination>
    </card>
    <detail v-show="!isShow" ref="Detail" @update="getData"/>
    <condition ref="Condition" :work-plan-id="id"/>
    <range ref="Range" :work-plan-id="id"/>
  </div>
</template>

<script>
  import {pageWorkPlanApi, getWorkPlanApi, delWorkPlanApi} from '@/api/plan'
  import {formatDateTime, objectEvaluate} from "@/utils/common";
  import Detail from './detail';
  import Condition from './condition';
  import Range from './range';

  export default {
    name: 'Plan',
    components: {Detail, Condition, Range},
    data() {
      return {
        searchTitle: '',
        formData: [],
        isShow: true,
        id: null
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          title: this.searchTitle
        };
        this.$refs.Card.start();
        pageWorkPlanApi(param).then(result => {
          this.$refs.Card.stop();
          let response = result.resultParam.workPlanPage;
          this.formData = response.records;
          pagination.total = response.total;
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      viewRange(obj) {
        this.id = obj.id
        this.$refs.Range.visible = true;
      },
      viewCondition(obj) {
        this.id = obj.id
        this.$refs.Condition.visible = true;
      },
      add() {
        this.isShow = false;
        let _this = this.$refs.Detail;
        _this.title = '新增';
      },
      edit(obj) {
        this.$startLoading()
        getWorkPlanApi({id: obj.id}).then(result => {
          this.$stopLoading()
          let response = result.resultParam.workPlan
          response.deadlineTime = formatDateTime(response.deadlineTime)
          let _this = this.$refs.Detail;
          _this.title = '编辑';
          _this.id = response.id;
          objectEvaluate(_this.form, response);
          this.isShow = false;
        }).catch(() => {
          this.$stopLoading()
        })
      },
      deleteData(id) {
        delWorkPlanApi({id: id})
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
