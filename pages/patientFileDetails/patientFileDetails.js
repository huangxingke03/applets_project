// pages/patientFileDetails/patientFileDetails.js
//患者档案详情页面
const app = getApp()
var Api = require("../../utils/util.js");
var resource = require("../../utils/resource.js");
import request from '../../utils/request.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //患者档案信息
    patientValueArry: null,
    //患者名字
    patientNameValue: null,
    //患者性别
    patientGenderValue: null,
    //患者电话
    patientPhoneValue: null,
    //患者婚姻状况
    patientMarriageValue: null,
    //患者生日
    patientBirthValue: null,
    //患者关系类型
    patientRelationshipTypeValue: null,
    //患者身份证号
    patientIdnumberValue: null,
    //患者宗教信仰
    patientFaithValue: null,
    //患者民族
    patientNationalityValue: null,
    //患者是否退伍军人标识
    patientWhetherVeteranValue: null,
    //患者别名
    patientAliasValue: null,
    //患者多胞胎标识
    patientWhetherMultipleValue: null,
    //患者母亲名字
    patientMotherNameValue: null,
    //患者家中电话
    patientHomePhoneValue: null,
    //患者地址
    patientLiveAddressValue: null,
    //患者出生地
    patientPlaceBirthValue: null,
    //患者id
    patientId: null,
    //次要信息是否显示
    secondary_info_show: false,
    //患者医保卡号
    patientmedicalInsuranceCardNumberValue: null,
    //患者关系类型
    patientType: null,
    //档案详情页面(关系是本人时隐藏关系信息)
    hideFileType: false,
    //提示点击拉开其他信息 默认显示
    tipContentTag:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    let jwt = app.globalData.jwt;
    if (!jwt.isValid()) { // 如果未登录或者token失效，则跳转登录。
      app.globalData.logout();
    } else {
      var patientIdValue = wx.getStorageSync("patientId")
      var patientTypeValue = wx.getStorageSync("patientType")
      if (patientIdValue && patientTypeValue) {
        this.setData({
          patientId: patientIdValue,
          patientType: patientTypeValue
        })
        this.getPatientInfo()
      }
    }
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
  modifyPatientFile() {
    wx.navigateTo({
      url: '/pages/modifyPatientFile/modifyPatientFile',
    })
  },
  /**
   * 联网获取患者档案信息
   */
  getPatientInfo() {
    var that = this;
    request.httpFind("/api/PatientInfo", {
        id: this.data.patientId
      })
      .then(res => {
        console.log('当前患者档案信息==patientFileDetails==>', JSON.stringify(res.data.data))
        console.log('当前患者id==patientFileDetails==>', this.data.patientId)
        that.setData({
          patientValueArry: res.data.data
        })
        that.showPatientInfo()
      })
  },
  /**
   * 点击"次要信息(选填)设置次要信息的显示状态""
   */
  setSecondaryInfoShow: function() {
    var that = this;
    if (this.data.secondary_info_show) {
      that.setData({
        secondary_info_show: false,
        tipContentTag:true
      })
    } else {
      that.setData({
        secondary_info_show: true,
        tipContentTag:false
      })
    }
  },
  /**
   * 患者档案信息页面展示
   */
  showPatientInfo() {
    var patientInfo = this.data.patientValueArry[0]
    //患者名字
    this.setData({
      patientNameValue: patientInfo.patientName
    })
    //患者性别
    if (patientInfo.sex == "F") {
      this.setData({
        patientGenderValue: '女'
      })
    } else if (patientInfo.sex == "M") {
      this.setData({
        patientGenderValue: '男'
      })
    }
    //患者电话
    this.setData({
      patientPhoneValue: patientInfo.phoneNumberBusiness
    })
    //患者婚姻状况
    if (patientInfo.maritalStatus == "D") {
      this.setData({
        patientMarriageValue: '离婚'
      })
    } else if (patientInfo.maritalStatus == "M") {
      this.setData({
        patientMarriageValue: '已婚'
      })
    } else if (patientInfo.maritalStatus == "W") {
      this.setData({
        patientMarriageValue: '丧偶'
      })
    } else if (patientInfo.maritalStatus == "B") {
      this.setData({
        patientMarriageValue: '未婚'
      })
    } else if (patientInfo.maritalStatus == "O") {
      this.setData({
        patientMarriageValue: '其他'
      })
    }
    //患者生日
    this.setData({
      patientBirthValue: new Date(patientInfo.birthday.replace(/-/g, '/')).dateFormat('yyyy-MM-dd')
    })
    //身份证号
    if (patientInfo.idNumber != null) {
      this.setData({
        patientIdnumberValue: patientInfo.idNumber
      })
    }
    //宗教信仰
    if (patientInfo.religion != null) {
      this.setData({
        patientFaithValue: patientInfo.religion
      })
    }
    //患者关系类型
    if (this.data.patientType == "1") {
      this.setData({
        patientRelationshipTypeValue: '本人'
      })
    } else if (this.data.patientType == "2") {
      this.setData({
        patientRelationshipTypeValue: '父母',
        hideFileType: true
      })
    } else if (this.data.patientType == "3") {
      this.setData({
        patientRelationshipTypeValue: '子女',
        hideFileType: true
      })
    } else if (this.data.patientType == "4") {
      this.setData({
        patientRelationshipTypeValue: '其他',
        hideFileType: true
      })
    } else if (this.data.patientType == "5") {
      this.setData({
        patientRelationshipTypeValue: '配偶',
        hideFileType: true
      })
    }
    //患者民族  
    if (patientInfo.ethnicGroup != null) {
      console.log("患者民族", resource.getNationalityArray()[parseInt(patientInfo.ethnicGroup) - 1])
      this.setData({
        patientNationalityValue: resource.getNationalityArray()[parseInt(patientInfo.ethnicGroup) - 1]
      })
    }
    //是否退伍军人
    if (patientInfo.veteransMilitaryStatus != null) {
      this.setData({
        patientWhetherVeteranValue: patientInfo.veteransMilitaryStatus
      })
    }
    //患者医保卡号
    if (patientInfo.medicalInsuranceCardNumber != null) {
      this.setData({
        patientmedicalInsuranceCardNumberValue: patientInfo.medicalInsuranceCardNumber
      })
    }
    //患者别名
    if (patientInfo.patientAlias != null) {
      this.setData({
        patientAliasValue: patientInfo.patientAlias
      })
    }
    //是否多胞胎
    if (patientInfo.multipleBirthIndicator != null) {
      if (patientInfo.multipleBirthIndicator == 'Y') {
        this.setData({
          patientWhetherMultipleValue: '是'
        })
      } else if (patientInfo.multipleBirthIndicator == 'N') {
        this.setData({
          patientWhetherMultipleValue: '不是'
        })
      }
    }
    //母亲名字
    if (patientInfo.motherName != null) {
      this.setData({
        patientMotherNameValue: patientInfo.motherName
      })
    }
    //家中电话
    if (patientInfo.phoneNumberHome != null) {
      this.setData({
        patientHomePhoneValue: patientInfo.phoneNumberHome
      })
    }
    //患者地址
    if (patientInfo.patientAddress != null) {
      this.setData({
        patientLiveAddressValue: patientInfo.patientAddress
      })
    }
    //出生地
    if (patientInfo.birthPlace != null) {
      this.setData({
        patientPlaceBirthValue: patientInfo.birthPlace
      })
    }
  }
})