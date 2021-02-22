<template>
  <el-dialog
      title="编辑题目"
      width="600px"
      @close="cancel"
      @opened="initDomain"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="80px">
      <el-form-item label="序号" prop="serial">
        <el-input-number
            v-model="form.serial"
            controls-position="right"
            :precision="0"
            :min="1">
        </el-input-number>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <user-search-select v-model="form.name" @get="getUser"/>
      </el-form-item>
      <el-form-item label="职务" prop="job">
        <el-input v-model="form.job" readonly></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="dept">
        <el-input v-model="form.dept" readonly></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea"></el-input>
      </el-form-item>
      <el-form-item
          v-show="type !== 3"
          v-for="(domain, index) in domains"
          :label="'选项' + $alphabet[index]"
          :key="domain.key"
      >
        <el-row :gutter="20">
          <el-col :span="15">
            <el-input v-model="domain.value"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button icon="el-icon-minus" @click.prevent="removeDomain(domain)"/>
            <el-button icon="el-icon-plus" @click.prevent="addDomain"/>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {editTopicApi} from '@/api/evaluation';
  import {resetForm} from "@/utils/common";
  import UserSearchSelect from '@/views/components/UserSearchSelect';

  export default {
    name: "Edit",
    components: {UserSearchSelect},
    props: {
      type: {
        required: true
      }
    },
    data() {
      return {
        visible: false,
        domains: [],
        form: {
          id: null,
          serial: 1, // 序号
          name: '', // 姓名
          job: '', // 职务
          dept: '', // 部门
          remark: '', // 备注
          content: '', // 题目内容
          evaluateId: null
        },
        rules: {
          serial: {required: true, message: '请输入序号', trigger: 'change'},
          name: {required: true, message: '请选择名称', trigger: 'change'}
        }
      }
    },
    methods: {
      initDomain() {
        if (this.type === 3) return
        this.domains = []
        this.form.content.split(',').forEach((item, index) => {
          this.domains.push({
            value: item,
            key: index + 1
          });
        })
        if (this.domains.length === 1) {
          this.domains.push({
            value: '',
            key: 2
          });
        }
      },
      addDomain() {
        if (this.domains.length >= 10) {
          this.$warnMsg('至多十个选项')
          return
        }
        let domain = this.domains[this.domains.length - 1]
        this.domains.push({
          value: '',
          key: domain.key + 1
        });
      },
      removeDomain(item) {
        if (this.domains.length <= 2) {
          this.$warnMsg('至少两个选项')
          return
        }
        let index = this.domains.indexOf(item)
        if (index !== -1) {
          this.domains.splice(index, 1)
        }
      },
      getUser(obj) {
        if (obj) {
          if (obj.job) {
            this.form.job = obj.job.name
          }
          if (obj.dept) {
            this.form.dept = obj.dept.name
          }
        } else {
          this.form.job = ''
          this.form.dept = ''
        }
      },
      submit() {
        let isEmpty = this.domains.some(item => {
          if (item.value.trim() === '') return true
        })
        if (isEmpty && this.type !== 3) {
          this.$warnMsg('选项内容不能为空')
          return
        }
        if (this.type !== 3) {
          this.domains.forEach(item => {
            item.value = item.value.replace(/[,]/g, '，')
          })
        }
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          if (this.type === 3) {
            data.content = ''
          } else {
            data.content = this.domains.map(item => item.value).join(',')
          }
          this.$refs.Submit.start();
          editTopicApi(data).then(result => {
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
        resetForm(this)
      }
    }
  }
</script>
