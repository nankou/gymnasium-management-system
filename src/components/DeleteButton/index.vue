<template>
  <el-popover
      ref="DeleteButton"
      placement="top"
      :width="width">
    <p>{{msg}}</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="$refs['DeleteButton'].doClose()">取消</el-button>
      <el-button
          :loading="isDeleteLoading"
          type="primary"
          size="mini"
          @click.stop="deleteData()">确定
      </el-button>
    </div>
    <el-button
        v-if="type==='button'"
        slot="reference"
        type="danger"
        icon="el-icon-delete"
        style="margin-left: 10px;"
        @click.stop/>
    <el-button
        v-else
        slot="reference"
        type="text"
        style="margin-left: 10px;"
        @click.stop>
      {{text}}
    </el-button>
  </el-popover>
</template>

<script>
  export default {
    name: "DeleteButton",
    props: {
      id: {
        type: [Number, String],
        required: true
      },
      msg: { // 提示文字
        type: String,
        default: '确定删除本条数据吗？'
      },
      width: { // 提示框宽度
        type: Number,
        default: 180
      },
      type: { // 按钮类型
        type: String,
        default: 'button'
      },
      text: { // 按钮文字
        type: String,
        default: ''
      }
    },
    data() {
      return {
        isDeleteLoading: false
      }
    },
    methods: {
      stop() {
        this.isDeleteLoading = false;
      },
      close() {
        this.isDeleteLoading = false;
        this.$refs['DeleteButton'].doClose()
      },
      deleteData() {
        this.isDeleteLoading = true;
        this.$emit('start', this.id)
      }
    }
  }
</script>
