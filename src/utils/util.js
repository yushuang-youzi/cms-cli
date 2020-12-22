/*
 * 获取url带有的参数
 */
import * as qiniu from "qiniu-js";
import Vue from "vue";

// 上传图片至七牛
export const addNewImage = (files) => {
  return new Promise((resolve, reject) => {
    console.log("file", files);
    for (let i = 0; i < files.length; i++) {
      Vue.http.post("/qiniu_token").then((res) => {
        if (+res.data.code === 0) {
          console.log("qiniu-token", res);
          let file = files[i];
          let key = randomStr();
          let config = {
            useCdnDomain: true,
            region: qiniu.region.z1,
          };
          let putExtra = {
            fname: file.name,
            params: {},
          };
          let token = null;
          if (file.type.indexOf("image") > -1) {
            token = res.data.data.image_token;
          } else if (file.type.indexOf("video") > -1) {
            token = res.data.data.video_token;
          } else if (file.type.indexOf("audio") > -1) {
            token = res.data.data.voice_token;
          }
          let observable = qiniu.upload(file, key, token, putExtra, config);
          let observer = {
            next(rs) {
              console.log("next", rs);
            },
            error(err) {
              console.log("err", err);
              reject(err);
            },
            complete(com) {
              console.log("complete", com);
              resolve(com);
            },
          };
          observable.subscribe(observer);
        }
      });
    }
  });
};
export const queryString = (key) => {
  let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }

  return null;
};

/*
 * 获取时间差值并使用适当表示
 */
export const calculateDiffTime = (start_time, end_time = Date.now()) => {
  let startTime = 0,
    endTime = 0;
  if (start_time < end_time) {
    startTime = start_time;
    endTime = end_time;
  } else {
    startTime = end_time;
    endTime = start_time;
  }

  let timeDiff = endTime - startTime;
  let year = Math.floor(timeDiff / 86400000 / 365);
  timeDiff = timeDiff % (86400000 * 365);
  let month = Math.floor(timeDiff / 86400000 / 30);
  timeDiff = timeDiff % (86400000 * 30);
  let day = Math.floor(timeDiff / 86400000);
  timeDiff = timeDiff % 86400000;
  let hour = Math.floor(timeDiff / 3600000);
  timeDiff = timeDiff % 3600000;
  let minute = Math.floor(timeDiff / 60000);
  timeDiff = timeDiff % 60000;
  let second = Math.floor(timeDiff / 1000);
  timeDiff = timeDiff % 1000;

  return 60 * hour + minute;
};

export const isReachBottom = () => {
  function getScrollTop() {
    // 考虑到浏览器版本兼容性问题，解析方式可能会不一样
    return document.documentElement.scrollTop || document.body.scrollTop;
  }

  function getWinHeight() {
    // 浏览器可见内容高度 || 浏览器所有内容高度(考虑到浏览器版本兼容性问题，解析方式可能会不一样)
    return document.documentElement.clientHeight || document.body.clientHeight;
  }

  function getScrollHeight() {
    let bodyScrollHeight = 0;
    let documentScrollHeight = 0;
    if (document.body) {
      bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    // 当页面内容超出浏览器可视窗口大小时，Html的高度包含body高度+margin+padding+border所以html高度可能会大于body高度
    return bodyScrollHeight - documentScrollHeight > 0
      ? bodyScrollHeight
      : documentScrollHeight;
  }

  const scrollTop = getScrollTop(); // 获取滚动条的高度
  const winHeight = getWinHeight(); // 一屏的高度
  const scrollHeight = getScrollHeight(); // 获取文档总高度
  if (scrollTop == 0) {
    return false;
  }
  return scrollTop >= parseInt(scrollHeight) - winHeight;
};

export const getBirthday = (num) => {
  console.log("num", num);
  num = num + "";
  let date = "";
  let month = new Array();
  month["Jan"] = 1;
  month["Feb"] = 2;
  month["Mar"] = 3;
  month["Apr"] = 4;
  month["May"] = 5;
  month["Jan"] = 6;
  month["Jul"] = 7;
  month["Aug"] = 8;
  month["Sep"] = 9;
  month["Oct"] = 10;
  month["Nov"] = 11;
  month["Dec"] = 12;
  let week = new Array();
  week["Mon"] = "一";
  week["Tue"] = "二";
  week["Wed"] = "三";
  week["Thu"] = "四";
  week["Fri"] = "五";
  week["Sat"] = "六";
  week["Sun"] = "日";
  let str = num.split(" ");
  date = str[3] + "-";
  date = date + month[str[1]] + "-" + str[2];
  return date;
};

export const getRealTime = (now, type) => {
  let time = new Date(+now); //得到：Sat Dec 02 2017 16:17:43 GMT+0800 (CST)

  let year = time.getFullYear() + "";
  let month = time.getMonth() + 1 + "";
  let date = time.getDate() + "";
  let hours = time.getHours() + "";
  let minutes = time.getMinutes() + "";
  let seconds = time.getSeconds() + "";
  month = month.length === 1 ? "0" + month : month;
  date = date.length === 1 ? "0" + date : date;
  hours = hours.length === 1 ? "0" + hours : hours;
  minutes = minutes.length === 1 ? "0" + minutes : minutes;
  seconds = seconds.length === 1 ? "0" + seconds : seconds;
  let completeTime = "";
  if (type) {
    completeTime =
      year +
      type +
      month +
      type +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
  } else {
    completeTime =
      year +
      "/" +
      month +
      "/" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
  }
  return completeTime;
};

/*
 *  秒转化成分钟/小时
 * */

export const formatSeconds = (value) => {
  let secondTime = parseInt(value); // 秒
  let minuteTime = 0; // 分
  let hourTime = 0; // 小时
  if (secondTime > 60) {
    //如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    //如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60);
    }
  }
  let result = "" + parseInt(secondTime) + "’";

  if (minuteTime > 0) {
    result = "" + parseInt(minuteTime) + ":" + result;
  }
  if (hourTime > 0) {
    result = "" + parseInt(hourTime) + ":" + result;
  }
  return result;
};

/*
 *  分钟转化成小时/天
 * */

export const formatMinute = (value) => {
  let minuteTime = parseInt(value);
  let hourTime = 0;
  let dayTime = 0;
  if (minuteTime > 60) {
    hourTime = parseInt(minuteTime / 60);
    minuteTime = parseInt(minuteTime % 60);
    if (hourTime > 24) {
      dayTime = parseInt(hourTime / 24);
      hourTime = parseInt(hourTime % 24);
    }
  }
  let result = "" + parseInt(minuteTime) + "分";

  if (hourTime > 0) {
    result = "" + parseInt(hourTime) + "小时" + result;
  }
  if (dayTime > 0) {
    result = "" + parseInt(dayTime) + "天" + result;
  }
  return result;
};

/*
 * 计算聊天消息时间戳
 * 传入chatbox参数即为显示在chatbox中的时间戳格式
 */
export const calcSnapTime = (ts, chatbox) => {
  let snapTime = "";

  let time = new Date(+ts); //得到：Sat Dec 02 2017 16:17:43 GMT+0800 (CST)
  let year = time.getFullYear() + "";
  let month = time.getMonth() + 1 + "";
  let date = time.getDate() + "";
  let hours = time.getHours() + "";
  let minutes = time.getMinutes() + "";
  month = month.length === 1 ? "0" + month : month;
  date = date.length === 1 ? "0" + date : date;
  hours = hours.length === 1 ? "0" + hours : hours;
  minutes = minutes.length === 1 ? "0" + minutes : minutes;

  let now = new Date();
  if (date == now.getDate()) {
    snapTime = hours + ":" + minutes;
  } else if (date == now.getDate() - 1) {
    snapTime = "昨天";
  } else {
    if (chatbox) {
      snapTime = month + "/" + date;
    } else {
      snapTime = month + "." + date + " " + hours + ":" + minutes;
    }
  }
  return snapTime;
};

/*
 * 判断举报类型
 * */
export const checkSpamType = (val) => {
  if (val === "发布骚扰广告") {
    return 1;
  } else if (val === "七杂骗钱") {
    return 2;
  } else if (val === "色情低俗") {
    return 3;
  } else if (val === "违法行为") {
    return 4;
  } else if (val === "其他原因") {
    return 99;
  } else {
    return 0;
  }
};

/**
 * 生成任意范围内随机数
 * 支持正数，负数，整数，小数
 * 默认范围[0, 100]
 * min: 最小值
 * max: 最大值
 * len: 小数点后位数
 */
function randomNum(min = 0, max = 100, len = 0) {
  return Number((min + (max - min) * Math.random()).toFixed(len));
}

/**
 * 生成任意长度随机字符串
 * 包含数字、大写字母、小写字母
 * len: 字符串长度
 */
function randomStr(len = 24) {
  let str = "";
  let list = "0123456789abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < len; i++) {
    let index = randomNum(0, 35);
    let word = list[index];
    if (isNaN(word) && randomNum() < 50) {
      word = word.toUpperCase();
    }
    str += word;
  }
  return str;
}

/*
 * 数字每三位加逗号
 * */

export const formatNum = (num) => {
  let str = num + "";
  let newStr = "";
  let count = 0;
  // 当数字是整数
  if (str.indexOf(".") === -1) {
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + "," + newStr;
      } else {
        newStr = str.charAt(i) + newStr;
      }
      count++;
    }
    // str = newStr + ".00"; //自动补小数点后两位
    return newStr;
  }
  // 当数字带有小数
  else {
    for (let i = str.indexOf(".") - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + "," + newStr;
      } else {
        newStr = str.charAt(i) + newStr; //逐个字符相接起来
      }
      count++;
    }
    str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
    return str;
  }
};

export const setStorage = (name, value) => {
  if (!window.localStorage) {
    alert("该浏览器不支持预览");
  } else {
    let storage = window.localStorage;
    storage[name] = JSON.stringify(value);
    console.log("storage", storage);
    return true;
  }
};
export const getStorage = (name) => {
  if (!window.localStorage) {
    alert("该浏览器不支持预览");
  } else {
    let storage = window.localStorage;
    let val = JSON.parse(storage[name]);
    return val;
  }
};

export const initTime = (duration) => {
  let min = parseInt(duration / 60);
  let sec = parseInt(duration % 60);
  if (min.toString().length == 1) {
    min = `0${min}`;
  }
  if (sec.toString().length == 1) {
    sec = `0${sec}`;
  }
  return `${min}:${sec}`;
};

export const calcDate = (date, fmt) => {
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
