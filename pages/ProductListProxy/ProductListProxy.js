// miniprogram/subPackage/pages/ProductListProxy/ProductListProxy.js
const app = getApp();
const request = require('../../utils/request.js');


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
      } else {
        this.getDirectoryData().then(() => {
          wx.redirectTo({
            url: '/subPackage/pages/productList/productList',
          })
        });
      }
    } else {
      app.globalData.logout(app.globalData.getCurrentURL(this));
      return;
    }
  },

  getDirectoryData(callback) {
    return request.httpFind("/api/commodityCatalogue", {
        parentId: 0,
        isDisabled: 0
      })
      .then(res => {
        const primaryDirectoryData = this.initDirectoryData(res.data.data);
        app.globalData.primaryDirectoryData = primaryDirectoryData;
        return Promise.resolve();
      });
  },
  initDirectoryData(directoryResource) {
    const directoryArray = []
    for (var i = 0; i < directoryResource.length; i++) {
      var directoryItem = directoryResource[i]
      if (directoryItem.childSort && JSON.parse(directoryItem.childSort).length != 0) {
        directoryItem['index'] = i
        directoryItem['idValue'] = 'view' + i
        directoryArray.push(directoryItem)
      }
    }
    return directoryArray;
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