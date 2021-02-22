<template>
  <div class="person">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5">
        <card class="mb-20">
          <div slot="header">
            <span>个人信息</span>
          </div>
          <div style="text-align: center; margin-bottom: 20px">
            <avatar-uploader :url="this.$baseApi + user.avatar"></avatar-uploader>
          </div>
          <ul class="personInfo">
            <li>
              <span>工号/学号</span>
              <span>{{user.username}}</span>
            </li>
            <li>
              <span>姓名</span>
              <span>{{user.nickName}}</span>
            </li>
            <li>
              <span>手机号码</span>
              <span>{{user.phone}}</span>
            </li>
            <li>
              <span>用户邮箱</span>
              <span>{{user.email}}</span>
            </li>
            <li>
              <span>部门</span>
              <span>{{user.dept | formatObj}}</span>
            </li>
            <li>
              <span>职务</span>
              <span>{{user.job | formatObj}}</span>
            </li>
            <li>
              <span>角色</span>
              <span>{{user.roles | formatArray}}</span>
            </li>
            <li>
              <span>创建日期</span>
              <span>{{user.createTime | formatDate}}</span>
            </li>
            <li v-permission="'editPass'">
              <span>安全设置</span>
              <span>
                <a style="color: #317ef3; cursor: pointer" @click="changePassword">修改密码</a>
              </span>
            </li>
          </ul>
        </card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <personal-log/>
      </el-col>
    </el-row>
    <password-dialog ref="PasswordDialog"></password-dialog>
  </div>
</template>

<script>
  import PasswordDialog from './password'
  import PersonalLog from './log'
  import AvatarUploader from '@/components/AvatarUploader'

  export default {
    components: {PasswordDialog, PersonalLog, AvatarUploader},
    name: 'Person',
    computed: {
      user() {
        return this.$storeGet.user
      }
    },
    methods: {
      // 修改密码
      changePassword() {
        const _this = this.$refs.PasswordDialog;
        _this.visible = true
      }
    }
  }
</script>

<style lang="scss">
  .person {
    .personInfo li {
      border-bottom: 1px solid #f0f3f4;
      border-top: 1px solid #f0f3f4;
      padding: 11px 0;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
    }

    .el-avatar > img {
      width: 100%;
    }
  }
</style>
