<script>
  import Clipboard from 'clipboard'

  export default {
    name: "Clipboard",
    props: {
      text: {
        type: String,
        default: ''
      }
    },
    render(createElement) {
      const _this = this;
      return createElement('div', {
          style: {
            display: 'inline-block',
            cursor: 'pointer'
          },
          on: {
            click(e) {
              const clipboard = new Clipboard(e.target, {
                text: () => _this.text
              });
              clipboard.on('success', () => {
                _this.$successMsg('复制成功');
                clipboard.off('error');
                clipboard.off('success');
                clipboard.destroy()
              });
              clipboard.on('error', () => {
                _this.$successMsg('复制失败');
                clipboard.off('error');
                clipboard.off('success');
                clipboard.destroy()
              });
              clipboard.onClick(event)
            }
          }
        }, this.$slots.default
      )
    }
  }
</script>
