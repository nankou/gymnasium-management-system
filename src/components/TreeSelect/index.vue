<template>
  <vue-tree-select
      v-model="val"
      :class="'tree-select-' + size"
      :options="tree"
      :normalizer="normalizer"
      :default-expand-level="defaultExpandLevel"
      :placeholder="placeholder"
      :multiple="options[keys].multiple"
      :flat="options[keys].flat"
      :autoSelectDescendants="options[keys].autoSelectDescendants"
      :value-consists-of="options[keys].valueConsistsOf"
      sort-value-by="INDEX"
      noResultsText="无数据"
      @input="input"
      :disabled="disabled"
  />
</template>

<script>
  import VueTreeSelect from '@riophae/vue-treeselect';
  import '@riophae/vue-treeselect/dist/vue-treeselect.css';
  import {isEmpty} from "@/utils/common";

  export default {
    name: "TreeSelect",
    components: {VueTreeSelect},
    props: {
      value: {
        type: [Number, Array, Object]
      },
      tree: { // 数据
        type: [Number, Array],
        required: true
      },
      placeholder: {
        type: String,
        default: ''
      },
      defaultExpandLevel: { // 默认展开层级
        type: Number,
        default: 1
      },
      normalizer: { // 自定义键
        type: Function,
        default: node => {
          return {
            label: node.name,
            isDisabled: !node.enabled
          }
        }
      },
      keys: { // 模式 0:单选 1:多选-独立 2:多选-联动
        type: Number,
        default: 0
      },
      disabled: { // 是否禁用
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        val: null,
        options: [
          { // 单选
            multiple: false,
            flat: false,
            autoSelectDescendants: false,
            valueConsistsOf: 'BRANCH_PRIORITY'
          },
          { // 独立
            multiple: true,
            flat: true,
            autoSelectDescendants: true,
            valueConsistsOf: 'BRANCH_PRIORITY'
          },
          { // 联动
            multiple: true,
            flat: false,
            autoSelectDescendants: false,
            valueConsistsOf: 'ALL_WITH_INDETERMINATE'
          }
        ]
      }
    },
    computed: {
      size() {
        return this.$storeGet.setting.layoutSize
      }
    },
    watch: {
      value(val, old) {
        if (!isEmpty(val) && isEmpty(old)) { // 第一次输入执行
          this.val = val
        }
        if (isEmpty(val) && !isEmpty(this.val)) { // 只有外边清空才执行
          this.val = null
        }
      }
    },
    mounted() {
      if (!isEmpty(this.value)) {
        this.val = this.value
      }
    },
    methods: {
      input(val) {
        this.$emit('input', val);
        this.$emit('get', val);
        this.$parent.$emit('el.form.change');
      }
    }
  }
</script>

<style>
  /* --1-- */
  .tree-select-default > .vue-treeselect__control {
    height: 40px;
    font-size: 14px;
  }

  .tree-select-medium > .vue-treeselect__control {
    height: 36px;
    font-size: 14px;
  }

  .tree-select-small > .vue-treeselect__control {
    height: 32px;
    font-size: 13px;
  }

  .tree-select-mini > .vue-treeselect__control {
    height: 28px;
    font-size: 12px;
  }

  /* --2-- */
  .tree-select-default .vue-treeselect__placeholder,
  .tree-select-default .vue-treeselect__single-value {
    line-height: 37px;
  }

  .tree-select-medium .vue-treeselect__placeholder,
  .tree-select-medium .vue-treeselect__single-value {
    line-height: 33px;
  }

  .tree-select-small .vue-treeselect__placeholder,
  .tree-select-small .vue-treeselect__single-value {
    line-height: 29px;
  }

  .tree-select-mini .vue-treeselect__placeholder,
  .tree-select-mini .vue-treeselect__single-value {
    line-height: 25px;
  }

  /* --3-- */
  .tree-select-default .vue-treeselect__multi-value-item {
    padding: 7px 0;
  }

  .tree-select-medium .vue-treeselect__multi-value-item {
    padding: 5px 0;
  }

  .tree-select-small .vue-treeselect__multi-value-item {
    padding: 4px 0;
  }

  .tree-select-mini .vue-treeselect__multi-value-item {
    padding: 4px 0;
  }
</style>
