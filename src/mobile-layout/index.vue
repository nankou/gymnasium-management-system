<template>
  <div class="layout">
    <div class="navbar">
      <div v-if="isDetail">
        <span  @click="backHome">
          <i class="el-icon-arrow-left left"></i>
          {{detailTitle}}
        </span>
      </div>
      <div v-else-if="isLogin">
        
        <div class="first-content">用户登录</div>
         <span class=" right" @click="toAdminLogin">管理员登录</span>
      </div>
      <div v-else>
        <div class="first-content">首页</div>
      </div>
      
    </div>
    <AppMain />
  </div>
</template>

<script>
import AppMain from "./AppMain.vue";
export default {
  name: "Layout",
  components: {
    AppMain
  },
  data() {
    return {};
  },
  created() {
     console.log("this.$route");
    console.log(this.$route);
  },
  computed: {
    detailTitle() {
      return this.$route.meta.title;
    },
    isDetail() {
     
      return this.$route.meta.detail ? true : false;
    },
    isLogin(){
      if(this.$route.meta.title == "用户登录")
      {
         console.log("用户登录");
        return true;
      }
      return false;
    }
    
  },
  methods:{
    backHome(){
      this.$router.go(-1)
    },
    toAdminLogin(){
      this.$router.push('/login')
    }
  }
};
</script>

<style lang='less' scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  z-index: 20;
  color: aliceblue;
  font-family:'Times New Roman', Times, serif;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  background-color: #37f;
}
.left {
  color: #fff;
  position: absolute;
  font-size: 24px;
  left: 10px;
  top: 10px;
  cursor: pointer;
}
.right {
  color: #fff;
  position: absolute;
  transform: translateY(-50%);
  font-size: 10px;
  right: 10px;
  top: 50%;
  cursor: pointer;
  
}
</style>
