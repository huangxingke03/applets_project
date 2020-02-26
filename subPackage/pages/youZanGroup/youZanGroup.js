// miniprogram/subpackage1/pages/youZanGroup/youZanGroup.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId: app.globalData.shopId,
    appId: app.globalData.appId,
    openId: app.globalData.jwt.payload.openid,
    extraData: app.globalData.extraData,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let jwt = app.globalData.jwt;
    if (!jwt.isValid()) { // 如果未登录或者token失效，则跳转登录。
      app.globalData.logout(app.globalData.getCurrentURL(this));
      return;
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

  }
})