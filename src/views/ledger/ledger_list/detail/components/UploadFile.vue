<template>
  <el-dialog
      title="上传文件"
      width="600px"
      @close="clearFiles"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-upload
        ref="FileUploader"
        action="action"
        class="mb-20"
        :drag="true"
        :limit="limit"
        :show-file-list="false"
        :multiple="true"
        :on-success="uploadSuccess"
        :on-exceed="handExceed"
        :http-request="uploadFile">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传不超过{{size}}MB的文件，且至多{{limit}}个</div>
    </el-upload>
    <el-table :data="formData">
      <el-table-column prop="name" label="文件名称"/>
      <el-table-column prop="userName" label="上传者"/>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-download" @click.stop="download(scope.row)"/>
          <el-button type="danger" @click.stop="delData(scope.row)" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit" text='保 存'/>
    </div>
  </el-dialog>
</template>

<script>
  import {uploadFileApi} from "@/api/data";
  import {deepClone} from "@/utils/common";
  import {editLedgerRowApi} from "@/api/ledger";
  import {documentLimit} from '@/settings';

  export default {
    name: "UploadFile",
    props: {
      size: { // 大小限制(MB)
        type: Number,
        default: documentLimit
      },
      limit: { // 数量限制
        type: Number,
        default: 20
      }
    },
    data() {
      return {
        visible: false,
        formData: [],
        copyFormDate: '',
        colIndex: null,
        row: null
      };
    },
    computed: {
      id() {
        return this.$route.query.id
      }
    },
    methods: {
      /**
       * @author 王业鹏
       * @param {Object} row
       * @return {string} data
       * @description 修改行参数转换
       * */
      getJsonRows(row) {
        let data = []
        row.content.forEach(obj => {
          if (obj.type === 0) {
            delete obj.originalValue
          }
          if ([4, 5, 6].includes(obj.type)) {
            delete obj.originalScoreCeiling
          }
        })
        data.push({
          id: row.id,
          content: row.content,
          ledgerId: parseInt(this.id),
          sort: row.sort
        })
        data = JSON.stringify(data)
        return data
      },

      /**
       * @author 王业鹏
       * @param {Object} row
       * @param {string} value
       * @description 重复操作
       * */
      toDo(row, value) {
        row.content[this.colIndex].value = value
        if (this.formData.length > 0) { // 有文件
          row.content.forEach(item => {
            if (item.type === 3) item.value = '1'
          })
        } else { // 无文件
          row.content.forEach(item => {
            if (item.type === 3) item.value = '0'
          })
        }
      },

      submit() {
        let value = JSON.stringify(this.formData)
        if (this.copyFormDate === value) {
          this.$warnMsg('无文件更新！')
          return;
        }

        let cloneData = deepClone(this.row)
        this.toDo(cloneData, value)
        cloneData = this.getJsonRows(cloneData)
        let param = {
          jsonLedgerRowList: cloneData,
          isChangeMyScore: false,
          isChangeOtherScore: false,
          isChangeLeaderScore: false
        }
        this.$refs.Submit.start();
        editLedgerRowApi(param).then(result => {
          this.$refs.Submit.stop();
          if (result.status !== 200) return
          this.toDo(this.row, value)
          this.$emit('update');
          this.visible = false
        }).catch(() => {
          this.$refs.Submit.stop();
        });
      },

      // 自定义上传
      uploadFile(param) {
        const {file} = param;
        const size = file.size / 1024 / 1024;
        if (size > this.size) {
          this.$errorMsg(`上传文件大小不能超过 ${this.size}MB!`);
          param.onError();
          return;
        }
        let data = {};
        data.file = file;
        uploadFileApi(data)
          .then(result => {
            if (result.status !== 200) {
              param.onError();
              return
            }
            param.onSuccess(result.resultParam.uploadFilePath, file);
          })
          .catch(() => {
            param.onError();
          });
      },
      uploadSuccess(path, file) {
        this.formData.push({
          userId: this.$storeGet.user.id,
          userName: this.$storeGet.user.nickName,
          name: file.name,
          path: path
        })
      },
      download(obj) {
        this.$fileSaver.saveAs(this.$baseApi + obj.path, obj.name)
      },
      delData(obj) {
        this.formData.some((item, index) => {
          if (item.path === obj.path) {
            this.formData.splice(index, 1)
            return true
          }
        })
      },
      handExceed() {
        this.$errorMsg(`至多上传${this.limit}个文件`)
      },
      // 清理文件
      clearFiles() {
        this.$refs.FileUploader.clearFiles();
      }
    }
  };
</script>
