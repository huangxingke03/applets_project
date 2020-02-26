// miniprogram/subPackage/pages/order_list/order_list.js
const app = getApp();
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
    let url = 'plugin://yzTradePlugin/order-list?type=all&openId=' + app.globalData.jwt.payload.openid + "&shopId=" + app.globalData.shopId + '&appId=' + app.globalData.appId;
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
    return getApp().globalData.defaultShareObject;
  }
})