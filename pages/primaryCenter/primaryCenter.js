// pages/primaryCenter/primaryCenter.js
import request from '../../utils/request.js';
import { DateDifference} from "../../utils/dateUtil.js"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
 
  data: {
    activeNames: [0,1,2,3,4,5],
    buycount: 999564,
    avatarUrl:"../../images/avatar.png",
    userInfo:{
      nickName:"黑卡用户"
    }
  },
  onChange(event) {
    console.log(event)
    this.setData({
      activeNames: event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res.userInfo)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
              })
            }
          })
        }
      }
    })
    let jwt = app.globalData.jwt;
    if (!jwt.isValid()) { // 如果未登录或者token失效，则跳转登录。
      app.globalData.logout();
      return
    }
    var serviceSet=[];
    var userid=jwt.payload.userId
        // request.httpFind("/api/server_mypackages",{userid:320})
    request.httpFind("/api/server_mypackages", { userid: userid || 320 })
    .then(res=>{
      if(!res.data.data&&res.data.data[0]){
        return 
      }
      console.log(res.data.data)

      serviceSet = res.data.data[0];
      var endTime=serviceSet.endTime.slice(0,10)
      var startTime=serviceSet.startTime.slice(0,10)

      var today = new Date()
      var Year=today.getFullYear();
      var month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 :"0"+(today.getMonth() + 1);
      var date=today.getDate()
      today=Year+"-"+month+"-"+date

      var deno = DateDifference(startTime, endTime)
      var num = DateDifference(endTime,today)
      var remaining=deno-num>0?deno-num:0
      var progress= remaining/deno*100


      var endDate = endTime
      var cardName=serviceSet.packageName.slice(0, serviceSet.packageName.length-2)

      this.setData({ serviceSet, progress, endDate, cardName})

    })
    //隐藏转发按钮
    wx.hideShareMenu()
    app.globalData.backMinePage=true
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