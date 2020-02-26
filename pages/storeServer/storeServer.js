// pages/storeServer/storeServer.js
import util from '../../utils/util.js'
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: -1,
    storeServerData: null,
    baseInfo: null,
    medicalQualification: [],
    medicalQualificationImgUrls: [],
    chineseMedicineService:[],
    specialMedical: [],
    peripheralTrafficAndBusinessArea: [],
    infrastructure: [],
    officeDays:"",
    mdestination: null,
    noDataShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.storeId > 0){
      this.setData({
        storeId: options.storeId
      })
      this.getStoreServerData();
    }
    // console.log('====>> 20 storeId',this.data.storeId);
  },
  getStoreServerData() {
    wx.showLoading({
      title: '加载中……',
    })
    var that = this;
    let params = {
      'id': this.data.storeId,
      $select: ['*']
    }
    request.httpOpenFind('/static/server/storeInfo', params).then(res => {
      if (res.code === 200) {
        // console.log('=====>>>>> 38 ',res);
        let data = util.getObjectValue(res,['data','data',0]);
        if (data){
          that.setData({
            storeServerData: data,
            baseInfo: data.baseInfo ? JSON.parse(data.baseInfo) : null,
            medicalQualification: data.medicalQualification && JSON.parse(data.medicalQualification).length > 0 ? JSON.parse(data.medicalQualification) : [],
            medicalQualificationImgUrls: data.medicalQualification && JSON.parse(data.medicalQualification).length > 0 ? that.getMedicalQualificationImgUrls(JSON.parse(data.medicalQualification)) : [],
            chineseMedicineService: data.chineseMedicineService && JSON.parse(data.chineseMedicineService).length > 0 ? JSON.parse(data.chineseMedicineService) : [],
            // [{ name: "擅长手法：", serviceInfo: "中医调理、中药材、中医把脉、中医针灸、中医刮痧、中医拔罐、中医推拿按摩、中医敷贴、中医正骨、中医膏方、中医养生" }, { name: "门诊科室：", serviceInfo:"中医内科、中医外科、中医妇科、中医骨科、中医儿科、中医康复科、中医肿瘤科、中医针灸科"}],
            specialMedical: data.specialMedical && JSON.parse(data.specialMedical).length > 0 ? JSON.parse(data.specialMedical) : [],
            // ["医保定点", "一人一方", "执证医生理疗","药剂师抓药"],
            peripheralTrafficAndBusinessArea: data.peripheralTrafficAndBusinessArea && JSON.parse(data.peripheralTrafficAndBusinessArea).length > 0 ? JSON.parse(data.peripheralTrafficAndBusinessArea) : [], 
            // [{typeName: "地铁站", destination: "10号线五角场地铁站", distance: "790m", lat: "", lng: ""}, {typeName: "停车场", destination: "海上财智商务中心广场停车场", distance: "50m", lat: "", lng: ""}, {typeName: "商场", destination: "九隆坊", distance: "170m", lat: "", lng: ""}],
            infrastructure: data.infrastructure && JSON.parse(data.infrastructure).length > 0 ? JSON.parse(data.infrastructure) : [],
            // ["有wifi","候诊区","付费停车"] 
            officeDays: data.officeDays && JSON.parse(data.officeDays).length > 0 ? (util.arrToWeekString(JSON.parse(data.officeDays))).join('、') : '--',
            noDataShow: !data.baseInfo && !data.medicalQualification && !data.chineseMedicineService && !data.specialMedical && !data.peripheralTrafficAndBusinessArea && !data.infrastructure ? true : false
          })
        }
        wx.hideLoading();
      }
    }).catch(err => {
      wx.showToast({
        title: '获取信息失败',
      }, 1000)
      console.log(err);
    });
  },
  gotoDestination(e){
    // console.log('===>>',e.currentTarget.dataset.mdestination);
    let mdestination = e.currentTarget.dataset.mdestination;
    this.setData({ 
      mdestination: mdestination
    })
    if (mdestination && mdestination.lat && mdestination.lng ) {
      wx.openLocation({
        latitude: Number(mdestination.lat) || 0,
        longitude: Number(mdestination.lng) || 0,
        scale: 18,
        name: mdestination.destination,
        address: mdestination.typeName
      })
    } else {

    }
  },
  previewImg(e) {
    wx.previewImage({
      urls: this.data.medicalQualificationImgUrls,
      current: e.currentTarget.dataset.selectitem.path
    })
  },
  getMedicalQualificationImgUrls(medicalQualification){
    let imgUrls = [];
    if (medicalQualification && medicalQualification.length  > 0){
      medicalQualification.forEach(med => {
        imgUrls.push(med.path);
      })
    }
    return imgUrls;
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