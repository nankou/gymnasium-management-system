<template>
  <el-dialog
      title="导出测评结果"
      width="600px"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" label-width="100px" ref="Form">
      <el-form-item label="部门" prop="dept">
        <tree-select
            v-model="form.dept"
            :tree="dept"
            placeholder="请选择"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" text="导 出" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {exportResultApi} from '@/api/evaluation';
  import {treeDeptApi} from '@/api/system/dept';
  import {delNullKey, resetForm} from "@/utils/common";

  export default {
    name: 'ExportResult',
    data() {
      return {
        visible: false,
        id: null,
        dept: [],
        form: {
          dept: ''
        }
      }
    },
    mounted() {
      this.treeDept()
    },
    methods: {
      treeDept() {
        treeDeptApi({deptName: ''}).then(result => {
          this.dept = result.resultParam.deptTree;
        })
      },
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let param = {...this.form}
          param.evaluateId = this.id
          delNullKey(param)
          this.$refs.Submit.start()
          exportResultApi(param)
            .then(result => {
              this.$refs.Submit.stop()
              const blob = new Blob([result]);
              let dept = ''
              if (param.dept) dept = param.dept
              this.$fileSaver.saveAs(blob, `${dept}测评结果.xlsx`);
              this.cancel();
            })
            .catch(err => {
              this.$refs.Submit.stop()
              err.response.data.text().then(res => {
                this.$errorMsg(JSON.parse(res).message)
              })
            })
        });
      },
      cancel() {
        this.visible = false
        resetForm(this, 'form')
      }
    }
  }
</script>
