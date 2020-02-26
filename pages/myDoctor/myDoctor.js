// pages/myDoctor/myDoctor.js
import request from '../../utils/request.js';
import constDict from '../../utils/constDict.js';

const app = getApp()
let pagesize = 10, pageIndex = 1, index = 0, total = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    uid: -1,
    staffInfos: [],
    titelKey: "staffName",
    color1: "#124395",
    color2: "#EE501A",
    dataAllLoaded: false,
    noDataShow: false,
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let jwt = app.globalData.jwt;
    if (jwt && jwt.isValid()) {
      this.setData({
        uid: jwt.payload.userId
      })
    }
    
    this.refresh();
    //隐藏转发按钮
    wx.hideShareMenu()
  },
  refresh() {
    pageIndex = 1, index = 0, total = 0;
    this.setData({
      staffInfos: [],
      noDataShow: false
    })
    this.getStaffInfosData();
  },
  getStaffInfosData() {
    let that = this;
    wx.showLoading({
      title: '加载中……',
    })
    let params = {
      uid: that.data.uid,
      limit: pagesize,
      skip: index
    }
    request.httpFind('/api/server_membershipPersonalDoctor', params).then(res => {
      let data = res.data;
      // console.log('43 ', res);
      if (res.code === 200 && data.data) {
        if (data.data.length > 0) {
          total = data.total;
          let staffs = data.data;
          index = index + staffs.length;
          pageIndex++;
          staffs.forEach(staff => {
            staff.staffInfo = staff.staffInfo && staff.staffInfo.trim().length > 0 ? staff.staffInfo.trim() : constDict.staffInfoDefValue;
            staff['avatarUrl'] = staff.avatar ? staff.avatar : constDict.doctorDefImg[staff.sex];
          })
          this.setData({
            staffInfos: this.data.staffInfos.concat(staffs)
          })
          // this.data.staffInfos = this.data.staffInfos.concat(staffs);
          staffs = null;
          // console.log('62 ', this.data.staffInfos);
        } else if (this.data.staffInfos.length > 0) {
          this.setData({
            dataAllLoaded: true
          })
        } else if (this.data.staffInfos.length <= 0){
          this.setData({
            noDataShow: true
          })
        }
      } else {
        this.setData({
          noDataShow: true
        })
      }
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '获取信息失败',
      }, 1000)
      this.setData({
        noDataShow: true
      })
      console.log(err);
    })
  },

  gotoConsultDoctor(e) {
    let doctor = e.currentTarget.dataset.doctor;
    doctor['id'] = doctor.stfid;
    let doctorString = JSON.stringify(doctor);
    // wx.navigateTo({
    //   url: `/pages/consultDoctor/consultDoctor?doctor=${doctorString}`,
    // })
  },
  gotoOppointmentDoctor(e) {
    // console.log('====>> 91 ', e.currentTarget.dataset.doctor);
    let doctor = e.currentTarget.dataset.doctor;
    doctor['id'] = doctor.stfid;
    doctor['schedulType'] = '1';
    let doctorString = JSON.stringify(doctor);
    wx.navigateTo({
      url: `/pages/appointmentDoctor/appointmentDoctor?doctor=${doctorString}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log('=====>> 70 onReady ', pagesize, pageIndex, index, total);
    // this.lk-imgInfo = this.selectComponent("#doctors");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.refresh();
    // console.log('=====>> 70 onShow ', pagesize, pageIndex, index, total);
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
    console.log('=====>> 126 onPullDownRefresh ', pagesize, pageIndex, index, total);
    this.refresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('=====>> 135 onReachBottom ', pagesize, pageIndex, index, total);
    this.getStaffInfosData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return getApp().globalData.defaultShareObject;
  }
})