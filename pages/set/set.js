// pages/set/set.js
import request from '../../utils/request.js';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    zh_number: [
      "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"
    ],
    height: ["392px", "196px"]
  },
  collapse: function() {
    var maxHeight;
    var i = 1;
    this.data.data.map((item) => {
      // console.log
      if (i < item.packageinfo.length)
        i = item.packageinfo.length
    })
    var j = 1;
    this.data.data.map((item) => {
      item.packageinfo.map((itemJ) => {
        if (j < itemJ.items.length)
          j = itemJ.items.length
      })
    })

    if (this.data.height[0] == "392px")
      this.setData({
        height: [j * 98 * i + 196 + "px", j * 98 + "px"]
      })
    else
      this.setData({
        height: ["392px", "196px"]
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let jwt = app.globalData.jwt;
    if (!jwt.isValid()) { // 如果未登录或者token失效，则跳转登录。
      app.globalData.logout();
      return
    }
    var data = []
    // var infoarr=[]
    var userid = jwt.payload.userId
    request.httpFind("/api/server_mypackages", {
        userid: userid
      })
      .then(res => {
        console.log("aa", res)
        data = res.data.data
        data.map(function(item, index) {
          var needcount = item.packageinfo.length;
          item.packageinfo.map(function(itemj, indexJ) {
            needcount += itemj.items.length
          })
          item.need_collapse = needcount > 6
        })

        var userid = app.globalData.jwt.payload.userId

        return request.httpFind("/api/membershipchargepackage", {
          uid: userid || 320
        })


      }).then((res) => {
        data.map(function(itm) {
          var date = itm.endTime.slice(0, 10) + "日"
          var datearr = date.split("-")
          itm.zhEndTime = datearr[0] + "年" + datearr[1] + "月" + datearr[2]

        })
        this.setData({
          data
        })
      })
    //隐藏转发按钮
    wx.hideShareMenu()
    app.globalData.backMinePage=true
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