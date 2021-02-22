<template>
  <card ref="Card">
    <div slot="header">
      <go-back :content="name" @back="goBack"/>
      <tree-select v-model="searchDept" style="float: left;width: 200px;" :tree="dept" placeholder="选择部门搜索" @get="getData"/>
      <el-input v-model="searchName" placeholder="输入名称搜索" clearable class="w-200 ml-5" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column prop="nickName" label="姓名"></el-table-column>
      <el-table-column prop="username" label="工号/学号"></el-table-column>
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
      <el-table-column prop="elective" label="课程进度">
        <template slot-scope="scope">
          <el-progress :percentage="$getProgress(scope.row.progress)"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"/>
  </card>
</template>

<script>
  import {pageUserLearnRateApi} from '@/api/study/article';
  import {treeDeptApi} from '@/api/system/dept'
  import {delNullKey} from "@/utils/common";

  export default {
    name: "Progress",
    data() {
      return {
        formData: [],
        dept: [],
        searchName: '',
        searchDept: null
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      name() {
        return this.$route.query.name
      }
    },
    mounted() {
      this.getDept()
      this.getData()
    },
    methods: {
      getDept() {
        treeDeptApi({deptName: ''}).then(result => {
          this.dept = result.resultParam.deptTree;
        })
      },
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          nickName: this.searchName,
          deptId: this.searchDept,
          articleManageId: this.id
        };
        delNullKey(param)
        this.$refs.Card.start();
        pageUserLearnRateApi(param).then(result => {
          let response = result.resultParam.userManageDtoPage;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      goBack() {
        this.$router.push({
          name: 'course_article_list'
        })
      }
    }
  }
</script>
