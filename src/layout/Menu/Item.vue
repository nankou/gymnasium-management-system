<script>
  export default {
    name: 'Item',
    functional: true,
    props: {
      icon: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    render(createElement, context) {
      const vnodes = [];
      const {icon, title} = context.props;
      if (icon)
        vnodes.push(
          createElement('svg-icon', {
            class: 'svg-menu',
            attrs: {
              'icon-class': icon
            }
          })
        );
      if (title)
        vnodes.push(
          createElement('span', {
            slot: 'title',
            domProps: {
              innerHTML: title
            }
          })
        );
      return vnodes
    }
  }
</script>
