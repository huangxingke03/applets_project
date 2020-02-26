// pages/report/reportList.js
const app = getApp()
import request from "../../utils/request.js"
import {
  resultsDetail
} from "../../utils/resource.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    dataArray: [],
    uidValue: null,
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
    if (!app.globalData.jwt.isValid()) { // 如果未登录，保存当前页面信息，跳出进行登录
      app.globalData.logout(app.globalData.getCurrentURL(this));
      return;
    }
    let jwt = app.globalData.jwt
    let uid = jwt.isValid() && jwt.payload.userId
    let domain = app.globalData.domain
    var patients = []
    this.setData({
      uidValue: uid
    })
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
    console.log('winWidth:winHeight', this.data.winWidth, this.data.winHeight)
  },
  getAuxiliaryInfoStatuslis() {
    let that = this;
    request.httpFind("/api/server_auxiliaryInfoStatuslist", {
        uid: this.data.uidValue,
        limit: '10',
        skip: this.data.skipValue,
      })
      .then(res => {
        var arr = res.data.data
        if (arr && arr.length > 0) {
          console.log('中易辅诊信息', arr)
          var data = []
          arr.map((item, i) => {
            if (item.version != 1) {
              item.result = item.result && item.result.split(",")
              item.createdAt = item.createdAt ? item.createdAt.substr(0, 16) : ""
              // if(item.version!=1)
              data.push(item)
            }
          })
          let dataList = [];
          that.data.searchPageNum == '1' ? dataList = data : dataList = that.data.dataArray.concat(data)
          this.setData({
            dataArray: dataList,
            searchLoading: true,
            skipValue: that.data.skipValue + res.data.data.length,
            moreLoad: false,
            loadDataSuccess: true,
            resultsDetail
          })
          console.log('dataArray', this.data.dataArray)
        }else{
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
      this.getAuxiliaryInfoStatuslis()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      skipValue: 0,
      searchPageNum: 1,
      dataArray: [],
    })
    this.getAuxiliaryInfoStatuslis()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  opatientNamenHide: function () {

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
    this.onLoad()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 跳转添加就诊记录页面
   */
  addVisitReord(e) {
    wx.navigateTo({
      url: '/pages/report/reportForm',
    })

  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})