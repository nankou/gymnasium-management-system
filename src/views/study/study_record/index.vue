<template>
  <div>
    <card ref="Card">
      <div slot="header">
        <el-date-picker
            v-model="searchYear"
            type="year"
            :clearable="false"
            format="yyyy"
            @change="getData"
            value-format="yyyy"
            placeholder="选择年份">
        </el-date-picker>
        <el-button type="success" class="ml-5" @click="getData">搜索</el-button>
      </div>
      <el-table :data="formData">
        <el-table-column prop="nickName" label="姓名"></el-table-column>
        <el-table-column prop="username" label="工号/学号"></el-table-column>
        <el-table-column prop="required" label="必修课进度">
          <template slot-scope="scope">
            <el-progress :percentage="$getProgress(scope.row.required)"/>
          </template>
        </el-table-column>
        <el-table-column prop="elective" label="选修课进度">
          <template slot-scope="scope">
            <el-progress :percentage="$getProgress(scope.row.elective)"/>
          </template>
        </el-table-column>
        <el-table-column label="课程学习情况">
          <template slot-scope="scope">
            <el-button icon="el-icon-search" @click.stop="viewCondition(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="150">
          <template slot-scope="scope">
            <el-button icon="el-icon-search" @click.stop="viewDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination ref="Pagination" @update="getData"></pagination>
    </card>
    <condition ref="Condition" :id='id'/>
    <detail ref="Detail" :id="id" :year="searchYear"/>
  </div>
</template>

<script>
  import {pageLearnResultApi} from '@/api/study/video'
  import {getCurrentYear} from "@/utils/common";
  import Condition from './condition';
  import Detail from './detail';

  export default {
    name: 'StudyRecord',
    components: {Detail, Condition},
    data() {
      return {
        id: null,
        searchYear: '',
        formData: []
      }
    },
    mounted() {
      this.searchYear = getCurrentYear()
      this.getData();
    },
    methods: {
      viewCondition(obj) {
        this.id = obj.id
        this.$refs.Condition.visible = true
      },
      viewDetail(obj) {
        this.id = obj.id
        this.$refs.Detail.visible = true
      },
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          year: this.searchYear
        };
        this.$refs.Card.start();
        pageLearnResultApi(param).then(result => {
          this.$refs.Card.stop();
          let response = result.resultParam.userLearnResultDtoPage;
          this.formData = response.records;
          pagination.total = response.total;
        }).catch(() => {
          this.$refs.Card.stop();
        })
      }
    }
  }
</script>
