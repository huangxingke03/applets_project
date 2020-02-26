// miniprogram/pages/editArticleShow/editArticleShow.js
import request from '../../utils/request.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleBean: null,
    articleContentValue: null,
    articleCreateTimeValue: null,
    //文章内容显示标记
    articleExitTag: false,
    //文章内容不显示标记
    articleMissTag: false,
    shareLogo:null,
    shareTitle: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var articleId
    if (options.isShare&&options.shareId) {
      articleId = options.shareId
    } else if (options.id) {
      articleId = options.id
    }
    let articleParams = {}
    request.getArticle('/article/' + articleId, articleParams).then(res => {
      let data = res.data;
      console.log('res==>>', res)
      console.log('data.data==>>', data.data)
      if (res.code === 200 && data.data && data.data.length != 0) {
        console.log('--有文章内容--')
        if(data.data[0].state=='D'){ //文章被停用,不显示文章内容
          this.setData({
            articleExitTag: false,
            articleMissTag: true,
          })
        }else{
          let articleContent = data.data[0].articleContent
          .replace(/\<img/gi, '<img style="max-width:100%;height:auto" ').replace('<html>', '')
          .replace('</html>', '')
          .replace('<head>', '')
          .replace('</head>', '')
          .replace('<body>', '')
          .replace('</body>', '');
        this.setData({
          articleExitTag: true,
          articleMissTag: false,
          articleBean: data.data[0],
          articleContentValue: articleContent,
          articleCreateTimeValue: new Date(data.data[0].createdAt.replace(/-/g, '/')).dateFormat('MM月dd日'),
          shareLogo: data.data[0].articlesCoverChart,
          shareTitle: data.data[0].title,
        })
        }
      } else {
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
    // console.log('articleBean', this.data.articleBean)
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
    return {
      title: this.data.shareTitle,
      imageUrl: this.data.shareLogo,
      path: app.globalData.getCurrentURL(this)+"&shareId="+articleId
    };
  }
})