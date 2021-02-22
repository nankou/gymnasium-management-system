<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: "App",
    created() {
      const appLoading = document.getElementById('app-loading')
      if (appLoading) document.body.removeChild(appLoading)
    }
  }
</script>
