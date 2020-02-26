//app.js
const JwtPayload = require('./utils/jwt-payload.js');

const domain = 'https://iad-dev.lkimt.com';
// const domain = 'https://iad.lkimt.com';
App({
  onLaunch: function() {
    let that = this;
    let localToken = wx.getStorageSync('token');
    let jwt = new JwtPayload(localToken);
    var isIphoneX;
    wx.getSystemInfo({
      success: function success(_ref) {
        var model = _ref.model,
          sh = _ref.screenHeight,
          sw = _ref.screenWidth;
        isIphoneX = sh / 18 - sw / 9 > 0 ? true : false;
        console.log(isIphoneX)
      }
    });
    this.globalData = {
      //appId 商铺id 接入youzan商城商品插件使用
      appId: 'wx621cfec88ca2e74c',
      shopId: '66089736',
      jwt,
      isIphoneX,
      domain,
      tempFilePaths: new Map(), // 使用键值对形式存放wx.downloadFile res.tempFilePath，这样你可以在它下载完成之后在跨页面调用。
      /**
       * 登录用户
       */
      login: (token) => {
        wx.setStorageSync('token', token);
        let newjwt = new JwtPayload(token);
        that.globalData.jwt = newjwt;
        return newjwt.isValid();
      },
      /**
       * 注销登出用户
       */
      logout: (pendingURL) => {
        if (pendingURL) {
          this.globalData.pendingURL = pendingURL;
        }
        console.log("logout");
        wx.removeStorageSync('token');
        that.globalData.jwt = null;
        wx.redirectTo({
          url: '/pages/auth/auth',
        });
      },
      /**
       * 获取当前页面路径
       */
      getCurrentURL: (pageInstance) => {
        try {
          let url = pageInstance.route + '?';
          let o = pageInstance.options
          Object.keys(o).forEach(key => {
            url += key + '=' + o[key] + '&'
          });
          let remove = url.lastIndexOf('&');
          if (remove === url.length - 1) {
            url = url.substring(0, remove);
          }
          return url + "&isShare=true";
        } catch (err) {
          console.error(err);
          return undefined
        }
      },
      marriage: ['未婚', '已婚', '离婚', '丧偶', '其他'],
      gender: ['男', '女'],
      yesNo: ['是', '不是'],
      faith: ['基督教', '伊斯兰教', '佛教', '其他'],
      unknownIdentity: ['不知道患者个人身份', '不知道患者个人身份'],
      identityCredibility: ['缺少社会保险号码', '缺少出生日期', '缺少地址', '个人姓名是一个化名'],
      relationshipType: ['父母', '配偶', '子女', '其他'],
      patientLiving: ['患者已故', '患者存活'],
      defaultShareObject: {
        title: "小优家庭医生",
        path: "/pages/index/index"
      },
      giftTag: false,
      saveView: '',
      primaryDirectoryData: [],
      extraData: {
        config: {
          scene: {
            afterPay: {
              showReturn: !0,
              replaceOrderDetailBtnWithReturnBtn: !0
            }
          }
        }
      },
      storeInfosArray: [],
      newsArray: [],
      pageChartArray: [],
      staffArray:[],
      /**
       * 退出登录后再次回到首页
       */
      againBackIndex: () => {
        wx.removeStorageSync('token');
        that.globalData.jwt = null;
        wx.reLaunch({
          url: '/pages/index/index',
        });
      },
      myModuleShow:false,
      //返回首页我的模块
    backMinePage:false,
    }
  }
});
