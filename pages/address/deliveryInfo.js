// pages/address/deliveryInfo.js
import request from "../../utils/request.js"
const app = getApp()
import {
  getDeliGoodTypeObj,
  getLogisticsStatus,
  getAllDelivery
} from "../../utils/resource.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getLogisticsStatus,
    getDeliGoodTypeObj,
    getAllDelivery,
    direction: "vertical",
    activeColor: "#367df5",
    active: 0,
    isIphoneX: app.globalData.isIphoneX,
    //门店自提地址
    selfRaisingAddress: '',
    //门店名字
    storeInfoName: '',
    //自提地址维度
    latitudeValue: '',
    //自提地址经度
    longitudeValue: '',

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({
    id = 43
  }) {
    //隐藏转发按钮
    wx.hideShareMenu()
    var steps = []
    var data = {}
    request.httpFind("/api/zyt_logistics", {
      id
    }).then(res => {
      data = res.data.data[0]
      console.log(data)
      if (data.logisticsHistory) {
        data.logisticsHistory = JSON.parse(data.logisticsHistory).reverse()
        data.logisticsHistory.map(function (item) {
          var step = {}
          step.desc = item.remark;

          if (item.accept_time) {
            var timearr = item.accept_time.split(" ")
            step.acday = timearr[0].substr(5, 10)
            step.actime = timearr[1].substr(0, 5)
            //  step.text=item.opcode
          }
          steps.push(step)
        })
      }
      return request.httpFind("/api/patientInfo", {
        id: data.pid
      })
    }).then(res => {
      if (res.data.data.length > 0) {
        data.pname = res.data.data[0].patientName
      }
      console.log('steps', steps)
      console.log('data', data)
      this.setData({
        data,
        steps
      })
    })
    return request.httpFind("/api/StoreInfo", {
      name: '中和堂中医门诊',
      '$limit': 1,
      '$skip': 0,
    }).then(res => {
      console.log('StoreInfo:res=>', res.data.data[0])
      this.setData({
        selfRaisingAddress: res.data.data[0].storeAddress,
        latitudeValue: res.data.data[0].latitude,
        longitudeValue: res.data.data[0].longitude,
        storeInfoName: res.data.data[0].name
      })
    })
  },
  movetoLocation: function () {
    wx.openLocation({
      latitude: parseInt(this.data.latitudeValue),
      longitude: parseInt(this.data.longitudeValue),
      scale: 18,
      name: this.data.storeInfoName,
      address: this.data.selfRaisingAddress
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().globalData.defaultShareObject;
  }
})