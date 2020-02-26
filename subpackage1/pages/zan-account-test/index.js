const app = getApp();

Page({
  data: {
    openId: '',
    appId: '',
    shopId: '',
    showLogin: false
  },

  onLoad(options) {
    let openId = app.globalData.jwt.payload.openid;
    let shopId = app.globalData.shopId;
    let appId = app.globalData.appId;
    this.setData({
      openId: openId,
      appId: shopId,
      shopId: appId,
    });
  },

  handleButtonClick() {
    this.setData({
      showLogin: true
    });
  },

  handleSuccess(e) {
    console.log(e.detail, 'eeee');
  },

  handleFail(e) {
    console.log(e.detail, 'eeee');
  },

  handleCaptchaFail(e) {
    console.log(e.detail, 'captcha fail');
  }
});
