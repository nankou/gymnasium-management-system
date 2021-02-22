<template>
  <card ref="Card" id="ledger-content">
    <div slot="header">
      <div class="flex-space-between">
        <go-back :content="name" @back="goBack"/>
        <div>
          <el-button icon="el-icon-download" @click="download">下载模板</el-button>
          <el-button icon="el-icon-upload2" @click="importExcel">导入数据</el-button>
        </div>
      </div>
      <div v-show="!isEdit">
        <el-button :loading="mergeLoading" @click="merge" :disabled="this.checkboxRefs.length<2">合并</el-button>
        <el-button :loading="splitLoading" @click="split" :disabled="this.checkboxRefs.length!==1">拆分</el-button>
        <el-button @click="clearSelected">清除</el-button>
        <el-button @click="getData">刷新</el-button>
        <el-button class="float-right" type='primary' @click="openEdit">开启编辑</el-button>
        <el-button :loading="addLoading" class="float-right" icon="el-icon-plus" @click.prevent="addRow(formData.length-1)"/>
      </div>
      <div v-show="isEdit">
        <el-button :loading="editLoading" class="float-right ml-5" type='success' @click="submitEdit">提交</el-button>
        <el-button class="float-right" type='danger' @click="cancelEdit">取消</el-button>
      </div>
    </div>
    <el-table :data="formData" :span-method="objectSpanMethod" border style="width: 100%">

      <template v-for="(item, index) in header">
        <el-table-column :label="item.name" :key="item.name">
          <template slot-scope="{row, $index}">

            <!--文字-->
            <div v-if="item.type===0">
              <el-checkbox v-show="!isEdit" @change="clickCheckbox($index,index)" :ref="`Checkbox-${$index}-${index}`" :label="row.id">
                <span></span>
              </el-checkbox>
              <span v-show="!isEdit">{{row.content[index].value}}</span>
              <el-form v-show="isEdit" :model="row.content[index]">
                <el-form-item>
                  <el-input v-model="row.content[index].value"/>
                </el-form-item>
              </el-form>
            </div>

            <!--文件-->
            <div v-if="item.type===1">
              <el-tag type="success" v-if="hasFile(row,index)">已上传</el-tag>
              <el-tag type="danger" v-if="!hasFile(row,index)">未上传</el-tag>
            </div>

            <!--完成情况-->
            <div v-if="item.type===3">
              <el-tag type="danger" v-if="equals(row.content[index].value,0)">未完成</el-tag>
              <el-tag type="success" v-if="equals(row.content[index].value,1)">完成</el-tag>
              <el-tag type="warning" v-if="equals(row.content[index].value,2)">完成部分</el-tag>
            </div>

            <!--自评评分 互评评分 专家评分-->
            <div v-if="[4,5,6].includes(item.type)">
              <span v-show="!isEdit">{{row.content[index].value}}</span>
              <el-tag v-show="!isEdit" type="info" class="ml-20">上限：{{row.content[index].scoreCeiling}}</el-tag>
              <el-form v-show="isEdit" :model="row.content[index]">
                <el-form-item>
                  <el-input-number v-model="row.content[index].scoreCeiling" controls-position="right" :precision="0" :min="0"/>
                </el-form-item>
              </el-form>
            </div>

          </template>
        </el-table-column>
      </template>

      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="{row, $index}">
          <el-button :disabled="isEdit" icon="el-icon-plus" @click.prevent="addRow($index)"/>
          <el-button :disabled="isEdit" icon="el-icon-minus" @click.prevent="removeRow(row)"/>
        </template>
      </el-table-column>
    </el-table>
  </card>
</template>

<script>
  import {downloadTemplateApi, importDataApi, getLedgerDetailApi} from '@/api/ledger';
  import {getFile} from "@/utils/common";
  import {documentLimit} from "@/settings";
  import MergeSplit from './js/merge_split';
  import AddRemoveRow from './js/add_remove_row';
  import EditRow from './js/edit_row';

  export default {
    name: "Content",
    mixins: [MergeSplit, AddRemoveRow, EditRow],
    data() {
      return {
        header: [],
        formData: []
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
        this.$refs.Card.start();
        getLedgerDetailApi({ledgerId: this.id}).then(result => {
          let response = result.resultParam;
          this.header = JSON.parse(response.ledgerDto.title);
          response.ledgerRowList.forEach(item => {
            item.content = JSON.parse(item.content)
          })
          this.formData = response.ledgerRowList;
          this.$refs.Card.stop();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },

      hasFile(row, index) {
        let value = row.content[index].value
        return !!(value.includes('[')
          && value.includes(']')
          && value.includes('name')
          && value.includes('path'));
      },

      equals(value1, value2) {
        return value1.toString() === value2.toString();
      },

      download() {
        this.$startLoading()
        downloadTemplateApi({ledgerId: this.id}).then(result => {
          this.$stopLoading()
          const blob = new Blob([result]);
          this.$fileSaver.saveAs(blob, this.name + '模板.xlsx');
        })
          .catch(err => {
            this.$stopLoading()
            err.response.data.text().then(res => {
              this.$errorMsg(JSON.parse(res).message)
            })
          })
      },

      importExcel() {
        getFile(documentLimit, '.xls,.xlsx').then(raw => {
          let data = {};
          data.ledgerId = this.id;
          data.file = raw;
          this.$startLoading()
          importDataApi(data)
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

      goBack() {
        this.$router.push({
          name: 'ledger_list_list'
        })
      }
    }
  }
</script>

<style lang="scss">
  #ledger-content {
    .el-tag {
      transition: none;
    }

    .flex-space-between {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
