// miniprogram/subpackage1/pages/yzGoodsProxy.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.jwt != null) {
      if (!app.globalData.jwt.isValid()) {
        app.globalData.logout(app.globalData.getCurrentURL(this));
        return;
      }
    } else {
      app.globalData.logout(app.globalData.getCurrentURL(this));
      return;
    }
    let sharePageUrl = encodeURIComponent(app.globalData.getCurrentURL(this));

    let shareImageUrl;
    try {
      shareImageUrl = app.globalData.tempFilePaths[options.alias];
    } catch (e) {
      console.error(e);
    }
    let homePageUrl = encodeURIComponent('/pages/index/index');
    //购物车页面
    let cartPageUrl = encodeURIComponent('/subPackage2/pages/youZancart/youZancart');
    let url = "plugin://yzTradePlugin/goods-detail?goodsId=" + options.alias + "&openId=" + app.globalData.jwt.payload.openid + "&shopId=" + app.globalData.shopId + "&appId=" + app.globalData.appId + "&showShare=true&shareImage=true&sharePageUrl=" + sharePageUrl + "&shareImage=" + shareImageUrl + "&showHome=true&homeRedirectType=redirectTo&homePageUrl=" + homePageUrl + "&showCart=true&cartRedirectType=redirectTo&cartPageUrl=" + cartPageUrl;
    console.log("订单列表==>", url);
    try {
      wx.redirectTo({
        url: url
      })
    } catch (error) {
      console.log('载入分包后，再次打开订单失败。');
    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // let title = "小优商城购物车"
    // return {
    //   title: title,
    //   path: app.globalData.getCurrentURL(this) + "&shopId=" + app.globalData.shopId + "&appId=" + app.globalData.appId + "&openid=" + app.globalData.jwt.payload.openid + "&aliasData=" + this.data.aliasValue
    // };
  }
})