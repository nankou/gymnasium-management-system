<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
  export default {
    name: "SvgIcon",
    props: {
      iconClass: {
        type: String,
        required: true
      },
      className: {
        type: String,
        default: ""
      }
    },
    computed: {
      iconName() {
        return `#icon-${this.iconClass}`;
      },
      svgClass() {
        if (this.className) {
          return "svg-icon " + this.className;
        } else {
          return "svg-icon";
        }
      }
    }
  };
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .svg-menu {
    position: relative;
    top: 2px;
    margin-right: 18px;
    font-size: 16px;
  }
</style>
