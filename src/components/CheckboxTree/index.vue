<template>
  <el-tree
      ref="CheckboxTree"
      :check-strictly="true"
      :data="tree"
      show-checkbox
      node-key="id"
      accordion
      @check="clickCheckbox"
      :default-checked-keys="ids"
  >
  </el-tree>
</template>

<script>
  export default {
    name: "CheckboxTree",
    props: {
      ids: {
        type: Array,
        default: () => []
      },
      tree: {
        type: Array,
        require: true
      }
    },
    methods: {
      // 点击框
      clickCheckbox(currentObj, treeStatus) {
        // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
        let selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中
        // 选中
        if (selected !== -1) {
          // 子节点只要被选中父节点就被选中
          this.selectedParent(currentObj);
          // 统一处理子节点为相同的勾选状态
          this.uniteChildSame(currentObj, true)
        } else {
          // 未选中 处理子节点全部未选中
          if (currentObj.children && currentObj.children.length !== 0) {
            this.uniteChildSame(currentObj, false)
          }
        }
      },
      // 统一处理子节点为相同的勾选状态
      uniteChildSame(treeList, isSelected) {
        // 判断是否被禁用
        if (!treeList.disabled) {
          this.$refs.CheckboxTree.setChecked(treeList.id, isSelected);
        }
        if (treeList.children) {
          for (let i = 0; i < treeList.children.length; i++) {
            this.uniteChildSame(treeList.children[i], isSelected)
          }
        }
      },
      // 统一处理父节点为选中
      selectedParent(currentObj) {
        let currentNode = this.$refs.CheckboxTree.getNode(currentObj);
        if (currentNode.parent.key !== undefined) {
          // 判断是否被禁用
          if (!currentNode.parent.disabled) {
            this.$refs.CheckboxTree.setChecked(currentNode.parent, true);
          }
          this.selectedParent(currentNode.parent)
        }
      },
      // 清除选中
      clear() {
        this.$refs.CheckboxTree.setCheckedKeys([])
      },
      // 选中
      get() {
        return this.$refs.CheckboxTree.getCheckedKeys()
      }
    }
  }
</script>
