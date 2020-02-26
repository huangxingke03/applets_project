//患者档案列表汇总页面
var Api = require("../../utils/util.js");
const app = getApp()
import request from '../../utils/request.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //患者名字
    patientNameValue: '',
    //患者性别
    patientGenderValue: '',
    //患者关系类型
    patientRelationshipTypeValue: '',
    //本人档案信息
    selfFileInfo: null,
    //家人档案信息
    familyFileArry: [],
    //患者性别是不是女
    isFemale: false,
    //患者性别是不是男
    isMale: false,
    //患者id
    patientId: null,
    //患者关系类型
    patientType: null,
    //没有档案数据
    hasNoFileTag: true,
    //有档案数据
    hasFileTag: false,
    //有家庭档案数据
    hasFamilyFileTag: false,
    //最底部添加家庭档案按钮是否显示
    bottomButtonShow: false,
    //隐藏添加家属档案按钮
    hideAddFamilyBt: true,
    newPatientInfo: null,
    localFamilyFileArry: [],
    sortFamilyFileArry: [],
    jwtValue: null,
    isFirstTag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let jwt = app.globalData.jwt;
    if (!jwt.isValid()) { // 如果未登录或者token失效，则跳转登录。
      app.globalData.logout();
    } else {
      this.setData({
        jwtValue: jwt
      })
    }
    console.log('uid', jwt.payload.userId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // if (this.data.isFirstTag) { //第一次加载
    //   this.getPatientFileList(this.data.jwtValue)
    //   this.setData({
    //     isFirstTag: false
    //   })
    // } else {
    //   setTimeout(() => {
    //     //获取患者本人档案信息 并展示
    //     this.getPatientFileList(this.data.jwtValue)
    //   }, 500)
    // }
    this.getPatientFileList(this.data.jwtValue)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 创建本人档案
   */
  createSelfFile: function() {
    wx.navigateTo({
      url: '/pages/createPatientFile/createPatientFile?sendCreatFileTag=0826',
    })
  },
  /**
   * 创建 父母 子女 其他 档案
   * creatFamilyTag=0926 创建父母  子女  其他 三种类型的档案
   */
  createFamilyFile: function() {
    wx.navigateTo({
      url: '/pages/createPatientFile/createPatientFile',
    })
  },
  /**
   * 家人档案详情
   */
  familyFileDetail: function(options) {
    console.log("familyFileDetail",options.currentTarget.dataset)
    //保存患者id  患者名字 关系类型
    wx.setStorageSync("patientId", options.currentTarget.dataset.pid)
    wx.setStorageSync("patientName", options.currentTarget.dataset.name)
    wx.setStorageSync("patientType", options.currentTarget.dataset.type)
    wx.setStorageSync("typeInfoId", options.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/patientFileDetails/patientFileDetails'
    })
  },
  /**
   * 本人档案详情
   */
  myFileDetail: function(e) {
    //保存患者id  患者名字 关系类型
    wx.setStorageSync("patientId", this.data.patientId)
    wx.setStorageSync("patientName", this.data.patientNameValue)
    wx.setStorageSync("patientType", this.data.patientType)
    wx.navigateTo({
      url: '/pages/patientFileDetails/patientFileDetails'
    })
  },
  /**
   * 获取档案数据列表
   */
  getPatientFileList(jwt) {
    var that = this;
    request.httpFind("/api/server_membershipPersonalFamily", {
        uid: jwt.payload.userId,
        limit: 7,
        skip: 0,
        untying: 0
      })
      .then(res => {
        console.log('所有档案信息==patientFileList==>', JSON.stringify(res.data.data))
        if (res.data.data.length != '0') {
          that.setData({
            patientInfoArry: res.data.data
          })
          var fileInfoList = res.data.data
          that.getFamilyFileInfo(fileInfoList)
        }
      })
  },
  // compare: function(propertyName) {
  //   return function(object1, object2) {
  //     var value1 = object1[propertyName];
  //     var value2 = object2[propertyName];
  //     if (value2 < value1) {
  //       return 1;
  //     } else if (value2 > value1) {
  //       return -1;
  //     } else {
  //       return 0;
  //     }
  //   }
  // },
  /**
   * 处理档案数据分别获取本人档案,家人档案(父母,子女,其他类档案)
   */
  getFamilyFileInfo(fileInfoList) {
    var that = this;
    this.setData({
      localFamilyFileArry: []
    })
    let familyFileArry = this.data.familyFileArry;
    let localFamilyFileArry = this.data.localFamilyFileArry;
    //处理返回数据分别得到本人档案,家人档案
    if (fileInfoList != null && fileInfoList.length > 0) {
      for (var i = 0; i < fileInfoList.length; i++) {
        var fileInfo = fileInfoList[i]
        if (fileInfo.type == '1') {
          this.setData({
            selfFileInfo: fileInfoList[i],
            patientId: fileInfoList[i].pid,
            patientNameValue: fileInfoList[i].patientName,
            patientType: fileInfoList[i].type,
            //有档案数据
            hasFileTag: true,
            //没有档案数据
            hasNoFileTag: false,
          })
          console.log('本人档案信息==patientFileList==>', this.data.selfFileInfo)
        } else {
          localFamilyFileArry.push(fileInfo)
          this.setData({
            bottomButtonShow: true,
            hasFamilyFileTag: true,
            hideAddFamilyBt: false
          })
        }
      }
      if (fileInfoList.length == '7') { //家属档案有6条时隐藏添加按钮
        this.setData({
          hideAddFamilyBt: false,
          bottomButtonShow: false
        })
      }
      this.setData({
        familyFileArry: localFamilyFileArry
      })
      console.log('家属档案信息==patientFileList==>', this.data.familyFileArry)
    }
  }
})