// pages/address/delivery.js
import request from "../../utils/request.js"
import areaList from "../../utils/getAllRegion.js"
const app = getApp()
import {
  getDeliGoodTypeObj,
  getLogisticsStatus,
  getAllDelivery,
  getDeliveryStatus
} from "../../utils/resource.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //物流信息数据源
    dataArray: [],
    uidValue: null,
    getDeliGoodTypeObj,
    getLogisticsStatus,
    getAllDelivery,
    getDeliveryStatus,
    isIphoneX: app.globalData.isIphoneX,
    winWidth: 0,
    winHeight: 0,
    //列表上下滑动状态
    verticalSlidingTag: true,
    searchPageNum: 1, // 设置加载的第几次，默认是第一次
    moreLoad: false,
    loadDataSuccess: false, //加载数据成功 ,
    skipValue: 0,
    searchLoading: false,
    searchLoadingComplete: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let jwt = app.globalData.jwt
    let uid = jwt.isValid() && jwt.payload.userId
    this.setData({
      uidValue: uid
    })
    //隐藏转发按钮
    wx.hideShareMenu()
    app.globalData.backMinePage = true
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  /**
   * 获取物流信息
   */
  getZytLogistics() {
    let that = this;
    request.httpFind("/api/zyt_logistics", {
        uid: this.data.uidValue,
        '$limit': 10,
        '$skip': this.data.skipValue,
      })
      .then(res => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          res.data.data.map((x) => {
            if (x.logisticsHistory != null) {
              x.logisticsHistory = JSON.parse(x.logisticsHistory).reverse()
              x.logisticsHistory = x.logisticsHistory[0].opCode
            } else {
              x.logisticsHistory = "未获取"
            }
          })
          let dataList = [];
          that.data.searchPageNum == '1' ? dataList = res.data.data : dataList = that.data.dataArray.concat(res.data.data)
          this.setData({
            dataArray: dataList,
            searchLoading: true,
            skipValue: that.data.skipValue + res.data.data.length,
            moreLoad: false,
            loadDataSuccess: true
          })
        } else {
          this.setData({
            searchLoading: false,
            loadDataSuccess: false,
            moreLoad: false,
            loadDataSuccess: false
          })
        }
      })
  },
  /**
   * scroll-view互动到底部触发加载医生数据事件
   */
  searchScrollLower: function () {
    if (this.data.loadDataSuccess) { //滑动分页加载时,前一次加载成功后加载
      this.setData({
        loadDataSuccess: false
      })
      this.setData({
        searchPageNum: this.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1
        moreLoad: true
      });
      console.log('searchScrollLower:==>this.data.searchPageNum', this.data.searchPageNum)
      this.getZytLogistics()
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
    this.getZytLogistics()
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