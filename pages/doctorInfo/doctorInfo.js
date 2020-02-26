// pages/doctorInfo/doctorInfo.js
import request from '../../utils/request.js';
import constDict from '../../utils/constDict.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noDataShow: false,
    noDataShowText:'获取信息失败',
    stfid: -1,
    staff: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.options.stfid > 0){
      this.setData({
        stfid: this.options.stfid
      })
      this.getStaffInfosData();
    } else {
      this.setData({
        noDataShow: true,
        noDataShowText: '医生信息有误'
      })
    }
  },
  getStaffInfosData() {
    let that = this;
    wx.showLoading({
      title: '加载中……',
    })
    let params = {
      id: that.data.stfid,
      workingState: 'A'
    }
    request.httpFind('/api/staffinfo', params).then(res => {
      let data = res.data;
      console.log('38 ', res);
      if (res.code === 200 && data.data) {
        if (data.data.length > 0) {
          let staff = data.data[0];
          let certificateDateOfIssueText = staff.certificateDateOfIssue ? new Date((staff.certificateDateOfIssue).replace(/-/g, '/')).dateFormat('yyyy-MM-dd') : null;
          staff['certificateDateOfIssueText'] = certificateDateOfIssueText;
          let eDate = new Date();
          let sDate = staff.certificateDateOfIssue ? new Date(Date.parse(staff.certificateDateOfIssue.replace(/-/g, "/"))) : eDate;
          let years = eDate.getFullYear() - sDate.getFullYear();
          staff['certificateDateOfYears'] = years;
          staff['avatarUrl'] = staff.avatar ? staff.avatar : constDict.doctorDefImg[staff.sex];
          staff['physicianLevel'] = staff.physicianLevel;
          staff['physicianLevelText'] = staff.physicianLevel && constDict.physicianLevel[staff.physicianLevel] ? constDict.physicianLevel[staff.physicianLevel] : '';
          staff['physicianCategory'] = staff.physicianCategory;
          staff['physicianCategoryText'] = staff.physicianCategory && constDict.physicianCategory[staff.physicianCategory] ? constDict.physicianCategory[staff.physicianCategory] : '';
          staff['staffInfo'] = staff.staffInfo ? staff.staffInfo : constDict.staffInfoDefValue;
          that.setData({
            staff: staff
          })
        }
      } else {
        this.setData({
          noDataShow: true,
          noDataShowText: '暂无该医生信息'
        })
      }
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading();
      this.setData({
        noDataShow: true
      })
      console.log(err);
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