<template>
  <el-select
      v-model="val"
      placeholder="输入姓名搜索"
      clearable
      filterable
      remote
      :remote-method="remoteMethod"
      :loading="searchLoading"
      @change="change">
    <el-option
        v-for="item in selectOptions"
        :key="item.id"
        :label="item.nickName"
        :value="item.nickName"
    >
    </el-option>
  </el-select>
</template>

<script>
  import {pageUserApi} from '@/api/system/user'

  export default {
    name: "UserSearchSelect",
    props: {
      value: {
        type: [String, Number]
      }
    },
    data() {
      return {
        val: null,
        searchLoading: false,
        selectOptions: []
      }
    },
    watch: {
      value(val, old) {
        if (val && !old) { // 第一次输入执行
          this.val = val
        }
        if (!val && this.val) { // 只有外边重置才执行
          this.selectOptions = [];
          this.val = null
        }
      }
    },
    methods: {
      change(val) {
        let selectItem = null;
        if (val) {
          this.selectOptions.some(item => {
            if (item.nickName === val) {
              selectItem = item;
              return true
            }
          })
        }
        this.$emit('input', val);
        this.$emit('get', selectItem);
      },
      remoteMethod(query) {
        if (query) {
          this.searchLoading = true;
          let param = {
            current: 1,
            size: 99,
            nickName: query
          };
          pageUserApi(param)
            .then(result => {
              this.searchLoading = false;
              this.selectOptions = result.resultParam.userList.records
            })
            .catch(() => {
              this.searchLoading = false;
            })
        } else {
          this.selectOptions = [];
        }
      }
    }
  }
</script>
