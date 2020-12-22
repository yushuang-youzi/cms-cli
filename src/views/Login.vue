<template>
  <div class="login-view">
    <div class="login-win">
      <img id="loginLogo" :src="loginLogo" />
      <p id="loginTitle">运营后台管理系统</p>
      <div class="login-actions">
        <el-input
          class="login-input"
          placeholder="帐号"
          prefix-icon="el-icon-user"
          v-model="account"
          autofocus="true"
        ></el-input>
        <el-input
          class="login-input"
          placeholder="密码"
          prefix-icon="el-icon-lock"
          @keyup.enter.native="login"
          v-model="password"
          style="margin: 20px 0"
          show-password
        ></el-input>
        <div style="height: 20px">
          <p class="warn-text clearfix">{{ warningText }}</p>
          <el-checkbox class="save-pass clearfix" v-model="savePass"
            >记住密码</el-checkbox
          >
        </div>
        <el-button class="login-btn" type="primary" @click="login"
          >登录</el-button
        >
      </div>
    </div>
    <p id="copyright">copyright © ️2019 仟寻时代</p>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "login",
  data() {
    return {
      account: "",
      password: "",
      savePass: false,
      warningText: "",
      loginLogo: require("../assets/images/login_logo.png"),
    };
  },
  methods: {
    login() {
      if (!this.account) {
        this.warningText = "帐号不能为空";
      } else if (!this.password) {
        this.warningText = "密码不能为空";
      } else {
        this.warningText = "";
        // 记住密码
        if (this.savePass) {
          localStorage.setItem("account", this.account);
          localStorage.setItem("password", this.password);
        } else {
          localStorage.setItem("account", "");
          localStorage.setItem("password", "");
        }
        let loginParams = {
          username: this.account,
          password: this.password,
        };
        Vue.http
          .post("console/login", loginParams)
          .then((rs) => {
            console.log(rs.data);
            localStorage.setItem("uid", rs.data.data.user.uid);
            localStorage.setItem("userName", rs.data.data.user.nick_name);
            // this.savePermissions(rs.data.data.permissions)
            this.$router.push("/");
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    // savePermissions(permissions) {
    //   permissions.forEach((item) => {
    //     switch (item.permissions) {
    //       case 'audit':
    //         this.$set(item, 'children', [
    //           {
    //             name: '审核用户新头像',
    //             path: '/AvatarAudit',
    //           },
    //           {
    //             name: '审核新信件',
    //             path: '/MailAudit',
    //           },
    //           {
    //             name: '审核新帖子',
    //             path: '/FeedAudit',
    //           },
    //           {
    //             name: '审核评论配图',
    //             path: '/CommentAudit',
    //           },
    //         ])
    //         this.$set(
    //           item,
    //           'iconSrc',
    //           require('../assets/images/menu/audit-icon.png')
    //         )
    //         break
    //       case 'user_manager':
    //         this.$set(item, 'children', [
    //           {
    //             name: '搜索用户',
    //             path: '/UserSearch',
    //           },
    //           {
    //             name: '用户举报记录',
    //             path: '/UserReport',
    //           },
    //           {
    //             name: '已封禁用户',
    //             path: '/UserForbidden',
    //           },
    //           {
    //             name: '查询验证码',
    //             path: '/UserCaptcha',
    //           },
    //         ])
    //         this.$set(
    //           item,
    //           'iconSrc',
    //           require('../assets/images/menu/user-icon.png')
    //         )
    //         break
    //       case 'letter_manager':
    //         this.$set(item, 'children', [
    //           {
    //             name: '查找信件',
    //             path: '/MailSearch',
    //           },
    //         ])
    //         this.$set(
    //           item,
    //           'iconSrc',
    //           require('../assets/images/menu/mail-icon.png')
    //         )
    //         break
    //       case 'stamp_manager':
    //         this.$set(item, 'children', [
    //           {
    //             name: '分组管理',
    //             path: '/StampCategory',
    //           },
    //           {
    //             name: '邮票管理',
    //             path: '/StampManage',
    //           },
    //         ])
    //         this.$set(
    //           item,
    //           'iconSrc',
    //           require('../assets/images/menu/stamp-icon.png')
    //         )
    //         break
    //       case 'feed_manager':
    //         this.$set(item, 'children', [
    //           {
    //             name: '搜索帖子',
    //             path: '/FeedSearch',
    //           },
    //           {
    //             name: '被举报帖子',
    //             path: '/FeedReport',
    //           },
    //         ])
    //         this.$set(
    //           item,
    //           'iconSrc',
    //           require('../assets/images/menu/feed-icon.png')
    //         )
    //         break
    //       case 'theme_manager':
    //         this.$set(item, 'children', [
    //           {
    //             name: '搜索主题',
    //             path: '/ThemeSearch',
    //           },
    //           {
    //             name: '推荐主题',
    //             path: '/ThemeRecommend',
    //           },
    //         ])
    //         this.$set(
    //           item,
    //           'iconSrc',
    //           require('../assets/images/menu/theme-icon.png')
    //         )
    //         break
    //       case 'subject_manager':
    //         this.$set(item, 'children', [
    //           {
    //             name: '搜索话题',
    //             path: '/TagSearch',
    //           },
    //           {
    //             name: '推荐话题',
    //             path: '/TagRecommend',
    //           },
    //         ])
    //         this.$set(
    //           item,
    //           'iconSrc',
    //           require('../assets/images/menu/tag-icon.png')
    //         )
    //         break
    //       case 'notify_service':
    //         this.$set(item, 'children', [
    //           {
    //             name: '通知列表',
    //             path: '/ServiceList',
    //           },
    //           {
    //             name: '意见反馈',
    //             path: '/FeedbackList',
    //           },
    //         ])
    //         this.$set(
    //           item,
    //           'iconSrc',
    //           require('../assets/images/menu/service-icon.png')
    //         )
    //         break
    //       case 'data_statistics':
    //         this.$set(item, 'children', [
    //           {
    //             name: '用户分析',
    //             path: '/UserStat',
    //           },
    //           {
    //             name: '邮箱分析',
    //             path: '/MailStat',
    //           },
    //           {
    //             name: '帖子分析',
    //             path: '/FeedStat',
    //           },
    //           {
    //             name: '主题/话题分析',
    //             path: '/ThemeSubjectStat',
    //           },
    //           {
    //             name: '派对分析',
    //             path: '/PartyStat',
    //           },
    //         ])
    //         this.$set(
    //           item,
    //           'iconSrc',
    //           require('../assets/images/menu/stat-icon.png')
    //         )
    //         break
    //       case 'config_manager':
    //         this.$set(item, 'children', [
    //           {
    //             name: '配置运营帐号',
    //             path: '/AccountConfig',
    //           },
    //           {
    //             name: '配置敏感词库',
    //             path: '/CensorConfig',
    //           },
    //           {
    //             name: '配置应用设置',
    //             path: '/AppConfig',
    //           },
    //         ])
    //         this.$set(
    //           item,
    //           'iconSrc',
    //           require('../assets/images/menu/config-icon.png')
    //         )
    //         break
    //     }
    //   })
    //   permissions.sort((a, b) => a.position - b.position)
    //   localStorage.setItem('permissions', JSON.stringify(permissions))
    // },
  },
  mounted() {
    this.account = localStorage.getItem("account");
    this.password = localStorage.getItem("password");
    if (this.account || this.password) {
      this.savePass = true;
    }
  },
};
</script>

<style scoped lang="less">
.login-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  z-index: 99;

  .login-win {
    width: 450px;
    height: 400px;
    position: absolute;
    top: 50%;
    margin-top: -200px;
    left: 50%;
    margin-left: -225px;
    background-color: rgba(0, 33, 64, 0.85);
    text-align: center;

    .login-actions {
      width: 360px;
      height: 200px;
      margin: 50px auto;

      .login-input {
        font-size: 16px;
      }

      .warn-text {
        float: left;
        width: fit-content;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #ff5252;
      }

      .save-pass {
        width: auto;
        float: right;
        color: rgba(255, 255, 255, 0.85);
      }

      .login-btn {
        width: 100%;
        margin-top: 20px;
      }
    }
  }

  #loginTitle {
    width: auto;
    height: 24px;
    line-height: 24px;
    font-size: 20px;
    font-family: PingFangSC-Medium;
    color: #fff;
    margin-top: 20px;
  }

  #loginLogo {
    width: 100px;
    height: 36px;
    margin: 30px auto 0;
  }

  #copyright {
    width: 150px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: rgba(0, 0, 0, 0.45);
    position: absolute;
    bottom: 50px;
    left: 50%;
    margin-left: -75px;
  }
}
</style>
