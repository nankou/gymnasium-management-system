<template>
  <card ref="Card">
    <div slot="header">
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <el-table :data="formData">
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
    <add ref="Add" @update="getData" :type="type" :dept="dept"></add>
    <edit ref="Edit" @update="getData" :type="type" :dept="dept"></edit>
  </card>
</template>

<script>
  import {pageLeaderApi, getLeaderApi, delLeaderApi} from '@/api/leader';
  import {formatDateTime, objectEvaluate} from "@/utils/common";
  import Add from './add';
  import Edit from './edit';

  export default {
    name: "Page2",
    components: {Add, Edit},
    props: {
      dept: {type: Array}
    },
    data() {
      return {
        type: 2, // 台账0 党校培训课室审核1 入党申请书使用审核2
        formData: []
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
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
          objectEvaluate(_this.form, obj, this);
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
