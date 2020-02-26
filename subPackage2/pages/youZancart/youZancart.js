// subPackage2//pages/youZancart/youZancart.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId: '',
    appId: '',
    openId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let jwt = app.globalData.jwt;
    if(jwt!=null){
      if (!jwt.isValid()) { // 如果未登录或者token失效，则跳转登录。
        app.globalData.logout(app.globalData.getCurrentURL(this));
        return;
      }
    }else{
      app.globalData.logout(app.globalData.getCurrentURL(this));
      return;
    }
    if (options.isShare) {
      this.setData({
        shopId: options.shopId,
        appId: options.appId,
        openId: options.openid
      })
    } else {
      if (app.globalData.shopId && app.globalData.appId && app.globalData.jwt.payload.openid) {
        this.setData({
          shopId: app.globalData.shopId,
          appId: app.globalData.appId,
          openId: app.globalData.jwt.payload.openid
        })
      }
    }
    //隐藏分项按钮
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // let title = "小优商城购物车"
    // return {
    //   title: title,
    //   path: app.globalData.getCurrentURL(this) + "&shopId=" + app.globalData.shopId + "&appId=" + app.globalData.appId + "&openid=" + app.globalData.jwt.payload.openid
    // };
  },
  goBuy({
    detail: {
      bookKey
    }
  }) {
    console.log('goBuy', bookKey)
    wx.navigateTo({
      url: `/subpackage1/pages/cart_trade/cart_trade?bookKey=${bookKey}`,
    });
  }
})