<template>
  <div id="error-404">
    <div id="container">
      <img class="png" src="../../assets/error/404.png"/>
      <img class="png msg" src="../../assets/error/404_msg.png"/>
      <p class="go-back-home">
        <a class="pointer" target="_blank"
           @click.stop="$router.push({name:'home'})">
          <img class="png" src="../../assets/error/404_to_index.png"/>
        </a>
      </p>
    </div>
    <div id="cloud" class="png"></div>
  </div>
</template>

<script>
  export default {
    name: "Error404"
  }
</script>

<style scoped>
  #error-404 {
    height: 100%;
    background: url("../../assets/error/error_bg.jpg") repeat-x scroll 0 0 #67ACE4;
  }

  #container {
    margin: 0 auto;
    padding-top: 8%;
    text-align: center;
    width: 560px;
  }

  #container img {
    border: medium none;
    margin-bottom: 50px;
  }

  #container .go-back-home {
    position: relative;
    z-index: 999;
  }

  #container .msg {
    margin-bottom: 65px;
  }

  #cloud {
    background: url("../../assets/error/error_cloud.png") repeat-x scroll 0 0 transparent;
    bottom: 0;
    height: 170px;
    position: absolute;
    width: 100%;
  }
</style>
