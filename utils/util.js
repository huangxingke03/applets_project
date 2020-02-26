// import _Promise from 'bluebird';
import {
     weekArr
} from './constDict.js'
import {
     Url
} from './enum.js';

import JwtPlayload from './jwt-payload.js';

const app = getApp();
/**
 * @param {Function} fun 接口
 * @param {Object} options 接口参数
 * @returns {Promise} Promise对象
 */
// function Promise(fun, options) {
//   options = options || {};
//   return new _Promise((resolve, reject) => {
//     if (typeof fun !== 'function') {
//       reject();
//     }
//     options.success = resolve;
//     options.fail = reject;
//     fun(options);
//   });
// }

/**
 * 手势库
 */
function touchstart(e, _this) {
     const t = e.touches[0],
          startX = t.clientX,
          startY = t.clientY;
     _this.setData({
          'gesture.startX': startX,
          'gesture.startY': startY,
          'gesture.out': true
     })
}

/**
 * 左滑
 * @returns {boolean} 布尔值
 */
function isLeftSlide(e, _this) {
     if (_this.data.gesture.out) {
          const t = e.touches[0],
               deltaX = t.clientX - _this.data.gesture.startX,
               deltaY = t.clientY - _this.data.gesture.startY;

          if (deltaX < -20 && deltaX > -40 && deltaY < 8 && deltaY > -8) {
               _this.setData({
                    'gesture.out': false
               });
               return true;
          } else {
               return false;
          }
     }
}

/**
 * 右滑
 * @returns {boolean} 布尔值
 */
function isRightSlide(e, _this) {
     if (_this.data.gesture.out) {
          const t = e.touches[0],
               deltaX = t.clientX - _this.data.gesture.startX,
               deltaY = t.clientY - _this.data.gesture.startY;

          if (deltaX > 20 && deltaX < 40 && deltaY < 8 && deltaY > -8) {
               _this.setData({
                    'gesture.out': false
               })
               return true;
          } else {
               return false;
          }
     }
}

function getBase64ImgUrl(photoType, coverPhoto) {
     return photoType && coverPhoto && photoType.length > 0 && coverPhoto.length > 0 ? `data:${photoType};base64${coverPhoto}` : '';
}

function addFileUrl(fileName) {
     let url = getApp().globalData.domain
     return fileName && fileName.length > 0 ? `${url}/file/${fileName}` : '';
}

/**
 * 获取一段时间内的 星期 和 号 信息
 * @returns {x} 天数
 * @returns {today} 开始计算的日期，默认当前
 */
function getDateData(x, today = new Date()) {
     var days = x;
     var weekData = [];
     let dayTime = 24 * 60 * 60 * 1000;
     // 表示日期向前还是向后推算
     let vector = days / (Math.abs(days));
     let y = today.getFullYear();
     let m = today.getMonth();
     let d = today.getDate();
     // console.log(x, vector);
     for (let i = 0; i < Math.abs(days); i++) {
          let date = new Date(y, m, (d + i * vector));
          let da = {
               weekName: weekArr[date.getDay()],
               monthDate: date.getMonth() + 1 + '-' + date.getDate(),
               date: date.dateFormat("yyyy-MM-dd 00:00:00")
          }
          // 日期 向前推时 当前日期在最后，保证数组始终按照时间先后顺序排序
          vector >= 0 ? weekData.push(da) : weekData.unshift(da);
     }
     return weekData;
}

/**
 * 方法作用：【格式化时间】
 * 使用方法
 * 示例：
 *      使用方式一：
 *      var now = new Date();
 *      var nowStr = now.dateFormat("yyyy-MM-dd hh:mm:ss");
 *      使用方式二：
 *      new Date().dateFormat("yyyy年MM月dd日");
 *      new Date().dateFormat("MM/dd/yyyy");
 *      new Date().dateFormat("yyyyMMdd");
 *      new Date().dateFormat("yyyy-MM-dd hh:mm:ss");
 * @param format {date} 传入要格式化的日期类型
 * @returns {2015-01-31 16:30:00}
 */
Date.prototype.dateFormat = function(format) {
     var o = {
          "M+": this.getMonth() + 1, //month
          "d+": this.getDate(), //day
          "h+": this.getHours(), //hour
          "m+": this.getMinutes(), //minute
          "s+": this.getSeconds(), //second
          "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
          "S": this.getMilliseconds() //millisecond
     }
     if (/(y+)/.test(format)) {
          format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
     }
     for (var k in o) {
          if (new RegExp("(" + k + ")").test(format)) {
               format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
          }
     }
     return format;
}
/***********************************************************************
 *                           日期时间工具类                            *
 *                     注：调用方式，deteUtil.方法名                   *
 * ********************************************************************/
var dateUtil = {
     /*
      * 方法作用：【取传入日期是星期几】
      * 使用方法：dateUtil.nowFewWeeks(new Date());
      * @param date{date} 传入日期类型
      * @returns {星期四，...}
      */
     nowFewWeeks: function(date) {
          if (date instanceof Date) {
               var dayNames = new Array("星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
               return dayNames[date.getDay()];
          } else {
               return "Param error,date type!";
          }
     },
     /*
      * 方法作用：【字符串转换成日期】
      * 使用方法：dateUtil.strTurnDate("2010-01-01");
      * @param str {String}字符串格式的日期，传入格式：yyyy-mm-dd(2015-01-31)
      * @return {Date}由字符串转换成的日期
      */
     strTurnDate: function(str) {
          var re = /^(\d{4})\S(\d{1,2})\S(\d{1,2})$/;
          var dt;
          if (re.test(str)) {
               dt = new Date(RegExp.$1, RegExp.$2 - 1, RegExp.$3);
          }
          return dt;
     },
     /*
      * 方法作用：【计算2个日期之间的天数】
      * 传入格式：yyyy-mm-dd(2015-01-31)
      * 使用方法：dateUtil.dayMinus(startDate,endDate);
      * @startDate {Date}起始日期
      * @endDate {Date}结束日期
      * @return endDate - startDate的天数差
      */
     dayMinus: function(startDate, endDate) {
          if (startDate instanceof Date && endDate instanceof Date) {
               var days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
               return days;
          } else {
               return "Param error,date type!";
          }
     },
     dateToString: function(now) {
          var year = now.getFullYear();
          var month = (now.getMonth() + 1).toString();
          var day = (now.getDate()).toString();
          var hour = (now.getHours()).toString();
          var minute = (now.getMinutes()).toString();
          var second = (now.getSeconds()).toString();
          if (month.length == 1) {
               month = "0" + month;
          }
          if (day.length == 1) {
               day = "0" + day;
          }
          if (hour.length == 1) {
               hour = "0" + hour;
          }
          if (minute.length == 1) {
               minute = "0" + minute;
          }
          if (second.length == 1) {
               second = "0" + second;
          }
          var dateTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
          return dateTime;
     },
     /*'yyyy-MM-dd HH:mm:ss'格式的字符串转日期*/
     stringToDate: function(str) {
          var tempStrs = str.split(" ");
          var dateStrs = tempStrs[0].split("-");
          var year = parseInt(dateStrs[0], 10);
          var month = parseInt(dateStrs[1], 10) - 1;
          var day = parseInt(dateStrs[2], 10);
          var timeStrs = tempStrs[1].split(":");
          var hour = parseInt(timeStrs[0], 10);
          var minute = parseInt(timeStrs[1], 10);
          var second = parseInt(timeStrs[2], 10);
          var date = new Date(year, month, day, hour, minute, second);
          return date;
     }
};

/**
 * 获取对象中任意层级的字段数据，当字段找不到时，可能返回null
 * @arr {Array} 描述所取值字段在对象中的层次关系
 * @obj {Object} 被取值对象
 * 例如： 取res.data.data[0].staffName
 * console.log('51 ', getDa(res,['data', 'data', 0,'staffName']));
 */
const getObjectValue = (obj, arr) => arr.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, obj)

/**
 * 解析token获取openId
 */
function getOpenId() {
     var openId = null;
     var token = wx.getStorageSync("token")
     console.log("token", token)
     //获取缓存token解析得到openid
     let jwt = new JwtPlayload(token)
     if (jwt.isValid() && jwt.payload && jwt.payload.openid) {
          console.log("openid", jwt.payload.openid)
          openId = jwt.payload.openid
     }
     return openId
}

/**
 * 同步形式 清除本地 Storage
 * 当获取token失败时可调用，从而强制进行重新认证
 */
function clearMyStorage() {
     try {
          wx.clearStorageSync()
          console.log('====>>> clearStorage 成功');
     } catch (e) {
          console.log('====>>> clearStorage 失败', e);
     }
}

/**
 * 获取 有效的token
 * 如未获取到或无效 重定向 进行认证
 */
function getValidToken() {
     let token = wx.getStorageSync('token');
     if (token) {
          let jwt = new JwtPlayload(token);
          if (jwt.isValid()) {
               return token;
          }
     }
     wx.redirectTo({
          url: '/pages/auth/auth',
     })
     return null;
}
/**
 * 验证手机号
 */
function validatemobile(mobile="") {
     if (mobile.length == 0) {
          wxToast('请输入手机号！')
          return false;
     }
     if (mobile.length != 11) {
          wxToast('手机号长度有误！')
          return false;
     }
     var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
     if (!myreg.test(mobile)) {
          wxToast('手机号有误！')
          return false;
     }
     return true;
}
/**
 * 验证身份证号
 */
function validateIdcard(idCard) {
     if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard))) {
          console.log("身份证号==validateIdcard==>", idCard)
          wxToast('身份证号码有误')
          return false;
     }
     return true;
}

function wxToast(toastMesage) {
     wx.showToast({
          title: toastMesage,
          duration: 2000,
          icon: 'none'
     });
}
/**
 * 数组转 星期文字数组
 * [ 2,1,6,4,7] ==>> [ '周一至周二', '周四', '周六至周日' ]
 */
function arrToWeekString(arr) {
  let weekArr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  let weekStrings = [];
  // 从小到大排序
  arr.sort((a, b) => {
    return a - b;
  });
  let dict = {};
  let convertDict = [];// 转换字典
  arr.map((k, v) => {
    let dayObj = { num: k };
    if (k + 1 === arr[v + 1]) {
      dict[k] = true;
      dayObj['tag'] = true;
    } else if (!dict[k]) {
      dict[k] = false;
      dayObj['tag'] = false;
    }
    convertDict.push(dayObj);
  });
  let continuousTag = false;// 星期连续标记
  let dayStr;
  for (let i = 0; i < convertDict.length; i++) {
    let k = convertDict[i];
    if (!continuousTag) {
      dayStr = weekArr[k.num - 1];
    }
    if (k.tag) {
      if (convertDict[i + 1]) {
        if (!convertDict[i + 1].tag) {
          dayStr += `至${weekArr[convertDict[i + 1].num - 1]}`;
          weekStrings.push(dayStr);
          continuousTag = false;
        } else {
          continuousTag = true;
          continue;
        }
      }
    } else {
      if (!convertDict[i - 1] || (!convertDict[i - 1].tag)) {
        weekStrings.push(dayStr);
      }
    }
  }
  // console.log('=====>>> weekStrings ', weekStrings);
  return weekStrings;
}
module.exports = {
     // Promise: Promise,
    Gesture: {
      touchstart: touchstart,
      isLeftSlide: isLeftSlide,
      isRightSlide: isRightSlide
    },
    getBase64ImgUrl: getBase64ImgUrl,
    getDateData: getDateData,
    getObjectValue: getObjectValue,
    addFileUrl: addFileUrl,
    getOpenId: getOpenId,
    clearMyStorage: clearMyStorage,
    getValidToken: getValidToken,
    validatemobile: validatemobile,
    validateIdcard: validateIdcard,
    wxToast: wxToast,
    arrToWeekString: arrToWeekString,
}