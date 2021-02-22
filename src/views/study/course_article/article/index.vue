<template>
  <div>
    <card v-show="isShow" ref="Card">
      <div slot="header">
        <go-back :content="name" @back="goBack"/>
        <el-input v-model="searchName" placeholder="输入名称搜索" clearable class="w-200" @keyup.enter.native="getData"/>
        <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
        <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      </div>
      <el-table :data="formData">
        <el-table-column prop="title" label="文章名称"/>
        <el-table-column prop="sort" label="文章排序"/>
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
    </card>
    <detail v-show="!isShow" ref="Detail" :article-manage-id="id" @update="getData"/>
  </div>
</template>

<script>
  import {pageStudyArticleApi, delStudyArticleApi, getStudyArticleApi} from '@/api/study/article';
  import {objectEvaluate} from "@/utils/common";
  import Detail from './detail';

  export default {
    name: "Article",
    components: {Detail},
    data() {
      return {
        isShow: true,
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
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          name: this.searchName,
          articleManageId: this.id
        };
        this.$refs.Card.start();
        pageStudyArticleApi(param).then(result => {
          let response = result.resultParam.studyArticlePage;
          this.formData = response.records;
          pagination.total = response.total;
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      add() {
        this.isShow = false;
        let _this = this.$refs.Detail;
        _this.title = '新增';
      },
      edit(obj) {
        this.$startLoading()
        getStudyArticleApi({id: obj.id}).then(result => {
          this.$stopLoading()
          let response = result.resultParam.studyArticle
          let _this = this.$refs.Detail;
          _this.title = '编辑';
          _this.id = response.id;
          objectEvaluate(_this.form, response);
          this.isShow = false;
        }).catch(() => {
          this.$stopLoading()
        })
      },
      delData(id) {
        delStudyArticleApi({id: id})
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
          name: 'course_article_list'
        })
      }
    }
  }
</script>
