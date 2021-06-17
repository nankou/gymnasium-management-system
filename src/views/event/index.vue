<template>
  <card ref="Card">
    <div slot="header">
      <span>赛事管理</span>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">创建赛事</el-button>
    </div>
    <expand-table :data="formData">
<!--      <el-table-column type="expand">-->
<!--        <template slot-scope="props">-->
<!--          <div class="expand-table-content">-->
<!--            <span>申请原因:</span>-->
<!--            <pre>{{props.row.reason}}</pre>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="name" label="赛事名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="场地类型"/>
      <el-table-column prop="purpose" label="比赛目的"/>
      <el-table-column prop="sponsor" label="主办方"/>
      <el-table-column prop="fieldStatus" label="场地审批状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.fieldOrder===0" type="danger">未通过</el-tag>
          <el-tag v-if="scope.row.fieldOrder===1" type="warning">审核中</el-tag>
          <el-tag v-if="scope.row.fieldOrder===2" type="success">已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="equipStatus" label="器材审批状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.equipOrder===0" type="danger">未通过</el-tag>
          <el-tag v-if="scope.row.equipOrder===1" type="warning">审核中</el-tag>
          <el-tag v-if="scope.row.equipOrder===2" type="success">已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" ></el-button>
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delRole'"/>
        </template>
      </el-table-column>
    </expand-table>
    <add ref="Add" @update="getData"></add>
    <pagination ref="Pagination" @update="getData"/>
    <edit ref="Edit" @update="getData"/>
  </card>
</template>

<script>
import Add from './add'
import Edit from './edit'
import {delEventApi, getEventApi, pageEventApi} from "../../api/event";
import {objectEvaluate} from "@/utils/common";

export default {
  name: 'event',
  components: {Add,Edit},
  data() {
    return {
      formData: [] // 状态 0 不通过 1 审核中 2 通过
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
        size: pagination.size
      };
      pageEventApi(param).then(result => {
        let response = result.resultParam.eventPage;
        this.formData = response.records;
        pagination.total = response.total;
        this.$refs.Card.stop();
      })
    },
    add() {
      this.$refs.Add.visible = true
    },
    // 编辑
    edit(obj) {
      this.$refs.Card.start();
      this.$refs.Edit.visible = true
      getEventApi({id: obj.id}).then(result => {
        let response = result.resultParam.eventPage.event;
        objectEvaluate(_this.form, response, this);
        let _this = this.$refs.Edit;
        _this.visible = true;
        console.log(_this)
        this.$refs.Card.stop();
      //   response.deptIds = response.depts.map(item => {
      //     if (item) return item.id;
      //   });
      }).catch(() => {
        this.$refs.Card.stop();
      })
    },
    // 删除
    delData(id) {
      delEventApi({ids: id})
          .then(() => {
            this.getData();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
    },

  }
}
</script>

<style>
.event {
  padding: 10px 20px;
}
</style>

