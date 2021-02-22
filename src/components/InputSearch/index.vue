<template>
  <el-autocomplete
      v-model="val"
      placeholder="搜索"
      clearable
      :fetch-suggestions="querySearchAsync"
      @select="select"
  >
  </el-autocomplete>
</template>

<script>
  import {getJobListApi} from '@/api/system/job'

  export default {
    name: "InputSelect",
    props: {
      value: {
        type: String
      }
    },
    data() {
      return {
        val: ''
      }
    },
    watch: {
      value(val, old) {
        if (val && !old) { // 第一次输入执行
          this.val = val
        }
        if (!val && this.val) { // 只有外边清空才执行
          this.val = '';
        }
      }
    },
    methods: {
      select(val) {
        this.val = val.name;
        this.$emit('input', val.name);
        this.$emit('get', val);
        this.$parent.$emit('el.form.change');
      },
      querySearchAsync(query, cb) {
        this.$emit('input', query);
        this.$parent.$emit('el.form.change');
        if (query) {
          let data = {
            jobName: query
          };
          getJobListApi(data).then(result => {
            let list = result.resultParam.jobList.records;
            list.forEach(item => {
              item.value = item.name
            })
            cb(list)
          })
        } else {
          cb([])
        }
      }
    }
  }
</script>
