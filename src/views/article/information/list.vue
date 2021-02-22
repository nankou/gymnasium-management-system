<template>
  <div>
    <card ref="Card" v-show="isShow">
      <div slot="header">
        <el-input placeholder="输入标题搜索" v-model="searchTitle" class="w-200" clearable @keyup.enter.native="getData"/>
        <el-button type="success" class="ml-5" @click="getData">搜索</el-button>
        <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add" v-permission="'addArticle'">新增</el-button>
      </div>
      <el-button :disabled="deleteList.length === 0" type="danger" @click="deleteMore" v-permission="'delArticle'">批量删除</el-button>
      <selection-table :keys.sync="deleteList" :data="formData">
        <el-table-column prop="title" show-overflow-tooltip label="标题"></el-table-column>
        <el-table-column prop="sort" label="排序" width="100"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" v-permission="'editArticle'"></el-button>
            <delete-button :ref="scope.row.id" :id="scope.row.id" @start="deleteData" v-permission="'delArticle'"/>
          </template>
        </el-table-column>
      </selection-table>
      <pagination ref="Pagination" @update="getData"></pagination>
    </card>
    <detail v-show="!isShow" ref="Detail" :current="current" @update="getData"/>
  </div>
</template>

<script>
  import {pageArticleApi, getArticleApi, delArticleApi} from '@/api/article'
  import {objectEvaluate} from "@/utils/common";
  import Detail from './detail';

  export default {
    name: 'List',
    components: {Detail},
    props: {
      current: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        searchTitle: '',
        formData: [],
        deleteList: [],
        isShow: true
      }
    },
    mounted() {
      this.getData();
    },
    watch: {
      current() {
        this.getData();
      }
    },
    methods: {
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          title: this.searchTitle,
          typeId: this.current.type,
          isShow: true
        };
        this.$refs.Card.start();
        pageArticleApi(param).then(result => {
          this.$refs.Card.stop();
          let response = result.resultParam.articlePage;
          this.formData = response.records;
          pagination.total = response.total;
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
        getArticleApi({id: obj.id}).then(result => {
          this.$stopLoading()
          let response = result.resultParam.article
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
        delArticleApi({ids: id})
          .then(() => {
            this.getData();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      },
      deleteMore() {
        this.$msgBox().then(() => {
          delArticleApi({ids: this.deleteList})
            .then(() => {
              this.getData()
            })
        })
      }
    }
  }
</script>
