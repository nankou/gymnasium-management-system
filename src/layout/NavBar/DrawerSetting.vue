<template>
  <el-scrollbar class="drawer-setting-scrollbar">
    <div class="drawer-setting">
      <h1 class="drawer-title">系统布局设置</h1>
      <div class="drawer-item">
        <span>固定头部</span>
        <el-switch v-model="isFixHeader"/>
      </div>
      <div class="drawer-item">
        <span>显示Logo</span>
        <el-switch v-model="isShowLogo"/>
      </div>
      <div class="drawer-item">
        <span>显示标签页</span>
        <el-switch v-model="isShowTag"/>
      </div>
      <div class="drawer-item">
        <span>显示面包屑</span>
        <el-switch v-model="isShowBreadcrumb"/>
      </div>
      <div class="drawer-item">
        <span>显示底部</span>
        <el-switch v-model="isShowFooter"/>
      </div>
      <h1 class="drawer-title">菜单风格设置</h1>
      <div class="drawer-item">
        <span>夜间模式</span>
        <el-switch v-model="isNight"/>
      </div>
      <div class="drawer-item">
        <span>垂直模式</span>
        <el-switch v-model="isVertical"/>
      </div>
      <div class="drawer-item">
        <span>唯一展开</span>
        <el-switch v-model="isUniqueOpened"/>
      </div>
      <h1 class="drawer-title">样式大小设置</h1>
      <div class="drawer-item">
        <el-radio-group v-model="layoutSize">
          <el-radio label="default">较大</el-radio>
          <el-radio label="medium">中等</el-radio>
          <el-radio label="small">较小</el-radio>
          <el-radio label="mini">迷你</el-radio>
        </el-radio-group>
      </div>
      <h1 class="drawer-title">分页大小设置</h1>
      <div class="drawer-item paging-size">
        <el-radio-group v-model="pagingSize">
          <el-radio :label="10"></el-radio>
          <el-radio :label="20"></el-radio>
          <el-radio :label="50"></el-radio>
          <el-radio :label="100"></el-radio>
          <el-radio :label="200"></el-radio>
        </el-radio-group>
      </div>
      <el-button type="success" class="restoreButton" @click="restoreSetting">恢 复 系 统 默 认 设 置</el-button>
    </div>
  </el-scrollbar>
</template>

<script>
  export default {
    name: "DrawerSetting",
    computed: {
      isFixHeader: {
        get() {
          return this.$storeGet.setting.isFixHeader;
        },
        set(value) {
          this.$storeSet('changeSetting', {
            key: 'isFixHeader',
            value: value
          })
        }
      },
      isShowLogo: {
        get() {
          return this.$storeGet.setting.isShowLogo;
        },
        set(value) {
          this.$storeSet('changeSetting', {
            key: 'isShowLogo',
            value: value
          })
        }
      },
      isShowTag: {
        get() {
          return this.$storeGet.setting.isShowTag;
        },
        set(value) {
          this.$storeSet('changeSetting', {
            key: 'isShowTag',
            value: value
          })
        }
      },
      isShowBreadcrumb: {
        get() {
          return this.$storeGet.setting.isShowBreadcrumb;
        },
        set(value) {
          this.$storeSet('changeSetting', {
            key: 'isShowBreadcrumb',
            value: value
          })
        }
      },
      isShowFooter: {
        get() {
          return this.$storeGet.setting.isShowFooter;
        },
        set(value) {
          this.$storeSet('changeSetting', {
            key: 'isShowFooter',
            value: value
          })
        }
      },
      isNight: {
        get() {
          return this.$storeGet.setting.isNight;
        },
        set(value) {
          this.$storeSet('changeSetting', {
            key: 'isNight',
            value: value
          })
        }
      },
      isVertical: {
        get() {
          return this.$storeGet.setting.isVertical;
        },
        set(value) {
          this.$storeSet('changeSetting', {
            key: 'isVertical',
            value: value
          })
        }
      },
      isUniqueOpened: {
        get() {
          return this.$storeGet.setting.isUniqueOpened;
        },
        set(value) {
          this.$storeSet('changeSetting', {
            key: 'isUniqueOpened',
            value: value
          })
        }
      },
      layoutSize: {
        get() {
          return this.$storeGet.setting.layoutSize;
        },
        set(value) {
          this.$storeSet('changeSetting', {
            key: 'layoutSize',
            value: value
          })
        }
      },
      pagingSize: {
        get() {
          return this.$storeGet.setting.pagingSize;
        },
        set(value) {
          this.$storeSet('changeSetting', {
            key: 'pagingSize',
            value: value
          })
        }
      }
    },
    methods: {
      restoreSetting() {
        this.$storeSet('restoreSetting')
      }
    }
  }
</script>

<style lang="scss">
  .drawer-setting-scrollbar {
    height: 100%;

    .el-scrollbar__wrap {
      overflow-x: hidden;
      overflow-y: scroll;
    }
  }

  .drawer-setting {
    position: relative;
    padding: 10px 24px 24px 24px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
      margin: 12px 0 12px 0;
      color: rgba(0, 0, 0, .85);
      font-size: 20px;
      font-weight: 600;
      line-height: 22px;
    }

    .drawer-item {
      color: rgba(0, 0, 0, .65);
      font-size: 14px;
      padding: 12px 0;

      & > .el-switch {
        float: right
      }
    }

    .paging-size {
      .el-radio {
        margin-right: 16px;
      }
    }

    .restoreButton {
      margin-top: 12px;
      width: 100%;
      font-size: 14px;
      font-weight: 600;
    }
  }
</style>
