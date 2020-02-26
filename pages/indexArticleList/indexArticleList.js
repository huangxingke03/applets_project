// miniprogram/pages/indexArticleList/indexArticleList.js
import request from '../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: [],
    winWidth: 0,
    winHeight: 0,
    searchLoading: false,
    searchLoadingComplete: false,
    searchPageNum: 1, // 设置加载的第几次，默认是第一次
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    skipValue: 0,
    hasData: false, //有数据
    noData: true, //没数据
    moreLoad: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    this.getArticleList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  onShareAppMessage: function() {},
  getArticleList() {
    let that = this;
    let params = {
      'limit': 8,
      'skip': this.data.skipValue,
      'sort[createdAt]': '-1',
      'isDelete': 0,
      'state': 'T'
    }
    request.httpOpenFind('/static/server/zyt_article', params).then(res => {
      let data = res.data;
      console.log('====>>>zyt_article ', res);
      console.log('====>>>data.data.length ', data.data.length, data.data);
      if (res.code === 200 && data.data) {
        if (data.data.length > 0) {
          if (that.data.searchPageNum == '1') {
            this.setData({
              noData: false,
              hasData: true,
            })
          }
          let dataList = [];
          that.data.isFromSearch ? dataList = data.data : dataList = that.data.news.concat(data.data)
          this.setData({
            news: dataList,
            searchLoading: true,
            skipValue: this.data.skipValue + data.data.length,
          })
        } else {
          console.log('====>>>没获取到文章数据 ', data.data.length);
          this.setData({
            searchLoadingComplete: true,
            searchLoading: false
          })
        }
      }
    }).catch(err => {
      wx.showToast({
        title: '获取文章信息失败',
      }, 1000)
      console.log(err);
    })
  },
  searchScrollLower: function() {
    console.log('文章列表滑倒最底部开始加载文章数据')
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false, //触发到上拉事件，把isFromSearch设为为false
        moreLoad: true
      });
      this.getArticleList();
    }
  },
  gotoweb: function(e) {
    var typeValue = e.currentTarget.dataset.type;
    var idValue = e.currentTarget.dataset.id;
    if (typeValue && typeValue.length != 0 && typeValue == 1) { //文章跳转链接
      wx.navigateTo({
        url: '../webview/webview?id=' + idValue
      })
    } else if (typeValue && typeValue.length != 0 && typeValue == 2 && idValue) { //文章跳转站内编辑文章
      wx.navigateTo({
        url: '../editArticleShow/editArticleShow?id=' + idValue
      })
    }
  },
})