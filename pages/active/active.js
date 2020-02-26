// pages/active/active.js
var app = getApp()
import request from "../../utils/request.js"
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

const message = '当前功能需要用户登录';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    jwtValue: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    var activeList = []
    var myActiveList = []
    this.setData({
      jwtValue: app.globalData.jwt
    })
    request.httpOpenFind("/static/server/zyt_activity", {
        state: 0
      })
      .then(res => {
        // console.log('所有活动',res.data.data)
        res.data.data.map(x => {
          x.startTime = x.startTime.substr(0, 10);
          x.endTime = x.endTime.substr(0, 10);
          x.coverPhoto = x.coverPhoto + '?wx_lazy=1'
          activeList.push(x)
        })
        this.setData({
          activeList,
        })
      })
    //获取已报名活动
    if (this.data.jwtValue != null) {
      if (this.data.jwtValue.isValid()) {
        request.httpFind("/api/zyt_activityRegistration", {
          uid: this.data.jwtValue.payload.userId,
          cancelled: 0
        }).then(res => {
          console.log(res)
          activeList.map(x => {
            x.startTime = x.startTime.substr(0, 10);
            x.endTime = x.endTime.substr(0, 10);
            x.coverPhoto = x.coverPhoto + '?wx_lazy=1'
            res.data.data.map(y => {
              if (y.zyt_activityId == x.id) {
                myActiveList.push(x)
              }
            })
          })
          this.setData({
            myActiveList
          })
        })
      }
    }
  },
  onChange(event) {
    if (event.detail.index == 1) { //切换到已报名活动
      if (this.data.jwtValue != null) {
        if (!this.data.jwtValue.isValid()) {
          Dialog.confirm({
            title: '登录提醒',
            message,
            confirmButtonText: "去登陆"
          });
        }
      } else {
        Dialog.confirm({
          title: '登录提醒',
          message,
          confirmButtonText: "去登陆"
        });
      }
    }
  },
  onClose(event) {
    if (event.detail === 'confirm') {
      app.globalData.logout(app.globalData.getCurrentURL(this));
    } else if (event.detail === 'cancel') {
      wx.redirectTo({
        url: '/pages/active/active',
      })
    }
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