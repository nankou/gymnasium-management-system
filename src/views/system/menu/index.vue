<template>
  <card ref="Card">
    <div slot="header">
      <el-input placeholder="输入菜单名称搜索" v-model="searchTitle" clearable class="w-200" @keyup.enter.native="searchData"/>
      <el-button type="success" class="el-icon-search ml-5" @click="searchData">搜索</el-button>
      <el-button type="warning" class="el-icon-folder-opened ml-5" @click="changeExpand" v-show="!isExpand">展开</el-button>
      <el-button type="warning" class="el-icon-folder ml-5" @click="changeExpand" v-show="isExpand">合拢</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="add()" class="float-right" v-permission="'addMenu'">新增</el-button>
    </div>
    <el-table
        v-if="flag"
        row-key="id"
        :data="formData"
        :default-expand-all="isExpand"
        :tree-props="{children: 'children'}">
      <el-table-column prop="title" label="菜单名称">
        <template slot-scope="scope">
          <span @dblclick.stop="add(scope.row)">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径名称">
        <template slot-scope="scope">
          <clipboard :text="scope.row.name">{{scope.row.name}}</clipboard>
        </template>
      </el-table-column>
      <el-table-column prop="permission" label="权限标识">
        <template slot-scope="scope">
          <span @dblclick.stop="edit(scope.row)">{{scope.row.permission}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" width="55">
        <template slot-scope="scope">
          <svg-icon slot="prefix" :icon-class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="55"/>
      <el-table-column label="外链" align="center" width="55">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.iframe">是</el-tag>
          <el-tag type="warning" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="缓存" align="center" width="55">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cache">
            <span class="pointer" @dblclick="changeIsCache(scope.row)">是</span>
          </el-tag>
          <el-tag type="warning" v-else>
            <span class="pointer" @dblclick="changeIsCache(scope.row)">否</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="可见" align="center" width="55">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.hidden">
            <span class="pointer" @dblclick="changeIsHidden(scope.row)">否</span>
          </el-tag>
          <el-tag type="success" v-else>
            <span class="pointer" @dblclick="changeIsHidden(scope.row)">是</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="300">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-plus" @click.stop="add(scope.row)" v-permission="'addMenu'"/>
          <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" v-permission="'editMenu'"/>
          <el-button icon="el-icon-upload2" @click="addMore(scope.row)" v-permission="'addMenu'"/>
          <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delMenu'"/>
        </template>
      </el-table-column>
    </el-table>
    <add ref="Add" :menu="menu" @update="getData"/>
    <add-more ref="AddMore" :menu="menu" @update="getData"/>
    <edit ref="Edit" :menu="menu" @update="getData"/>
  </card>
</template>

<script>
  import {getAllMenuApi, deleteMenuApi, editMenuApi} from '@/api/system/menu';
  import {hasPermission, objectEvaluate} from "@/utils/common";
  import Clipboard from '@/components/Clipboard';
  import Add from './add';
  import AddMore from './add_more';
  import Edit from './edit';

  export default {
    name: "Menu",
    components: {Add, AddMore, Edit, Clipboard},
    data() {
      return {
        flag: true,
        isExpand: false,
        searchTitle: '',
        formData: [],
        menu: []
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        this.$refs.Card.start();
        getAllMenuApi({title: ''}).then(result => {
          this.formData = result.resultParam.menuList;
          this.menu = result.resultParam.menuList;
          this.$refs.Card.stop()
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      searchData() {
        this.$refs.Card.start();
        getAllMenuApi({title: this.searchTitle}).then(result => {
          this.$refs.Card.stop();
          this.formData = result.resultParam.menuList;
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      add(obj) {
        if (!hasPermission('addMenu')) return
        let _this = this.$refs.Add;
        if (obj) objectEvaluate(_this.form, {pid: obj.id}, this);
        _this.visible = true;
      },
      addMore(obj) {
        if (!hasPermission('addMenu')) return
        let _this = this.$refs.AddMore;
        if (obj) objectEvaluate(_this.form, {pid: obj.id}, this);
        _this.visible = true;
      },
      edit(obj) {
        if (!hasPermission('editMenu')) return
        let _this = this.$refs.Edit;
        if (obj.pid === 0) obj.pid = null;
        objectEvaluate(_this.form, obj);
        _this.visible = true;
      },
      delData(id) {
        deleteMenuApi({menuId: id})
          .then(() => {
            this.getData();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      },
      changeExpand() {
        this.isExpand = !this.isExpand
        this.flag = false
        this.$nextTick(() => {
          this.flag = true
        })
      },
      changeIsHidden(obj) {
        if (!hasPermission('editMenu')) return
        let param = {...obj}
        param.hidden = !param.hidden
        delete param.children
        delete param.isDelete
        delete param.createTime
        editMenuApi(param).then((result) => {
          if (result.status !== 200) return
          obj.hidden = !obj.hidden
        })
      },
      changeIsCache(obj) {
        if (!hasPermission('editMenu')) return
        let param = {...obj}
        param.cache = !param.cache
        delete param.children
        delete param.isDelete
        delete param.createTime
        editMenuApi(param).then(result => {
          if (result.status !== 200) return
          obj.cache = !obj.cache
        })
      }
    }
  }
</script>
