<template>
  <div :class="{'show':show}" class="header-search">
    <i class="el-icon-search" @click.stop="click"/>
    <el-select
        ref="SearchSelect"
        v-model="search"
        :remote-method="querySearch"
        filterable
        default-first-option
        remote
        placeholder="搜索菜单"
        class="header-search-select"
        @change="change"
    >
      <el-option
          v-for="item in options"
          :key="item.index + item.name"
          :value="item"
          :label="item.indexPath.join(' > ')"/>
    </el-select>
  </div>
</template>

<script>
  import Fuse from 'fuse.js'

  export default {
    name: 'SearchMenu',
    data() {
      return {
        search: '',
        options: [],
        show: false,
        fuse: undefined
      }
    },
    watch: {
      show(value) {
        if (value) {
          document.body.addEventListener('click', this.close)
        } else {
          document.body.removeEventListener('click', this.close)
        }
      }
    },
    mounted() {
      this.initFuse(this.$storeGet.searchMenu)
    },
    methods: {
      click() {
        this.show = !this.show
        if (this.show) {
          this.$refs.SearchSelect && this.$refs.SearchSelect.focus()
        }
      },
      close() {
        this.$refs.SearchSelect && this.$refs.SearchSelect.blur()
        this.options = []
        this.show = false
      },
      change(val) {
        if (val.iframe) {
          window.open(val.name)
        } else {
          if (this.$route.name !== val.name) {
            this.$storeSet('setBreadcrumb', val.indexPath);
            this.$storeSet('addTags', {title: val.index, name: val.name, cache: val.cache, indexPath: val.indexPath});
            this.$storeSet('setActive', val.index);
            this.$router.push({name: val.name});
          }
        }
        this.search = ''
        this.options = []
        this.$nextTick(() => {
          this.show = false
        })
      },
      initFuse(list) {
        this.fuse = new Fuse(list, {
          shouldSort: true,
          threshold: 0.4,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [{
            name: 'indexPath',
            weight: 0.7
          }, {
            name: 'path',
            weight: 0.3
          }]
        })
      },
      querySearch(query) {
        if (query !== '') {
          this.options = this.fuse.search(query)
        } else {
          this.options = []
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../scss/index';

  .header-search {
    height: $header-height;
    line-height: $header-height;
    font-size: 22px;

    & > i {
      color: #909399;
      cursor: pointer;
    }

    & > i:hover {
      color: rgb(80, 80, 80);
    }

    .header-search-select {
      font-size: 18px;
      transition: width 0.2s;
      width: 0;
      overflow: hidden;
      background: transparent;
      border-radius: 0;
      display: inline-block;
      vertical-align: middle;

      .el-input__inner {
        border-radius: 0;
        border: 0;
        padding-left: 0;
        padding-right: 0;
        box-shadow: none !important;
        border-bottom: 1px solid #d9d9d9;
        vertical-align: middle;
      }
    }

    &.show {
      .header-search-select {
        width: 210px;
        margin-left: 10px;
      }
    }
  }
</style>
