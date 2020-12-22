<template>
  <div id="app">
    <el-container v-if="isLogin" style="height: 100%">
      <el-menu
        class="menu-list"
        background-color="#001529"
        text-color="#ffffff"
        active-text-color="#ffffff"
        :default-active="showMenuIndex + '-' + childIndex"
        :unique-opened="true"
        @open="toggleMenu"
        :collapse="isCollapse"
      >
        <div class="menu-title">
          <div class="logo" @click="isCollapse = !isCollapse">
            <img class="logo-img" src="./assets/images/login_logo.png" alt />
          </div>
          <div class="user-info">
            <p class="info-wrap" @click="showLogout = !showLogout">
              <span class="user-name">{{ userName }}</span>
            </p>
            <transition name="el-fade-in">
              <div class="logout" v-show="showLogout" @click="logout">
                <span class="logout-text">退出登录</span>
              </div>
            </transition>
          </div>
        </div>
        <el-submenu
          class="menu"
          v-for="(item, index) in menuList"
          :key="index"
          :index="index.toString()"
        >
          <template slot="title">
            <img class="menu-icon" :src="item.iconSrc" alt />
            <span class="menu-text">{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="(one, ind) in item.children"
            :key="ind"
            :index="index + '-' + ind"
            @click="selectChildMenu(index, ind)"
          >
            <template slot="title">{{ one.name }}</template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-main class="container">
        <router-view></router-view>
      </el-main>
    </el-container>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { getCookie } from "./utils/http";

export default {
  name: "app",
  components: {},
  data() {
    return {
      // menuList: [
      //   {
      //     iconSrc: require("./assets/images/menu/audit-icon.png"),
      //     name: "审核",
      //     children: [
      //       {
      //         name: "审核用户新头像",
      //         path: "/AvatarAudit",
      //       },
      //       {
      //         name: "审核新帖子",
      //         path: "/FeedAudit",
      //       },
      //       {
      //         name: "审核大神技能",
      //         path: "/SkillAudit",
      //       },
      //       {
      //         name: "审核真人头像",
      //         path: "/FaceAudit",
      //       },
      //       // {
      //       //   name: '审核评论配图',
      //       //   path: '/CommentAudit',
      //       // },
      //     ],
      //   },
      //   {
      //     iconSrc: require("./assets/images/menu/skill-icon.png"),
      //     name: "技能管理",
      //     children: [
      //       {
      //         name: "技能分组",
      //         path: "/SkillGroup",
      //       },
      //       {
      //         name: "技能管理",
      //         path: "/SkillManage",
      //       },
      //     ],
      //   },
      //   {
      //     iconSrc: require("./assets/images/menu/theme-icon.png"),
      //     name: "任务管理",
      //     children: [
      //       {
      //         name: "任务分组",
      //         path: "/MissionGroup",
      //       },
      //       {
      //         name: "任务管理",
      //         path: "/MissionManage",
      //       },
      //     ],
      //   },
      //   {
      //     iconSrc: require("./assets/images/menu/mail-icon.png"),
      //     name: "订单管理",
      //     children: [
      //       // {
      //       //   name: '搜索订单',
      //       //   path: '/OrderSearch',
      //       // },
      //       {
      //         name: "订单申诉",
      //         path: "/OrderAppeal",
      //       },
      //     ],
      //   },
      //   {
      //     iconSrc: require("./assets/images/menu/user-icon.png"),
      //     name: "用户管理",
      //     children: [
      //       {
      //         name: "大神推荐",
      //         path: "/GodRecommend",
      //       },
      //       {
      //         name: "搜索用户",
      //         path: "/UserSearch",
      //       },
      //       {
      //         name: "用户举报记录",
      //         path: "/UserReport",
      //       },
      //       {
      //         name: "已封禁用户",
      //         path: "/UserForbidden",
      //       },
      //       // {
      //       //   name: '查询验证码',
      //       //   path: '/UserCaptcha',
      //       // }
      //     ],
      //   },
      //   {
      //     iconSrc: require("./assets/images/menu/feed-icon.png"),
      //     name: "帖子管理",
      //     children: [
      //       {
      //         name: "搜索帖子",
      //         path: "/FeedSearch",
      //       },
      //       {
      //         name: "被举报帖子",
      //         path: "/FeedReport",
      //       },
      //     ],
      //   },
      //   {
      //     iconSrc: require("./assets/images/menu/config-icon.png"),
      //     name: "提现",
      //     children: [
      //       {
      //         name: "提现列表",
      //         path: "/WithDraw",
      //       },
      //     ],
      //   },
      //   //           {
      //   //             iconSrc: require('./assets/images/menu/service-icon.png'),
      //   //             name: '客服通知',
      //   //             children: [
      //   //               {
      //   //                 name: '通知列表',
      //   //                 path: '/ServiceList',
      //   //               },
      //   //               // {
      //   //               //   name: '新建通知',
      //   //               //   path: '/CreateService',
      //   //               // },
      //   //             ],
      //   //           },
      //   //           {
      //   //             iconSrc: require('./assets/images/menu/stat-icon.png'),
      //   //             name: '数据分析',
      //   //             children: [
      //   //               {
      //   //                 name: '用户分析',
      //   //                 path: '/UserStat',
      //   //               },
      //   //               {
      //   //                 name: '邮箱分析',
      //   //                 path: '/MailStat',
      //   //               },
      //   //               {
      //   //                 name: '帖子分析',
      //   //                 path: '/FeedStat',
      //   //               },
      //   //               {
      //   //                 name: '主题/话题分析',
      //   //                 path: '/ThemeSubjectStat',
      //   //               },
      //   //             ],
      //   //           },
      //   {
      //     iconSrc: require("./assets/images/menu/config-icon.png"),
      //     name: "配置管理",
      //     children: [
      //       //               {
      //       //                 name: '配置运营帐号',
      //       //                 path: '/AccountConfig',
      //       //               },
      //       //               {
      //       //                 name: '配置敏感词库',
      //       //                 path: '/CensorConfig',
      //       //               },
      //       {
      //         name: "配置应用设置",
      //         path: "/AppConfig",
      //       },
      //     ],
      //   },
      // ],
      isCollapse: false,
      showMenuIndex: 0,
      childIndex: 0,
      isLogin: false,
      userName: "",
      showLogout: false,
      menuList: [],
    };
  },
  computed: {
    // menuList() {
    //   if (this.isLogin) {
    //     return JSON.parse(localStorage.getItem('permissions'))
    //   } else {
    //     return []
    //   }
    // },
  },
  watch: {
    $route(to) {
      let session = getCookie("session");
      this.isLogin = session.length <= 0 ? false : true;
      if (this.menuList.length > 0) {
        let path = to.path;
        this.menuList.forEach((item, index) => {
          item.children.forEach((single, ind) => {
            if (single.path === path) {
              this.showMenuIndex = index;
              this.childIndex = ind;
            }
          });
        });
      }
    },
  },
  mounted() {
    this.userName = localStorage.getItem("userName")
      ? localStorage.getItem("userName")
      : "用户名";
  },
  methods: {
    toggleMenu(index) {
      if (this.showMenuIndex == index) {
        this.showMenuIndex = -1;
      } else {
        this.showMenuIndex = index;
        let currentPath = this.$route.path;
        this.menuList[index].children[0].path == currentPath
          ? null
          : this.$router.push(this.menuList[index].children[0].path);
      }
    },
    selectChildMenu(index, ind) {
      this.showMenuIndex = index;
      this.childIndex = ind;
      let currentPath = this.$route.path;
      this.menuList[index].children[ind].path == currentPath
        ? null
        : this.$router.push(this.menuList[index].children[ind].path);
    },
    logout() {
      Vue.http.post("console/logout", {}).then(() => {
        this.$router.push("/login");
        // localStorage.removeItem('permissions')
        this.showLogout = false;
      });
    },
  },
};
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  min-width: 1080px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Light, Avenir, Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1a1a1a;
  background: #f0f2f5;

  .container {
    flex: 1;
    height: 100%;
    position: relative;
    background: #f0f2f5;
    padding: 0 !important;
  }

  .menu-list:not(.el-menu--collapse) {
    width: 201px;
    overflow-y: auto;
  }

  .menu-title {
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    background: #002140;

    .logo {
      width: 80px;
      height: 60px;
      cursor: pointer;

      .logo-img {
        width: 50px;
        height: 18px;
        margin-top: 20px;
        margin-left: 10px;
      }
    }

    .user-info {
      flex: 1;
      position: relative;
      margin: 0 10px;

      .info-wrap {
        float: right;
        cursor: pointer;

        .user-name {
          line-height: 60px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-family: PingFangSC-Medium;
          vertical-align: middle;
          text-align: right;
          word-wrap: break-word;
        }
      }

      .logout {
        position: absolute;
        left: 20px;
        top: 45px;
        width: 95px;
        height: 50px;
        background: url("./assets/images/topBar/logout-bg.png") no-repeat center;
        background-size: 100%;
        cursor: pointer;
        z-index: 9999;

        .logout-text {
          position: absolute;
          bottom: 13px;
          left: 20px;
          font-size: 14px;
          color: #1a1a1a;
          cursor: pointer;
        }
      }
    }
  }

  .menu {
    .menu-icon {
      width: 14px;
      height: 14px;
      vertical-align: middle;
    }

    .menu-text {
      font-size: 14px;
      color: #ffffff;
      vertical-align: middle;
      margin-left: 15px;
    }
  }

  .el-menu-item,
  .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }

  .el-submenu.is-active .el-submenu__title {
    background-color: #1890ff !important;
  }

  .el-menu-item.is-active {
    background-color: rgba(255, 255, 255, 0.3) !important;
  }
}

.el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.3) !important;
}

.page-title {
  font-size: 20px;
  color: #000000;
  font-family: PingFangSC-Medium;
}

.filter-item {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  vertical-align: middle;
  font-size: 14px;
  font-family: PingFang-SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 10px 10px;
}

.pop-text {
  line-height: 22px;
  font-size: 14px;
  font-family: PingFangSC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
}

// 处理input type = number的上下箭头
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: textfield;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.page-wrap {
  position: relative;
  width: 100%;
  height: 100%;

  .table-part {
    width: 100%;
    min-width: 920px;
    position: absolute;
    top: 110px;
    bottom: 10px;
    background: #ffffff;
    overflow: auto;
    padding: 0 20px;

    .batch-btns {
      margin-top: 20px;
    }

    .table {
      position: static !important;
      padding: 20px 0 !important;
      overflow: hidden !important;
    }

    .table-title {
      height: 22px;
      line-height: 22px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      margin-top: 20px;
      margin-left: 10px;
    }

    .btns {
      .btn-left {
        position: relative;
        color: #1890ff;
        cursor: pointer;
      }

      .btn-right {
        position: relative;
        color: #1890ff;
        cursor: pointer;
        margin-left: 20px;
      }

      .pass {
        color: #67c23a;
      }
      .del {
        color: #ff4e4e;
      }

      .btn-right::after {
        position: absolute;
        top: 3px;
        left: -10px;
        width: 1px;
        height: 15px;
        background: #e4e4e4;
        content: "";
      }

      .handled {
        background: #66cf8d;
      }

      .edit-btn {
        color: rgba(0, 0, 0, 0.65);
      }

      .important {
        color: #fc493a;
      }
    }

    .online-dot,
    .outline-dot {
      display: inline-block;
      width: 5px;
      height: 5px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      background: #66cf8d;
      vertical-align: middle;
      margin-right: 8px;
    }

    .outline-dot {
      background: #ff5252;
    }

    .el-table__body-wrapper {
      overflow: visible;
    }

    .el-table__footer-wrapper,
    .el-table__header-wrapper {
      overflow: visible;
    }

    .cell {
      max-height: fit-content;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      overflow: hidden;
      text-align: center;
      overflow-y: auto;
    }

    .el-table {
      width: auto;
    }

    .el-table th > .cell {
      display: block;
    }

    .el-table,
    .el-table thead {
      color: #1a1a1a;
    }

    .el-table::before {
      height: 0;
    }

    .el-table__header-wrapper th {
      background: #fafafa;
      text-align: center;
    }

    .el-table__body-wrapper {
      overflow-x: auto;
    }

    .el-radio-group {
      margin-right: 10px;
      margin-bottom: 10px;
    }

    .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
      box-shadow: none;
      -webkit-box-shadow: none;
    }

    .el-radio-button__inner:hover,
    .el-radio-button__inner:visited {
      background: #1890ff;
      color: #ffffff;
    }
  }
}

.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: #ffffff;
}
</style>
