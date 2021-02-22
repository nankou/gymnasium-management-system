<template>
  <card ref="Card">
    <div slot="header">
      <el-input v-model="searchName" placeholder="输入名称搜索" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-date-picker
          v-model="searchYear"
          class="ml-5"
          type="year"
          format="yyyy"
          value-format="yyyy"
          placeholder="选择年份搜索">
      </el-date-picker>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column prop="name" label="课程名称"/>
      <el-table-column prop="cover" label="课程封面">
        <template slot-scope="scope">
          <el-image
              fit="contain"
              style="height: 100px"
              :src="$baseApi + scope.row.cover"
              :preview-src-list="[$baseApi + scope.row.cover]">
            <div slot="error">
              <img src="../../../../assets/notFound.png" alt="" style="height: 100px"/>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="year" label="年份"/>
      <el-table-column prop="deadline" label="截止日期">
        <template slot-scope="scope">
          <span>{{scope.row.deadline | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="videoSort" label="分类">
        <template slot-scope="scope">
          <span>{{scope.row.videoSort | formatObj}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="learnTime" label="学分"/>
      <el-table-column prop="nature" label="性质">
        <template slot-scope="scope">
          <span v-if="scope.row.nature === 0">选修</span>
          <span v-if="scope.row.nature === 1">必修</span>
        </template>
      </el-table-column>
      <el-table-column label="范围部门" prop="dept" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.depts | formatArray}}
        </template>
      </el-table-column>
      <el-table-column label="成员学习进度" align="center" width="120">
        <template slot-scope="scope">
          <el-button icon="el-icon-search" @click.stop="viewProgress(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="视频设置" align="center" width="100">
        <template slot-scope="scope">
          <el-button icon="el-icon-setting" @click.stop="setVideo(scope.row)"/>
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
  import {pageVideoManageApi, delVideoManageApi} from '@/api/study/video';
  import {listVideoSortApi} from '@/api/study/type';
  import {treeDeptApi} from '@/api/system/dept';
  import {delNullKey, formatDateTime, objectEvaluate} from "@/utils/common";
  import Add from './add';
  import Edit from './edit';

  export default {
    name: "List",
    components: {Add, Edit},
    data() {
      return {
        formData: [],
        type: [],
        dept: [],
        searchName: '',
        searchYear: ''
      }
    },
    mounted() {
      this.getData()
      this.getType()
      this.getDept()
    },
    methods: {
      getType() {
        listVideoSortApi().then(result => {
          this.type = result.resultParam.videoSortList;
        })
      },
      getDept() {
        treeDeptApi({deptName: ''}).then(result => {
          this.dept = result.resultParam.deptTree;
        })
      },
      viewProgress(obj) {
        this.$router.push({
          name: 'course_video_progress',
          query: {
            id: obj.id,
            name: obj.name
          }
        })
      },
      setVideo(obj) {
        this.$router.push({
          name: 'course_video_video',
          query: {
            id: obj.id,
            name: obj.name
          }
        })
      },
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          name: this.searchName,
          year: this.searchYear
        };
        delNullKey(param)
        this.$refs.Card.start();
        pageVideoManageApi(param).then(result => {
          let response = result.resultParam.videoManageDtoPage;
          this.formData = response.records;
          pagination.total = response.total;
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
        obj.ids = obj.depts.map(item => item.id)
        obj.deadline = formatDateTime(obj.deadline)
        objectEvaluate(_this.form, obj, this);
        _this.visible = true
      },
      delData(id) {
        delVideoManageApi({id: id})
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
