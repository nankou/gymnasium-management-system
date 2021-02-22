<template>
  <div>
    <el-button type="success" icon="el-icon-copy-document" @click="visible = true">复制新增</el-button>
    <el-dialog
        title="复制新增"
        width="500px"
        @close="cancel"
        :close-on-click-modal="false"
        :visible.sync="visible">
      <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
        <el-form-item label="名称" prop="id">
          <el-select
              v-model="form.id"
              placeholder="输入名称搜索"
              clearable
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="searchLoading"
          >
            <el-option
                v-for="item in selectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <submit-button ref="Submit" @submit="submit"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {copyLedgerApi, listLedgerNameApi} from '@/api/ledger';
  import {resetForm} from "@/utils/common";

  export default {
    name: "Copy",
    data() {
      return {
        visible: false,
        searchLoading: false,
        selectOptions: [],
        form: {
          id: null
        },
        rules: {
          id: {required: true, message: '请选择台账', trigger: 'change'}
        }
      }
    },
    methods: {
      remoteMethod(query) {
        if (query) {
          this.searchLoading = true;
          listLedgerNameApi({name: query})
            .then(result => {
              this.searchLoading = false;
              this.selectOptions = result.resultParam.ledgerList
            })
            .catch(() => {
              this.searchLoading = false;
            })
        } else {
          this.selectOptions = [];
        }
      },
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          this.$refs.Submit.start();
          copyLedgerApi(data).then(result => {
            this.$refs.Submit.stop();
            if (result.status !== 200) return;
            this.$emit('update');
            this.visible = false;
          }).catch(() => {
            this.$refs.Submit.stop();
          })
        });
      },
      cancel() {
        resetForm(this, 'form')
      }
    }
  }
</script>
