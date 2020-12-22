/*
 * 封装http请求工具
 * 封装签名功能
 */
"use strict";
let axios = require("axios");
let md5 = require("./md5.min");

import { Message } from "element-ui";

export const setCookie = (name, value) => {
  document.cookie = name + "=" + escape(value) + "; path=/";
};

export const getCookie = (name) => {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(name + "=");
    if (c_start != -1) {
      c_start = c_start + name.length + 1;
      let c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
};

const delCookie = (name) => {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
};

export const signature = async function(
  param,
  secret = process.env.VUE_APP_BASE_SECRET
) {
  let session = getCookie("session");

  return new Promise((resolve) => {
    let obj = {};

    let time = new Date();
    let ts = time.getTime();

    if (session.length > 0) {
      secret = getCookie("secret");
      obj = Object.assign({}, new Object(param), { session }, { ts: ts });
    } else {
      obj = Object.assign({}, new Object(param), { ts: ts });
    }

    const sortedKeys = Object.keys(obj)
      .sort()
      .reverse();
    let origin = "";
    for (let i = 0; i < sortedKeys.length; i++) {
      const value = obj[sortedKeys[i]];
      if (typeof value === "string") {
        origin += value + ":";
      } else {
        origin += JSON.stringify(value) + ":";
      }
    }

    let sig = md5(origin + secret);
    sig = JSON.stringify(Object.assign({}, obj, { sig }));

    resolve(sig);
  });
};

// 请求拦截器
axios.defaults.headers = { "Content-type": "application/json" };
axios.interceptors.request.use(
  async function(config) {
    // 在发送post请求之前，对参数作签名
    if (config.method === "post") {
      let data = await signature(config.data);
      config.data = data;
      return config;
    } else {
      console.log("method is not post");
    }
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  function(response) {
    let data = response.data.data;
    console.log(response.config.url + " res:", response);
    if (response.config.url.indexOf("logout") !== -1) {
      console.log("LOGOUT");
      delCookie("session");
      delCookie("secret");
    }
    if (response.data.code == 0) {
      if (data.session && data.secret) {
        setCookie("session", data.session);
        setCookie("secret", data.secret);
      }
      return response;
    } else if (response.data.code == 20) {
      alert(response.data.msg);
      delCookie("session");
      delCookie("secret");
    } else {
      console.log("Handle Error", response);
      Message({
        message: response.data.msg,
        type: "error",
        duration: 2000,
      });
      return Promise.reject(error);
    }
  },
  function(error) {
    console.log("Handle Error", error);
    Message({
      message: error,
      type: "error",
      duration: 2000,
    });
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axios;
