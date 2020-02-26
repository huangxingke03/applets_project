// pages/auth/authPhone.js
import request from '../../utils/request.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否返回获取赠送套餐页面
    backGetGiftTag: false
  },
  doLogin: function(e) {

    var encryptedData = "",
      iv = "";
    let jwt = app.globalData.jwt;
    let token = jwt.token;

    if (e.detail.errMsg === "getPhoneNumber:ok") {
      encryptedData = e.detail.encryptedData;
      iv = e.detail.iv;
      var code = this.data.code
      console.log("code", code,
        "iv", iv,
        "encryptedData", encryptedData)
      request.pass({
        url: app.globalData.domain + "/api/server_setphonenumber?iv=" + iv + "&encryptedData=" + encryptedData + "&code=" + code + "&uid=" + jwt.payload.userId,
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": token
        },
      }).then((res) => {
        console.log(res)
        if (this.data.backGetGiftTag) {
          this.setData({
            backGetGiftTag: false
          })
          //返回获取赠送套餐页面
          wx.navigateBack({
            delta: 1,
          })
        } else { //返回首页
          wx.redirectTo({
            url: '../index/index',
          });
        }
      })
    }
  },
  cancel: ()=>{
    wx.navigateBack({
      
    });
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.login({
      success(res) {
        let code = res.code;
        that.setData({
          code
        })
      }
    })
    //是否从获取赠送套餐页面入口进入
    if (options.fromGetGiftPackage) {
      console.log('fromGetGiftPackage', options.fromGetGiftPackage)
      this.setData({
        backGetGiftTag: true
      })
    }
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
    return getApp().globalData.defaultShareObject;
  }
})