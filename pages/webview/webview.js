// pages/webview/webview.js
import request from '../../utils/request.js';
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shareLogo: null,
    shareTitle: null,
    //文章内容显示标记
    articleExitTag: false,
    //文章内容不显示标记
    articleMissTag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.src){ //首页轮播图跳转网页
      this.setData({
        src: decodeURIComponent(options.src),
        articleExitTag: true,
        articleMissTag: false,
      })
    }else{
      var articleId
       if (options.id) { //首页,文章列表跳转在线网页文章
        articleId = options.id
      }else if (options.isShare&&options.shareId) { //分享在线文章后,再次点击次进入
        articleId = options.shareId
      } 
      let articleParams = {}
      request.getArticle('/article/' + articleId, articleParams).then(res => {
        let data = res.data;
        console.log('res==>>', res)
        console.log('data.data==>>', data.data)
        if (res.code === 200 && data.data && data.data.length != 0) {
          if(data.data[0].state=='D'){ //文章被停用,不显示文章内容
            this.setData({
              articleExitTag: false,
              articleMissTag: true,
            })
          }else{
            this.setData({
              shareLogo: data.data[0].articlesCoverChart,
              shareTitle: data.data[0].title,
              src: decodeURIComponent(data.data[0].path),
              articleExitTag: true,
              articleMissTag: false,
            })
          }
        }else {
          console.log('--没有文章内容--')
          this.setData({
            articleExitTag: false,
            articleMissTag: true,
          })
        }
      }).catch(err => {
        wx.showToast({
          title: '获取文章失败',
        }, 1000)
        console.log(err);
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
    // return getApp().globalData.defaultShareObject;
    return {
      title: this.data.shareTitle,
      imageUrl: this.data.shareLogo,
      path: app.globalData.getCurrentURL(this)+"&shareId="+articleId
    };
  }
})