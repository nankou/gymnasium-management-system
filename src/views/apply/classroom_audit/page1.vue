<template>
  <card ref="Card">
    <div slot="header">
      <date-time-picker :start.sync="beginTime" :end.sync="endTime"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
    </div>
    <expand-table :data="formData">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="expand-table-content">
            <span>申请原因:</span>
            <pre>{{props.row.reason}}</pre>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="使用时间">
        <template slot-scope="scope">
          <span>{{scope.row.time | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="numberCount" label="参加人数"/>
      <el-table-column prop="leader" label="参加领导"/>
      <el-table-column prop="applyUser" label="申请人"/>
      <el-table-column prop="phone" label="联系方式"/>
      <el-table-column prop="passState" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.passState===0" type="danger">未通过</el-tag>
          <el-tag v-if="scope.row.passState===1" type="warning">审核中</el-tag>
          <el-tag v-if="scope.row.passState===2" type="success">已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="success" @click.stop="pass(scope.row)">通过</el-button>
          <el-button type="danger" @click.stop="reject(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>
    </expand-table>
    <pagination ref="Pagination" @update="getData"/>
  </card>
</template>

<script>
  import {pageAuditApi, passClassRoomApplyApi, noPassClassRoomApplyApi} from '@/api/apply'
  import {delNullKey} from "@/utils/common";

  export default {
    name: 'Page1',
    data() {
      return {
        formData: [], // 状态 0 不通过 1 审核中 2 通过
        beginTime: '',
        endTime: ''
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
          beginTime: this.beginTime,
          endTime: this.endTime
        };
        delNullKey(param)
        pageAuditApi(param).then(result => {
          let response = result.resultParam.resultList;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.Card.stop();
        })
      },
      pass(obj) {
        this.$msgBox('确认通过？').then(() => {
          passClassRoomApplyApi({id: obj.id}).then(() => {
            this.getData()
          })
        })
      },
      reject(obj) {
        this.$msgBox('确认拒绝？').then(() => {
          noPassClassRoomApplyApi({id: obj.id}).then(() => {
            this.getData()
          })
        })
      }
    }
  }
</script>
