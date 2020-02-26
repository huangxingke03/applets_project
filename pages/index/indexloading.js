// miniprogram/pages/index/indexloading.js
import request from '../../utils/request.js';
import {
  storeInfo
} from '../../utils/constDict.js';
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
  onLoad: function(options) {
    this.getStoreInfoTableData()
    this.getZytArticle()
    this.getPageRotationChart()
    this.getStaffList()
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }, 2* 1000)
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

  },
  /**
   * 获取首页门店信息
   */
  getStoreInfoTableData() {
    let that = this;
    let params = {
      id: storeInfo.ids
    }
    console.log('=storeInfo:id>>', params);
    request.httpOpenFind('/static/server/storeInfo', params).then(res => {
      console.log("=static/server/storeInfo=>" + res)
      if (res.code === 200 && res.data && res.data.total > 0) {
        app.globalData.storeInfosArray = res.data.data
      }
      console.log("=app.globalData.storeInfosArray=>" + app.globalData.storeInfosArray)
    }).catch(err => {
      console.log('=storeInfo>>', err);
      wx.showToast({
        title: '获取信息失败',
      }, 1000)
    })
  },
  /**
 * 获取首页文章列表
 */
  getZytArticle() {
    //获取首页文章列表最多显示四条
    let articleParams = {
      '$limit': 4,
      '$skip': 0,
      '$sort[createdAt]': '-1',
      'isDelete': 0,
      'state': 'T'
    }
    request.httpOpenFind('/static/server/zyt_article', articleParams).then(res => {
      let data = res.data;
      console.log("=static/server/zyt_article=>"+data.data)
      if (res.code === 200 && data.data) {
        if (data.data.length > 0) {
          app.globalData.newsArray = data.data
        }
      }
    }).catch(err => {
      wx.showToast({
        title: '获取文章列表失败',
      }, 1000)
      console.log(err);
    })
  },
  /**
 * 获取首页轮播图数据
 */
  getPageRotationChart() {
    request.httpOpenFind('/static/server/server_zyt_homePageRotationChart').then(res => {
      let data = res.data;
      console.log("=static/server/server_zyt_homePageRotationChart=>" + data.data)
      if (res.code === 200 && data.data) {
        if (data.data.length > 0) {
          app.globalData.newsArray = data.data
        }
      }
    }).catch(err => {
      wx.showToast({
        title: '获取轮播图数据失败',
      }, 1000)
      console.log(err);
    })
  },
  /**
 * 获取首页横向诊断医生列表
 */
  getStaffList() {
    let that = this;
    let params = {
      key: 'xiaoyouyishengDoctor',
      homepage: "1",
      skip: 0
    }
    request.httpOpenFind('/static/server/server_getdoctor', params).then(res => {
      let data = res.data;
      console.log("=static/server/server_getdoctor=>" + data.data)
      if (res.code === 200 && data.data) {
        if (data.data.length > 0) {
          app.globalData.staffArray = data.data
        }
      } else { }
    }).catch(err => {
      console.log(err);
    })
  },
})