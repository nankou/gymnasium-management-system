<template>
  <el-dialog
      :title="`${title}评分 (最高${maxScore}分)`"
      width="400px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="分数" prop="score">
        <el-input-number
            v-model="form.score"
            controls-position="right"
            :precision="0"
            :min="0"
            :max="maxScore"
            @keyup.enter.native="submit"/>
      </el-form-item>
      <el-form-item v-if="type===6" label="评语" prop="remark">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {editLedgerRowApi} from '@/api/ledger';
  import {deepClone, resetForm} from "@/utils/common";

  export default {
    name: "ChangeScore",
    data() {
      return {
        visible: false,
        maxScore: 0,
        type: null,
        form: {
          score: 0,
          remark: ''
        },
        rules: {
          score: {required: true, message: '请输入分数', trigger: 'change'},
          remark: {required: true, message: '请输入评语', trigger: 'blur'}
        }
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      title() {
        if (this.type === 4) return '自评'
        if (this.type === 5) return '互评'
        if (this.type === 6) return '专家'
        return ''
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
        row.content[this.colIndex].value = value.toString()
        row.content[this.colIndex].name = this.$storeGet.user.nickName
      },

      submit: async function () {
        let isPass
        await this.validate().then(valid => {
          isPass = valid
        })
        if (!isPass) return

        let value = this.form.score
        let cloneData = deepClone(this.row)
        this.toDo(cloneData, value)
        cloneData = this.getJsonRows(cloneData)
        let param = {
          jsonLedgerRowList: cloneData,
          isChangeMyScore: this.type === 4,
          isChangeOtherScore: this.type === 5,
          isChangeLeaderScore: this.type === 6,
          remark: this.form.remark
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

      validate() {
        return new Promise(resolve => {
          this.$refs['Form'].validate(valid => {
            resolve(valid)
          });
        })
      },

      cancel() {
        resetForm(this)
      }
    }
  }
</script>
