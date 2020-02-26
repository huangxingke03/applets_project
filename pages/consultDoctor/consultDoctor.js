// pages/consultDoctor/consultDoctor.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    doctor: null,
    imgUrl: util.addFileUrl("wxapp-1547694405543-WX20190117-110525.png"),
    imgUrls: [util.addFileUrl("wxapp-1547694405543-WX20190117-110525.png"),
      util.addFileUrl("wxapp-1547695216106-WX20190117-111918.png"),
      util.addFileUrl("wxapp-1547691799547-shinchvne-QrCode.jpg")]
    // "../../images/WX20190117-110525.png"
    // util.addFileUrl("wxapp-1547694078778-WechatIMG259.png")
    // "../../images/WechatIMG259.png"
    // util.addFileUrl("wxapp-1547691799547-shinchvne-QrCode.jpg")
  },
  // "../../images/shinchvne-QrCode.jpg"
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.doctor) {
      // console.log('======>> 16 ', options.doctor);
      let doctor = JSON.parse(options.doctor);
      doctor.staffInfo = doctor.staffInfo && doctor.staffInfo.trim().length > 0 ? doctor.staffInfo.trim() : constDict.staffInfoDefValue
      this.setData({
        doctor: doctor
      })
      console.log('======>> 30 doctor',this.data.doctor);
    }
  },
  scanQrCode (e){
    console.log('====>> 点击 ',e);
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imgUrls,
      success: function (res) {
        console.log('=====>>> res ',res);
       },
      fail: function (res) { },
      complete: function (res) { },
    })
    wx.getImageInfo({
      src: this.data.imgUrl,
      success(res){
        console.log('=====>>>getImageInfo res ', res);
      }
    })
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