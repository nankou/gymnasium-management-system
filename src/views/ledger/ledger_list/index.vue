<template>
  <div>
    <keep-alive>
      <router-view :key="key"/>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: "LedgerList",
    computed: {
      key() {
        return this.$route.name
      }
    }
  }
</script>
