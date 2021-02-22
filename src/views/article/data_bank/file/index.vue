<template>
  <card ref="Card">
    <div slot="header">
      <go-back :content="catalogueName" @back="goBack"/>
      <el-input v-model="searchName" placeholder="输入名称搜索" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-upload" @click="add" v-permission="'addDataFile'">上传</el-button>
    </div>
    <el-button :disabled="downloadList.length === 0" icon="el-icon-download" type="success" @click="downloadMore">批量下载</el-button>
    <el-table :data="formData" @selection-change="getSelected">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="name" label="文件名称"/>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-download" @click.stop="download(scope.row)"/>
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" v-permission="'editDataFile'"/>
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delDataFile'"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"/>
    <add ref="Add" @update="getData" :pId="pId"></add>
    <edit ref="Edit" @update="getData"></edit>
  </card>
</template>

<script>
  import {pageDataFileApi, delDataFileApi} from '@/api/data';
  import {objectEvaluate} from "@/utils/common";
  import Add from './add';
  import Edit from './edit';

  export default {
    name: "File",
    components: {Add, Edit},
    data() {
      return {
        formData: [],
        downloadList: [],
        searchName: ''
      }
    },
    computed: {
      pId() {
        return this.$route.query.id
      },
      catalogueName() {
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
          pId: this.pId
        };
        this.$refs.Card.start();
        pageDataFileApi(param).then(result => {
          let response = result.resultParam.dataFilePage;
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
      getSelected(array) {
        this.downloadList = array.map(item => {
          return {
            name: item.name,
            link: item.link
          }
        })
      },
      download(obj) {
        this.$fileSaver.saveAs(this.$baseApi + obj.link, obj.name)
      },
      downloadMore() {
        this.downloadList.forEach(item => {
          this.download(item)
        })
      },
      edit(obj) {
        let _this = this.$refs.Edit;
        objectEvaluate(_this.form, obj);
        _this.visible = true
      },
      delData(id) {
        delDataFileApi({id: id})
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
          name: 'data_bank_list'
        })
      }
    }
  }
</script>
