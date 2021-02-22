<template>
  <card ref="Card">
    <div slot="header">
      <el-input v-model="searchName" placeholder="输入名称搜索" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-button class="float-right" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      <el-button class="float-right" type="success" @click="drawLots">随机抽签</el-button>
    </div>
    <el-table :data="formData">
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="phone" label="手机号"/>
      <el-table-column prop="job" label="职务"/>
      <el-table-column prop="brief" label="简介"/>
      <el-table-column prop="photo" label="照片">
        <template slot-scope="scope">
          <el-image
              fit="contain"
              style="height: 100px"
              :src="$getImage(scope.row.photo)"
              :preview-src-list="[$getImage(scope.row.photo)]">
            <div slot="error">
              <img src="../../assets/notFound.png" alt="" style="height: 100px"/>
            </div>
          </el-image>
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
    <add ref="Add" @update="getData"></add>
    <edit ref="Edit" @update="getData"></edit>
    <lot ref="Lot"></lot>
  </card>
</template>

<script>
  import {pageExpertDataApi, delExpertDataApi} from '@/api/professor';
  import {objectEvaluate} from "@/utils/common";
  import Add from './add';
  import Edit from './edit';
  import Lot from './lot';

  export default {
    name: "Professor",
    components: {Edit, Add, Lot},
    data() {
      return {
        formData: [],
        searchName: ''
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      drawLots() {
        this.$refs.Lot.visible = true
      },
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          name: this.searchName
        };
        this.$refs.Card.start();
        pageExpertDataApi(param).then(result => {
          let response = result.resultParam.expertDataPage;
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
        delExpertDataApi({id: id})
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
