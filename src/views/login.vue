<template>
  <div id="login">
    <el-form ref="Form" :model="form" :rules="rules" label-position="left" label-width="0px" class="login-form">
      <h3 class="title">{{title}}党建系统 - 后台登陆</h3>
      <el-form-item prop="username">
        <el-input v-model="form.username" type="text" auto-complete="off" placeholder="工号/学号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" auto-complete="off" placeholder="密码"
                  @keyup.enter.native="submit">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="hasCode">
        <el-input v-model="form.code" auto-complete="off" placeholder="验证码" style="width: 63%"
                  @keyup.enter.native="submit">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="login-code" v-loading="isImgLoading" element-loading-background="rgba(255, 255, 255, 0)">
          <img :src="codeUrl" @click="getCode" alt="验证码">
        </div>
      </el-form-item>
      <el-checkbox v-model="isRememberMe" style="margin:0 0 25px 0;">记住我</el-checkbox>
      <el-form-item class="w-100">
        <el-button :loading="isLoading" type="primary" class="w-100" @click.native.prevent="submit">
          <span v-if="!isLoading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div v-if="isShowFooter" id="el-login-footer">
      <span>{{footerTxt}} ⋅ {{caseNumber}}</span>
    </div>
  </div>
</template>

<script>
  import {loginApi, getCodeApi} from '@/api/login';
  import {encrypt} from '@/utils/encrypt';
  import {generateRouter} from "@/router";
  import {resetStore} from '@/store';
  import {resetRouter} from "@/router/routers";
  import {removeCookiesStorage, removeSessionStorage} from "@/utils/storage";
  import {title, footerTxt, caseNumber, hasCode, prefix} from '@/settings';

  export default {
    name: "Login",
    data() {
      return {
        isLoading: false,
        isImgLoading: false,
        isRememberMe: false,
        codeUrl: '',
        form: {
          username: '',
          password: '',
          code: '',
          uuid: ''
        },
        rules: {
          username: {required: true, message: '请输入工号/学号', trigger: 'blur'},
          password: {required: true, message: '请输入密码', trigger: 'blur'},
          code: {required: true, message: '请输入验证码', trigger: 'blur'}
        }
      }
    },
    computed: {
      title() {
        return title
      },
      footerTxt() {
        return footerTxt
      },
      caseNumber() {
        return caseNumber
      },
      hasCode() {
        return hasCode
      },
      isShowFooter() {
        return this.$storeGet.setting.isShowFooter
      }
    },
    mounted() {
      this.getCode();
      this.form.username = this.$storeGet.username;
      this.isRememberMe = this.$storeGet.rememberMe
      this.init();
    },
    methods: {
      init() {
        removeSessionStorage(`${prefix}-LAYOUT`);
        removeCookiesStorage(`${prefix}-TOKEN`);
        resetRouter();
        resetStore();
      },
      getCode() {
        if (!this.hasCode) return;
        this.isImgLoading = true;
        getCodeApi()
          .then(result => {
            this.form.code = '';
            this.form.uuid = result.resultParam.uuid
            this.codeUrl = result.resultParam.img;
            this.isImgLoading = false;
          })
          .catch(() => {
            this.isImgLoading = false;
          })
      },
      submit() {
        this.$refs['Form'].validate(valid => {
          if (!valid) return false;
          this.isLoading = true;
          const data = {...this.form};
          data.password = encrypt(data.password);
          loginApi(data)
            .then(result => {
              if (result.status !== 200) throw new Error();
              this.$storeSet('setToken', result.resultParam.token);
              // 动态拉取路由和菜单
              return generateRouter();
            })
            .then(() => {
              this.$storeSet('setRememberMe', {
                rememberMe: this.isRememberMe,
                username: this.form.username
              });
              this.$router.push({name: 'home'});
              this.isLoading = false;
            })
            .catch(() => {
              this.getCode();
              this.isLoading = false;
            })
        });
      }
    }
  }
</script>

<style lang="scss">
  #login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: url("../assets/home.jpg") no-repeat center center;
    background-size: cover;

    .title {
      margin: 0 auto 30px auto;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: #707070;
    }

    .login-form {
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.9);
      width: 350px;
      padding: 25px 25px 5px 25px;

      .el-input {
        height: 38px;

        input {
          height: 38px;
        }
      }

      .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
      }

      .el-input__inner {
        color: #1e1e1e;
        background-color: rgba(255, 255, 255, .92);
      }
    }

    .login-code {
      width: 33%;
      display: inline-block;
      height: 38px;
      float: right;

      img {
        cursor: pointer;
        vertical-align: middle;
        border-radius: 4px;
        height: 38px;
      }
    }

    #el-login-footer {
      height: 40px;
      line-height: 40px;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      text-align: center;
      color: #e8d5d5;
      font-family: Arial, serif;
      font-size: 12px;
      letter-spacing: 1px;
    }
  }
</style>
