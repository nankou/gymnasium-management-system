<template>
  <card ref="Card">
    <div slot="header">
      <go-back :content="name" @back="goBack"/>
      <el-input v-model="searchName" placeholder="输入名称搜索" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column prop="name" label="视频名称"/>
      <el-table-column prop="videoTime" label="视频时长">
        <template slot-scope="scope">
          <span>{{scope.row.videoTime | formatSeconds}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="视频排序"/>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新日期">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | formatDateTime}}</span>
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
    <add ref="Add" @update="getData" :id="id"></add>
    <edit ref="Edit" @update="getData" :id="id"></edit>
  </card>
</template>

<script>
  import {pageVideoApi, delVideoApi} from '@/api/study/video';
  import {objectEvaluate} from "@/utils/common";
  import Add from './add';
  import Edit from './edit';

  export default {
    name: "Video",
    components: {Add, Edit},
    data() {
      return {
        formData: [],
        searchName: ''
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
    activated() {
      this.getData()
    },
    methods: {
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          name: this.searchName,
          videoManageId: this.id
        };
        this.$refs.Card.start();
        pageVideoApi(param).then(result => {
          let response = result.resultParam.videoPage;
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
        objectEvaluate(_this.form, obj);
        _this.visible = true
      },
      delData(id) {
        delVideoApi({id: id})
          .then(() => {
            this.getData();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      },
      goBack() {
        this.$router.push({
          name: 'course_video_list'
        })
      }
    }
  }
</script>
