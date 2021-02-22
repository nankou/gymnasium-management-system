<template>
  <el-row :gutter="20">
    <el-col :sm="24" :md="19" class="mb-15">
      <card ref="Card">
        <div slot="header">
          <el-input placeholder="输入角色名称搜索" v-model="searchName" clearable class="w-200" @keyup.enter.native="getData"/>
          <el-button type="success" class="el-icon-search ml-5" @click="getData">搜索</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="add" class="float-right" v-permission="'addRole'">新增</el-button>
        </div>
        <el-table
            :data="formData"
            @row-click="getTreeChecked"
            :max-height="maxHeight"
            :highlight-current-row="true">
          <el-table-column prop="name" label="名称"/>
          <el-table-column prop="dataScope" label="数据权限"/>
          <el-table-column prop="level" label="角色级别"/>
          <el-table-column prop="remark" label="描述" :show-overflow-tooltip="true"/>
          <el-table-column label="创建时间" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click.stop="edit(scope.row)" v-permission="'editRole'"></el-button>
              <delete-button :ref="scope.row.id" :id="scope.row.id" @start="delData" v-permission="'delRole'"/>
            </template>
          </el-table-column>
        </el-table>
      </card>
    </el-col>
    <el-col :sm="24" :md="5">
      <card ref="TreeCard">
        <div slot="header">
          <span>菜单分配</span>
          <submit-button ref="Submit" icon="el-icon-check" class="float-right" @submit="update" text="保存" v-permission="'editRolesMenus'"/>
        </div>
        <checkbox-tree ref="RoleMenuTree" :ids="menuIds" :tree="tree"/>
      </card>
    </el-col>
    <add ref="Add" :dept="dept" :level="level + 1" @update="getData"/>
    <edit ref="Edit" :dept="dept" :level="level + 1" @update="getData"/>
  </el-row>
</template>

<script>
  import {getRoleApi, listRoleApi, getCurrentRoleApi, deleteRoleApi, getRoleTreeApi} from '@/api/system/role';
  import {editRolesMenusApi} from '@/api/system/menu';
  import {getUserLevelApi} from '@/api/system/user';
  import {treeDeptApi} from '@/api/system/dept';
  import {objectEvaluate} from "@/utils/common";
  import CheckboxTree from '@/components/CheckboxTree';
  import Add from './add';
  import Edit from './edit';

  export default {
    name: "Role",
    components: {Add, Edit, CheckboxTree},
    data() {
      return {
        maxHeight: 500,
        searchName: '',
        formData: [],
        level: null,
        dept: [],
        // 菜单分配
        id: null,
        tree: [],
        menuIds: []
      }
    },
    mounted() {
      this.getRoleTree();
      this.getLevel();
      this.getDept();
      this.getData();
      this.setHeight();
    },
    activated() {
      this.addListener();
    },
    deactivated() {
      window.removeEventListener("resize", this.setHeight)
    },
    methods: {
      /**
       * @description 表格最大高度
       * */
      // 监听
      addListener() {
        window.addEventListener("resize", this.setHeight)
      },
      // 设置最大高度
      setHeight() {
        let main = document.querySelector('.el-main')
        this.maxHeight = main.clientHeight - 117
      },
      /**
       * @description 初始化
       * */
      // 获取级别
      getLevel() {
        getUserLevelApi().then(result => {
          this.level = result.resultParam.level
        })
      },
      // 获取部门
      getDept() {
        treeDeptApi({deptName: ''}).then(result => {
          this.dept = result.resultParam.deptTree
        })
      },
      // 获取权限树
      getRoleTree() {
        this.$refs.TreeCard.start();
        getRoleTreeApi({roleName: ''})
          .then(result => {
            this.$refs.TreeCard.stop();
            this.getCurrentRole(result.resultParam.roleTree);
          }).catch(() => {
          this.$refs.TreeCard.stop();
        })
      },
      // 获取当前用户权限
      getCurrentRole(tree) {
        if (this.$storeGet.roles.includes("admin")) {
          this.tree = tree
          return
        }
        getCurrentRoleApi().then(result => {
          let roleIds = result.resultParam.menuIdList
          this.filterAsyncTree(tree, roleIds)
          this.$nextTick(() => {
            this.tree = tree
          })
        })
      },
      // 遍历和禁用
      filterAsyncTree(nodes, roleIds) {
        return nodes.filter(node => {
          node.disabled = !roleIds.includes(node.id);
          if (node.children && node.children.length) {
            node.children = this.filterAsyncTree(node.children, roleIds)
          }
          return true
        })
      },

      /**
       * @description 角色列表
       * */
      // 获取角色列表
      getData() {
        this.$refs.Card.start();
        listRoleApi({roleName: this.searchName}).then(result => {
          this.$refs.Card.stop();
          this.formData = result.resultParam.roleList;
          this.$refs.RoleMenuTree.clear();
          this.$refs.Submit.ban();
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      // 新增
      add() {
        this.$refs.Add.visible = true
      },
      // 编辑
      edit(obj) {
        this.$refs.Card.start();
        getRoleApi({id: obj.id}).then(result => {
          this.$refs.Card.stop();
          let response = result.resultParam.roleDto;
          let _this = this.$refs.Edit;
          response.deptIds = response.depts.map(item => {
            if (item) return item.id;
          });
          objectEvaluate(_this.form, response, this);
          _this.visible = true;
        }).catch(() => {
          this.$refs.Card.stop();
        })
      },
      // 删除
      delData(id) {
        deleteRoleApi({roleId: id})
          .then(() => {
            this.getData();
            this.$refs[id].close()
          })
          .catch(() => {
            this.$refs[id].stop();
          })
      },

      /**
       * @description 权限更新
       * */
      // 点击行
      getTreeChecked(row) {
        this.$refs.Submit.cancelBan();
        this.$refs.RoleMenuTree.clear();
        this.$refs.TreeCard.start();
        getRoleApi({id: row.id}).then(result => {
          this.$refs.TreeCard.stop();
          let response = result.resultParam.roleDto
          this.menuIds = response.menus.map(item => {
            if (item) return item.id
          });
          this.id = row.id;
        }).catch(() => {
          this.$refs.TreeCard.stop();
        })
      },
      // 更新权限
      update() {
        let data = {};
        data.roleId = this.id;
        data.menuIds = this.$refs.RoleMenuTree.get();
        if (data.menuIds.length === 0) {
          this.$errorMsg('请选择菜单')
          return
        }
        this.$refs.Submit.start();
        editRolesMenusApi(data).then(() => {
          this.$refs.Submit.stop();
        }).catch(() => {
          this.$refs.Submit.stop();
        })
      }
    }
  }
</script>
