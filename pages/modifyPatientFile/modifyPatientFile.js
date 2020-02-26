// pages/editPatientFile/editPatientFile.js
//患者档案修改页面
import request from '../../utils/request.js';
var Api = require("../../utils/util.js");
const app = getApp()
var resource = require("../../utils/resource.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    arrayMarriage: app.globalData.marriage,
    arryGender: app.globalData.gender,
    arryYesNo: app.globalData.yesNo,
    arryFaith: app.globalData.faith,
    arrayNationality: resource.getNationalityArray(),
    arrayRelationshipType: app.globalData.relationshipType,
    //单个患者档案信息
    patientValueArry: [],
    //患者名字
    modifyPatientName: null,
    //患者性别
    modifyPatientGender: null,
    showPatientGender: null,
    //患者电话
    modifyPatientPhone: null,
    //患者婚姻状况
    modifyPatientMarriage: null,
    showPatientMarriage: null,
    //患者生日
    modifyPatientBirth: null,
    //患者关系类型
    modifyPatientRelationshipType: null,
    showPatientRelationshipType: null,
    //患者身份证号
    modifyPatientIdnumber: null,
    //患者宗教信仰
    modifyPatientFaith: null,
    //患者民族
    modifyPatientNationality: null,
    showPatientNationality: null,
    //患者是否退伍军人标识
    modifyPatientWhetherVeteran: null,
    //患者别名
    modifyPatientAlias: null,
    //患者多胞胎标识
    modifyPatientWhetherMultiple: null,
    showPatientWhetherMultiple: null,
    //患者母亲名字
    modifyPatientMotherName: null,
    //患者家中电话
    modifyPatientHomePhone: null,
    //患者地址
    modifyPatientLiveAddress: null,
    //患者出生地
    modifyPatientPlaceBirth: null,
    //患者id
    patientId: null,
    //患者名字
    patientName: null,
    //次要信息是否显示
    secondary_info_show: false,
    //患者医保卡号
    modifyPatientmedicalInsuranceCardNumberValue: '',
    //患者关系类型
    patientType: null,
    //父母  子女  其他类档案显示关系类型可以修改
    hideFileType: false,
    //用户uid
    uid: null,
    //关系类型数据id
    typeInfoId: null,
    //提示点击拉开其他信息 默认显示
    tipContentTag: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let jwt = app.globalData.jwt;
    if (!jwt.isValid()) { // 如果未登录或者token失效，则跳转登录。
      app.globalData.logout();
    } else {
      var patientIdValue = wx.getStorageSync("patientId")
      var patientNameValue = wx.getStorageSync("patientName")
      var patientTypeValue = wx.getStorageSync("patientType")
      var uidValue = jwt.payload.userId
      var typeInfoIdValue = wx.getStorageSync("typeInfoId")
      this.setData({
        patientId: patientIdValue,
        patientName: patientNameValue,
        patientType: patientTypeValue,
        uid: uidValue,
        typeInfoId: typeInfoIdValue
      })
      this.getPatientInfo()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  onChange(event) {
    const {
      key
    } = event.currentTarget.dataset;
    this.setData({
      [key]: event.detail
    });
  },
  //获取患者名字
  getPatientName(event) {
    this.setData({
      modifyPatientName: event.detail
    })
  },
  //获取患者医保卡号
  getMedicalCard(event) {
    this.setData({
      modifyPatientmedicalInsuranceCardNumberValue: event.detail
    })
  },
  //选择患者性别
  bindGenderChange: function (e) {
    this.setData({
      showPatientGender: this.data.arryGender[e.detail.value]
    })
    //根据患者性别分别赋值
    if (this.data.arryGender[e.detail.value] == "女") {
      this.setData({
        modifyPatientGender: 'F'
      })
    } else if (this.data.arryGender[e.detail.value] == "男") {
      this.setData({
        modifyPatientGender: 'M'
      })
    }
    console.log('患者性别===>', this.data.arryGender[e.detail.value])
  },
  //获取患者电话
  getPatientPhone(event) {
    if (event.detail.length != 0) {
      this.setData({
        modifyPatientPhone: event.detail
      })
    } else {
      this.setData({
        modifyPatientPhone: null
      })
    }
  },
  //婚姻状况添加
  bindMarriageChange: function (e) {
    this.setData({
      showPatientMarriage: this.data.arrayMarriage[e.detail.value]
    })
    //根据婚姻状况不同赋值
    if (this.data.arrayMarriage[e.detail.value] == "离婚") {
      this.setData({
        modifyPatientMarriage: 'D'
      })
    } else if (this.data.arrayMarriage[e.detail.value] == "已婚") {
      this.setData({
        modifyPatientMarriage: 'M'
      })
    } else if (this.data.arrayMarriage[e.detail.value] == "丧偶") {
      this.setData({
        modifyPatientMarriage: 'W'
      })
    } else if (this.data.arrayMarriage[e.detail.value] == "未婚") {
      this.setData({
        modifyPatientMarriage: 'B'
      })
    } else if (this.data.arrayMarriage[e.detail.value] == "其他") {
      this.setData({
        modifyPatientMarriage: 'O'
      })
    }
    console.log('患者婚姻状况===>', this.data.arrayMarriage[e.detail.value])
  },
  //患者生日
  bindDateChange: function (e) {
    console.log('患者生日===>', e.detail.value)
    this.setData({
      modifyPatientBirth: e.detail.value
    })
  },
  //患者关系类型
  bindRelationshipType: function (e) {
    this.setData({
      showPatientRelationshipType: this.data.arrayRelationshipType[e.detail.value]
    })
    //根据患者关系类型赋值
    if (this.data.arrayRelationshipType[e.detail.value] == "父母") {
      this.setData({
        modifyPatientRelationshipType: '2',
      })
    } else if (this.data.arrayRelationshipType[e.detail.value] == "配偶") {
      this.setData({
        modifyPatientRelationshipType: '5'
      })
    } else if (this.data.arrayRelationshipType[e.detail.value] == "子女") {
      this.setData({
        modifyPatientRelationshipType: '3'
      })
    } else if (this.data.arrayRelationshipType[e.detail.value] == "其他") {
      this.setData({
        modifyPatientRelationshipType: '4'
      })
    }
    console.log('患者关系类型===>', this.data.arrayRelationshipType[e.detail.value])
  },
  //获取患者身份证号
  getPatientIdNumber(event) {
    this.setData({
      modifyPatientIdnumber: event.detail
    })
  },
  //宗教信仰
  bindFaithChange: function (e) {
    this.setData({
      modifyPatientFaith: this.data.arryFaith[e.detail.value]
    })
    console.log('患者宗教信仰===>', this.data.arryFaith[e.detail.value])
  },
  //民族
  bindNationalityChange: function (e) {
    this.setData({
      showPatientNationality: this.data.arrayNationality[e.detail.value],
      modifyPatientNationality: parseInt(e.detail.value) + parseInt(1),
    })
    console.log('修改民族为==>', this.data.arrayNationality[e.detail.value])
  },
  //患者别名
  getPatientAlias(event) {
    this.setData({
      modifyPatientAlias: event.detail
    })
  },
  //是否退伍军人
  bindChangeVeteranStatus: function (e) {
    this.setData({
      modifyPatientWhetherVeteran: this.data.arryYesNo[e.detail.value]
    })
    console.log('患者===>', this.data.arryYesNo[e.detail.value] + "退伍军人")
  },
  //是不是多胞胎
  bindChangeMultipleBirths: function (e) {
    this.setData({
      showPatientWhetherMultiple: this.data.arryYesNo[e.detail.value]
    })
    if (this.arryYesNo[e.detail.value] == '是') {
      this.setData({
        modifyPatientWhetherMultiple: 'Y'
      })
    } else if (this.arryYesNo[e.detail.value] == '不是') {
      this.setData({
        modifyPatientWhetherMultiple: 'N'
      })
    }
    console.log('患者===>', this.arryYesNo[e.detail.value] + "多胞胎")
  },
  //患者母亲名字
  getPatientMotherName(event) {
    this.setData({
      modifyPatientMotherName: event.detail
    })
  },
  //患者家中电话
  getPatientHomePhone(event) {
    this.setData({
      modifyPatientHomePhone: event.detail
    })
  },
  //患者地址
  bindPatientAddressChange: function (e) {
    console.log('新建档案患者地址===>', e.detail.value.join("-"))
    this.setData({
      modifyPatientLiveAddress: e.detail.value.join("-")
    })
  },
  //出生地
  bindPlaceBirthChange: function (e) {
    console.log('新建档案患者出生地===>', e.detail.value.join("-"))
    this.setData({
      modifyPatientPlaceBirth: e.detail.value.join("-")
    })
  },
  /**
   * 修改患者档案信息提交
   */
  modifyPatientFile: function () {
    if (this.data.modifyPatientPhone != null) {
      if (Api.validatemobile(this.data.modifyPatientPhone)) {
        this.modifyPatientInfo()
      } else {
        Api.wxToast('请输入正确格式的手机号')
      }
    } else {
      this.modifyPatientInfo()
    }
  },
  modifyPatientInfo() {
    request.httpUpdate("/api/PatientInfo", this.data.patientId, {
      "patientName": this.data.modifyPatientName.toString(), //名字
      "sex": this.data.modifyPatientGender, //性别
      "phoneNumberBusiness": this.data.modifyPatientPhone, //电话
      "maritalStatus": this.data.modifyPatientMarriage, //婚姻状况
      "birthday": this.data.modifyPatientBirth, //生日
      "idNumber": this.data.modifyPatientIdnumber, //身份证号
      "religion": this.data.modifyPatientFaith, //宗教信仰
      "ethnicGroup": this.data.modifyPatientNationality, //民族
      "veteransMilitaryStatus": this.data.modifyPatientWhetherVeteran, //退伍军人标识
      "patientAlias": this.data.modifyPatientAlias, //别名
      "multipleBirthIndicator": this.data.modifyPatientWhetherMultiple, //是否多胞胎
      "motherName": this.data.modifyPatientMotherName, //母亲名字
      "phoneNumberHome": this.data.modifyPatientHomePhone, //家中电话
      "patientAddress": this.data.modifyPatientLiveAddress, //患者地址
      "birthPlace": this.data.modifyPatientPlaceBirth, //患者出生地址
      "medicalInsuranceCardNumber": this.data.modifyPatientmedicalInsuranceCardNumberValue, //患者医保卡号
    }, {
      "patientName": this.data.patientName
    }).then(data => {
      console.log('患者档案信息修改成功===>', data);
    }).catch(err => {
      console.error('患者档案信息修改失败===>', err);
    })
    //患者家庭类型修改
    request.httpUpdate("/api/MembershipPersonalFamily", this.data.typeInfoId, {
      "type": this.data.modifyPatientRelationshipType,
      "uid": this.data.uid,
    }, {
      "pid": this.data.patientId
    }).then(data => {
      console.log('患者关系类型修改成功===>', data);
      wx.navigateBack({
        delta: 2
      })
    }).catch(err => {
      console.error('患者关系类型修改失败===>', err);
    })
  },
  //获取患者档案详情
  getPatientInfo() {
    var that = this;
    request.httpFind("/api/PatientInfo", {
        id: this.data.patientId
      })
      .then(res => {
        console.log('当前患者档案信息==modifyPatientFile==>', JSON.stringify(res.data.data))
        console.log('当前患者id==modifyPatientFile==>', this.data.patientId)
        that.setData({
          patientValueArry: res.data.data
        })
        that.showPatientInfo()
      })
  },
  /**
   * 患者档案信息页面展示
   */
  showPatientInfo() {
    var patientInfo = this.data.patientValueArry[0]
    //患者医保卡号
    if (patientInfo.medicalInsuranceCardNumber != null) {
      this.setData({
        modifyPatientmedicalInsuranceCardNumberValue: patientInfo.medicalInsuranceCardNumber
      })
    }
    //患者名字
    this.setData({
      modifyPatientName: patientInfo.patientName
    })
    //患者性别
    if (patientInfo.sex == "F") {
      this.setData({
        showPatientGender: '女',
        modifyPatientGender: 'F'
      })
    } else if (patientInfo.sex == "M") {
      this.setData({
        showPatientGender: '男',
        modifyPatientGender: 'M'
      })
    }
    //患者电话
    this.setData({
      modifyPatientPhone: patientInfo.phoneNumberBusiness
    })
    //患者婚姻状况
    if (patientInfo.maritalStatus == "D") {
      this.setData({
        showPatientMarriage: '离婚',
        modifyPatientMarriage: 'D'
      })
    } else if (patientInfo.maritalStatus == "M") {
      this.setData({
        showPatientMarriage: '已婚',
        modifyPatientMarriage: 'M'
      })
    } else if (patientInfo.maritalStatus == "W") {
      this.setData({
        showPatientMarriage: '丧偶',
        modifyPatientMarriage: 'W'
      })
    } else if (patientInfo.maritalStatus == "B") {
      this.setData({
        showPatientMarriage: '未婚',
        modifyPatientMarriage: 'B'
      })
    } else if (patientInfo.maritalStatus == "O") {
      this.setData({
        showPatientMarriage: '其他',
        modifyPatientMarriage: 'O'
      })
    }
    //患者生日
    this.setData({
      modifyPatientBirth: new Date(patientInfo.birthday.replace(/-/g, '/')).dateFormat('yyyy-MM-dd')
    })
    //身份证号
    if (patientInfo.idNumber != null) {
      this.setData({
        modifyPatientIdnumber: patientInfo.idNumber
      })
    }
    //宗教信仰
    if (patientInfo.religion != null) {
      this.setData({
        modifyPatientFaith: patientInfo.religion
      })
    }
    //患者关系类型
    if (this.data.patientType == "1") {
      this.setData({
        showPatientRelationshipType: '本人',
        modifyPatientRelationshipType: '1'
      })
    } else if (this.data.patientType == "2") {
      this.setData({
        showPatientRelationshipType: '父母',
        modifyPatientRelationshipType: '2',
        hideFileType: true
      })
    } else if (this.data.patientType == "3") {
      this.setData({
        showPatientRelationshipType: '子女',
        modifyPatientRelationshipType: '3',
        hideFileType: true
      })
    } else if (this.data.patientType == "4") {
      this.setData({
        showPatientRelationshipType: '其他',
        modifyPatientRelationshipType: '4',
        hideFileType: true
      })
    } else if (this.data.patientType == "5") {
      this.setData({
        showPatientRelationshipType: '配偶',
        modifyPatientRelationshipType: '5',
        hideFileType: true
      })
    }
    //患者民族  
    if (patientInfo.ethnicGroup != null) {
      this.setData({
        showPatientNationality: resource.getNationalityArray()[parseInt(patientInfo.ethnicGroup) - 1],
        modifyPatientNationality: parseInt(patientInfo.ethnicGroup),
      })
    }
    //是否退伍军人
    if (patientInfo.veteransMilitaryStatus != null) {
      this.setData({
        modifyPatientWhetherVeteran: patientInfo.veteransMilitaryStatus
      })
    }
    //患者别名
    if (patientInfo.patientAlias != null) {
      this.setData({
        modifyPatientAlias: patientInfo.patientAlias
      })
    }
    //是否多胞胎
    if (patientInfo.multipleBirthIndicator != null) {
      if (patientInfo.multipleBirthIndicator == 'Y') {
        this.setData({
          showPatientWhetherMultiple: '是',
          modifyPatientWhetherMultiple: 'Y'
        })
      } else if (patientInfo.multipleBirthIndicator == 'N') {
        this.setData({
          showPatientWhetherMultiple: '不是',
          modifyPatientWhetherMultiple: 'N'
        })
      }
    }
    //母亲名字
    if (patientInfo.motherName != null) {
      this.setData({
        modifyPatientMotherName: patientInfo.motherName
      })
    }
    //家中电话
    if (patientInfo.phoneNumberHome != null) {
      this.setData({
        modifyPatientHomePhone: patientInfo.phoneNumberHome
      })
    }
    //患者地址
    if (patientInfo.patientAddress != null) {
      this.setData({
        modifyPatientLiveAddress: patientInfo.patientAddress
      })
    }
    //出生地
    if (patientInfo.birthPlace != null) {
      this.setData({
        modifyPatientPlaceBirth: patientInfo.birthPlace
      })
    }
  },
  /**
   * 点击"次要信息(选填)设置次要信息的显示状态""
   */
  setSecondaryInfoShow: function () {
    var that = this;
    if (this.data.secondary_info_show) {
      that.setData({
        secondary_info_show: false,
        tipContentTag:true,
      })
    } else {
      that.setData({
        secondary_info_show: true,
        tipContentTag:false,
      })
    }
  }
})