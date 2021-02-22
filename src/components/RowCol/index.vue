<script>
  export default {
    name: 'RowCol',
    props: {
      spanL: {
        type: Number,
        default: 12
      },
      spanR: {
        type: Number,
        default: 12
      },
      gutter: {
        type: Number,
        default: 0
      }
    },
    render(createElement) {
      return createElement(
        'el-row', {attrs: {gutter: this.gutter}}, [
          createElement('el-col', {
            attrs: {span: this.spanL}
          }, this.$slots.default),
          createElement('el-col', {
            attrs: {span: this.spanR}
          }, this.$slots['r'])
        ]
      )
    }
  }
</script>
