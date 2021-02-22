<template>
  <el-dialog
      title="新增模型"
      width="1200px"
      @opened="opened"
      @close="cancel"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="form" :rules="rules" ref="Form" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="年份" prop="year">
        <el-date-picker
            v-model="form.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年份">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <tree-select
            v-model="form.deptId"
            :tree="dept"
            placeholder="请选择"
        />
      </el-form-item>
      <el-form-item
          v-for="(domain, index) in domains"
          :label="'表头字段' + (index + 1)"
          :key="domain.key"
      >
        <el-row :gutter="10">
          <el-col :span="7">
            <el-input v-model.trim="domain.name"></el-input>
          </el-col>
          <el-col :span="13">
            <el-radio-group v-model="domain.type">
              <el-radio-button :label="0">文字</el-radio-button>
              <el-radio-button :label="1">文件</el-radio-button>
              <el-radio-button :label="3">完成情况</el-radio-button>
              <el-radio-button :label="4">自评评分</el-radio-button>
              <el-radio-button :label="5">互评评分</el-radio-button>
              <el-radio-button :label="6">专家评分</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="3">
            <el-button icon="el-icon-plus" @click.prevent="addDomain(index)"/>
            <el-button icon="el-icon-minus" @click.prevent="removeDomain(domain)"/>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="表头字段">
        <template v-for="item in domains">
          <el-tag type="info" class="ml-5" :key="item.key" v-show="item.name">
            <span>{{item.name}}</span>
          </el-tag>
        </template>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="自评比例:" prop="myWeight">
            <el-input-number v-model="form.myWeight" :min="0" :max="100"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="互评比例:" prop="otherWeight">
            <el-input-number v-model="form.otherWeight" :min="0" :max="100"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专家比例:" prop="leaderWeight">
            <el-input-number v-model="form.leaderWeight" :min="0" :max="100"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述:" prop="description">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <submit-button ref="Submit" @submit="submit"/>
    </div>
  </el-dialog>
</template>

<script>
  import {addLedgerApi} from '@/api/ledger';
  import {getCurrentYear, resetForm} from "@/utils/common";

  export default {
    name: "Add",
    props: {
      dept: {required: true}
    },
    data() {
      return {
        visible: false,
        form: {
          name: '', // 名称
          year: '', // 年份
          deptId: null, // 部门
          title: '', // 表头  0文字 1文件 3完成情况 4自评评分 5互评评分 6专家评分
          weight: 0, // 权重
          myWeight: 0, // 自评权重
          otherWeight: 0, // 互评权重
          leaderWeight: 0, // 领导权重
          description: '' // 描述
        },
        rules: {
          name: {required: true, message: '请输入名称', trigger: 'blur'},
          year: {required: true, message: '请选择年份', trigger: 'change'},
          deptId: {required: true, message: '请选择部门', trigger: 'change'},
          myWeight: {required: true, message: '请输入比例', trigger: 'change'},
          otherWeight: {required: true, message: '请输入比例', trigger: 'change'},
          leaderWeight: {required: true, message: '请输入比例', trigger: 'change'}
        },
        domains: []
      }
    },
    methods: {
      submit() {
        let titleList = []
        let isEmpty = false
        let isRepeated = false
        this.domains.forEach(item => {
          titleList.push(item.name)
          if (item.name === '') {
            isEmpty = true
          }
        })
        for (let i = 0; i < titleList.length - 1; i++) {
          if (titleList[i] === titleList[i + 1]) {
            isRepeated = true
          }
        }
        if (isEmpty) {
          this.$warnMsg('表头字段不能为空')
          return
        }
        if (isRepeated) {
          this.$warnMsg('表头字段不能重复')
          return
        }

        let sum = this.calculateWeight();
        if (sum !== 100) {
          this.$warnMsg('比例相加需为100');
          return
        }
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          let data = {...this.form};
          let domains = [...this.domains]
          let title = domains.map(item => {
            delete item.key
            return item
          })
          data.title = JSON.stringify(title)
          this.$refs.Submit.start();
          addLedgerApi(data).then(result => {
            this.$refs.Submit.stop();
            if (result.status !== 200) return;
            this.$emit('update');
            this.visible = false;
          }).catch(() => {
            this.$refs.Submit.stop();
          })
        });
      },
      initDomain() {
        if (this.domains.length !== 0) return
        this.domains = [
          {name: '', type: 0, key: Date.now()},
          {name: '', type: 0, key: Date.now() + 1},
        ]
      },
      addDomain(index) {
        this.domains.splice(index + 1, 0, {
          value: '',
          type: 0,
          key: Date.now()
        });
      },
      removeDomain(item) {
        if (this.domains.length <= 2) {
          this.$warnMsg('至少两个表头字段')
          return
        }
        let index = this.domains.indexOf(item)
        if (index !== -1) {
          this.domains.splice(index, 1)
        }
      },
      calculateWeight() {
        let sum = 0;
        sum
          = this.form.myWeight
          + this.form.otherWeight
          + this.form.leaderWeight
        return sum
      },
      opened() {
        this.form.year = getCurrentYear()
        this.initDomain()
      },
      cancel() {
        resetForm(this)
      }
    }
  }
</script>
