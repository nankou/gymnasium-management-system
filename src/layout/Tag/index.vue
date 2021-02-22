<template>
  <div id="tags-view-container" v-show="isShowTag">
    <tag-scroll-pane ref="TagScrollPane" class="tags-view-wrapper">
      <router-link
          v-for="tag in tags"
          ref="tag"
          :class="isActive(tag.name) ? 'active' : ''"
          :key="tag.name"
          :to="{name: tag.name}"
          tag="span"
          class="tags-view-item"
          @click.middle.native="tabsRemove(tag)"
          @contextmenu.prevent.native="$refs.ContextMenu.showMenu($event, tag)"
          @click.prevent.native="tabsClick(tag)">
        <span>{{tag.title}}</span>
        <span v-if="tag.title !== '首页'"
              class="el-icon-close"
              @click.prevent.stop="tabsRemove(tag)"></span>
      </router-link>
    </tag-scroll-pane>
    <e-vue-contextmenu ref="ContextMenu" class="contextmenu" @ctx-show="show">
      <ul>
        <li @click="refresh()">刷新</li>
        <li @click="closeRight()">关闭右侧</li>
        <li v-if="clickedTitle!== '首页'" @click="closeOthers()">关闭其他</li>
      </ul>
    </e-vue-contextmenu>
  </div>
</template>

<script>
  import TagScrollPane from './TagScrollPane'
  import Vue from "vue";
  import {isHistory} from '@/settings'

  export default {
    name: 'Tag',
    components: {TagScrollPane},
    data() {
      return {
        clickedTitle: "",
        selectedTag: {
          title: String,
          name: String,
          cache: Boolean,
          indexPath: Array
        }
      }
    },
    computed: {
      isShowTag() {
        return this.$storeGet.setting.isShowTag
      },
      tags() {
        return this.$storeGet.tags
      }
    },
    watch: {
      tags() {
        this.$storeSet("setCache");
      },
      "$route.path"() {
        this.moveToCurrentTag();
      },
      "$store.getters.setting.layoutSize"() {
        Vue.prototype.$ELEMENT = {
          size: this.$storeGet.setting.layoutSize
        };
        this.$storeSet('refreshRouter', {
          name: this.$route.name,
          path: this.$route.fullPath
        })
      }
    },
    mounted() {
      this.$storeSet("setCache");
      this.addNotTag()
    },
    methods: {
      // 添加未添加的标签
      addNotTag() {
        if (this.$route.meta.title === this.$storeGet.active) return;
        if (this.$route.name === 'home') {
          this.$storeSet('setBreadcrumb');
          this.$storeSet("setActive");
          return
        }
        if (this.$route.name === 'person') {
          this.$storeSet('setBreadcrumb', ['个人中心']);
          this.$storeSet('addTags', {title: '个人中心', name: 'person', indexPath: ['个人中心']});
          this.$storeSet('setActive', '个人中心');
          return
        }
        this.$storeGet.searchMenu.some(item => {
          if (item.name === this.$route.name ||
            item.name === this.$route.meta.active) {
            this.$storeSet('setBreadcrumb', item.indexPath);
            this.$storeSet('addTags', {title: item.index, name: item.name, cache: item.cache, indexPath: item.indexPath});
            this.$storeSet("setActive", item.index);
            return true
          }
        })
      },
      // 移动到被选中的标签
      moveToCurrentTag() {
        const tags = this.$refs.tag;
        this.$nextTick(() => {
          for (const tag of tags) {
            if (this.$route.name === tag.to.name) {
              this.$refs.TagScrollPane.moveToTarget(tag);
              break;
            }
          }
          if (isHistory) return
          this.$nextTick(() => {
            this.addNotTag()
          })
        });
      },
      // 高亮标签
      isActive(name) {
        if (this.$route.meta.active) {
          return this.$route.meta.active === name
        } else {
          return this.$route.name === name
        }
      },
      // 点击标签
      tabsClick(tag) {
        if (tag.title === this.$storeGet.active) return;
        this.$storeSet("setBreadcrumb", tag.indexPath);
        this.$storeSet("setActive", tag.title);
      },
      // 删除标签
      tabsRemove(obj) {
        if (obj.title === '首页') return;
        this.$storeSet("deleteTags", obj.title);
      },
      // 右键菜单打开回调 (data: {object})
      show(data) {
        this.clickedTitle = data.title;
        this.selectedTag = data;
      },
      // 刷新路由
      refresh() {
        if (this.$storeGet.active === this.clickedTitle) {
          this.$storeSet('refreshRouter', {
            name: this.selectedTag.name,
            path: this.$route.fullPath
          })
        } else {
          this.$router.push({name: this.selectedTag.name});
          this.tabsClick(this.selectedTag);
        }
        this.closeContextMenu();
      },
      // 关闭右侧
      closeRight() {
        let obj = [...this.tags];
        for (let i = obj.length - 1; i >= 0; i--) {
          let title = obj[i].title;
          if (title !== this.clickedTitle) {
            this.tabsRemove(obj[i]);
          } else if (title === this.clickedTitle) {
            break;
          }
        }
        this.closeContextMenu();
      },
      // 关闭其他菜单
      closeOthers() {
        let obj = [...this.tags];
        obj.forEach(item => {
          if (item.title !== this.clickedTitle) {
            this.tabsRemove(item);
          }
        });
        this.closeContextMenu();
      },
      // 关闭右键菜单
      closeContextMenu() {
        this.$refs.ContextMenu.hideMenu();
      }
    }
  };
</script>

<style lang="scss">
  #tags-view-container {
    height: 36px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid rgb(208, 208, 208);

    .tags-view-wrapper {
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;

        &:first-of-type {
          margin-left: 15px;
        }

        &:last-of-type {
          margin-right: 15px;
        }

        &.active {
          background-color: #409eff;
          color: #fff;
          border-color: #409eff;

          &::before {
            content: "";
            background: #fff;
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: relative;
            margin-right: 2px;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .tags-view-wrapper {
    .tags-view-item {
      user-select: none;

      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;

        &:before {
          transform: scale(0.6);
          display: inline-block;
          vertical-align: -3px;
        }

        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
</style>
