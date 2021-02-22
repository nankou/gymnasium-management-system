<template>
  <card ref="Card">
    <div slot="header">
      <el-input v-model="searchTitle" placeholder="输入标题搜索" clearable class="w-200" @keyup.enter.native="getData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
      <el-radio-group v-model="evaluateState" @change="editEvaluateState" class="float-right">
        <el-radio-button :label="true">开启测评</el-radio-button>
        <el-radio-button :label="false">关闭测评</el-radio-button>
      </el-radio-group>
    </div>
    <el-button class="float-right ml-5" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    <el-button class="float-right" type="warning" icon="el-icon-upload2" @click="uploadExcel">Excel 导入</el-button>
    <el-button class="float-right" type="success" icon="el-icon-download" @click="downloadExcel">Excel 模板下载</el-button>
    <el-table :data="formData">
      <el-table-column prop="title" label="标题"/>
      <el-table-column prop="brief" label="简介"/>
      <el-table-column prop="createTime" label="截止日期">
        <template slot-scope="scope">
          <span>{{scope.row.deadline | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="题目" align="center" width="80">
        <template slot-scope="scope">
          <el-button icon="el-icon-search" @click.stop="viewTopic(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="测评情况" align="center" width="80">
        <template slot-scope="scope">
          <el-button icon="el-icon-search" @click.stop="viewCondition(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="测评结果" align="center" width="150">
        <template slot-scope="scope">
          <el-button icon="el-icon-search" @click.stop="viewResult(scope.row)"/>
          <el-button icon="el-icon-download" @click.stop="exportResult(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-position" @click.stop="viewRange(scope.row)"/>
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)"/>
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData"/>
        </template>
      </el-table-column>
    </el-table>
    <pagination ref="Pagination" @update="getData"/>
    <add ref="Add" @update="getData"></add>
    <edit ref="Edit" @update="getData"></edit>
    <range ref="Range"></range>
    <export-result ref="ExportResult"/>
  </card>
</template>

<script>
  import {pageEvaluateApi, delEvaluateApi, getEvaluateStateApi, editEvaluateStateApi, importExcelApi} from '@/api/evaluation';
  import {objectEvaluate, getFile} from "@/utils/common";
  import {documentLimit} from "@/settings";
  import Range from './components/Range';
  import ExportResult from './components/ExportResult';
  import Add from './add';
  import Edit from './edit';

  export default {
    name: "Project",
    components: {Add, Edit, Range, ExportResult},
    data() {
      return {
        formData: [],
        searchTitle: '',
        evaluateState: null
      }
    },
    mounted() {
      this.getData()
      this.getEvaluateState()
    },
    methods: {
      // 获取状态
      getEvaluateState() {
        getEvaluateStateApi().then(result => {
          this.evaluateState = result.resultParam.value
        })
      },
      // 更改状态
      editEvaluateState() {
        editEvaluateStateApi().then(result => {
          if (result.status === 200) return
          this.evaluateState = !this.evaluateState
        }).catch(() => {
          this.evaluateState = !this.evaluateState
        })
      },
      // excel 模板下载
      downloadExcel() {
        this.$fileSaver.saveAs('/assets/file.xlsx', `测评模板.xlsx`);
      },
      // excel 导入
      uploadExcel() {
        getFile(documentLimit, '.xls,.xlsx').then(raw => {
          let data = {};
          data.multipartFile = raw;
          this.$startLoading()
          importExcelApi(data)
            .then(result => {
              this.$stopLoading()
              if (result.status !== 200) return
              this.getData()
            })
            .catch(() => {
              this.$stopLoading()
            })
        }).catch(error => {
          this.$errorMsg(error)
        })
      },
      // excel 导出
      exportResult(obj) {
        let _this = this.$refs.ExportResult
        _this.id = obj.id
        _this.visible = true
      },
      // 题目
      viewTopic(obj) {
        this.$router.push({
          name: 'evaluation_topic',
          query: {
            id: obj.id,
            title: obj.title
          }
        })
      },
      // 测评情况
      viewCondition(obj) {
        this.$router.push({
          name: 'evaluation_condition',
          query: {
            id: obj.id,
            title: obj.title
          }
        })
      },
      // 测评结果
      viewResult(obj) {
        this.$router.push({
          name: 'evaluation_result',
          query: {id: obj.id}
        })
      },
      // 发送范围
      viewRange(obj) {
        let _this = this.$refs.Range
        _this.id = obj.id
        _this.visible = true
      },
      getData() {
        let pagination = this.$refs.Pagination;
        let param = {
          current: pagination.current,
          size: pagination.size,
          title: this.searchTitle
        };
        this.$refs.Card.start();
        pageEvaluateApi(param).then(result => {
          let response = result.resultParam.evaluatePage;
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
        objectEvaluate(_this.form, obj, this);
        _this.visible = true
      },
      delData(id) {
        delEvaluateApi({id: id})
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
