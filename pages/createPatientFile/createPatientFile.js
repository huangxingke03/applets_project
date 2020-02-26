// pages/newPatientFile/newPatientFile.js
//患者档案新增页面
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp()
var resource = require("../../utils/resource.js");
var Api = require("../../utils/util.js");
import request from '../../utils/request.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    arrayNationality: resource.getNationalityArray(),
    arrayMarriage: app.globalData.marriage,
    arryGender: app.globalData.gender,
    arryYesNo: app.globalData.yesNo,
    arryFaith: app.globalData.faith,
    arryUnknownIdentity: app.globalData.unknownIdentity,
    arrayIdentityCredibility: app.globalData.identityCredibility,
    arrayRelationshipType: app.globalData.relationshipType,
    arrayPatientLiving: app.globalData.patientLiving,
    //患者名字
    createPatientNameValue: null,
    //患者性别
    createPatientGenderValue: null,
    showPatientGender: null,
    //患者电话
    createPatientPhoneValue: null,
    //患者婚姻状况
    createPatientMarriage: null,
    showPatientMarriage: null,
    //患者生日
    createPatientBirth: null,
    //患者关系类型
    createPatientRelationshipType: null,
    showPatientRelationshipType: null,
    //患者身份证号
    createPatientIdnumber: null,
    //患者宗教信仰
    createPatientFaith: null,
    //患者民族
    createPatientNationality: null,
    showPatientNationality: null,
    //患者身份可信度
    createPatientIdentityCredibility: null,
    showPatientIdentityCredibility: null,
    //患者未知身份标识
    createPatientUnknownIdentity: null,
    showPatientUnknownIdentity: null,
    //患者别名
    createPatientAlias: null,
    //患者母亲名字
    createPatientMotherName: null,
    //患者家中电话
    createPatientHomePhone: null,
    //是否退伍军人
    createPatientWhetherVeteran: null,
    //是否多胞胎
    createPatientWhetherMultiple: null,
    showPatientWhetherMultiple: null,
    //是否死亡
    createPatientWhetherDead: null,
    showPatientWhetherDead: null,
    //患者帐号
    createPatientAccount: null,
    //患者地址
    createPatientLiveAddress: null,
    //患者出生地
    createPatientPlaceBirth: null,
    //添加本人档案
    addSelfFile: true,
    //添加家人档案
    addFamilyFile: false,
    //患者医保卡号
    createPatientMedicalCard: null,
    //0826 创建本人类型档案    0926创建父母 子女 其他类型档案
    receiveCreatFileTag: null,
    uidValue: null,
    //提示点击拉开其他信息 默认显示
    tipContentTag: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.sendCreatFileTag != null) {
      this.setData({
        receiveCreatFileTag: options.sendCreatFileTag
      })
    }
    let jwt = app.globalData.jwt;
    if (!jwt.isValid()) { // 如果未登录或者token失效，则跳转登录。
      app.globalData.logout();
    } else {
      //患者婚姻状况默认未婚
      if (this.data.createPatientMarriage == null) {
        this.setData({
          createPatientMarriage: 'B',
          showPatientMarriage: '未婚'
        })
      }
      if (this.data.receiveCreatFileTag == "0826") { //创建本人档案
        console.log("创建本人档案=>")
        this.setData({
          //添加本人档案
          // addSelfFile: true,
          //添加家人档案
          addFamilyFile: false,
          showPatientRelationshipType: "本人",
          createPatientRelationshipType: '1',
          uidValue: jwt.payload.userId
        })
        setTimeout(function () {
          that.getUserPhone(jwt)
        }, 1200)
      } else { //创建 父母 子女 其他类型档案
        console.log("创建家人档案=>")
        this.setData({
          //添加本人档案
          addSelfFile: false,
          //添加家人档案
          addFamilyFile: true,
          uidValue: null
        })
      };
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let arr = getCurrentPages();
    console.log(arr)
    try {
      if (arr && arr.length > 2) {
        console.log(arr[arr.length - 2])
      }
    } catch (err) {
      console.log(err);
    }

  },
  getUserPhone(jwt) {
    var that = this;
    request.httpFind("/api/Users", {
        id: jwt.payload.userId
      })
      .then(res => {
        console.log('当前用户电话==createPatientFile==>', JSON.stringify(res.data.data[0].telphone))
        if (res.data.data[0].telphone != null) {
          that.setData({
            createPatientPhoneValue: res.data.data[0].telphone
          })
        }
      })
  },
  //创建患者档案
  createPatientFile: function () {
    console.log('===createPatientFile===>>', this.data.createPatientRelationshipType)
    if (this.data.receiveCreatFileTag == "0826") { //创建本人档案
      this.setData({
        createPatientRelationshipType: '1'
      })
    }
    //必填项信息判断
    if (this.data.createPatientNameValue == null) {
      Api.wxToast('请填写名字')
    } else if (this.data.createPatientGenderValue == null) {
      Api.wxToast('请选择性别')
    } else if (this.data.createPatientBirth == null) {
      Api.wxToast('请选择生日')
    } else if (this.data.createPatientRelationshipType == null) {
      Api.wxToast('请选择关系')
    } else {
      //默认不是多胞胎
      if (this.data.createPatientWhetherMultiple == null) {
        this.setData({
          createPatientWhetherMultiple: 'N'
        })
      }
      //默认不是退伍军人
      if (this.data.createPatientWhetherVeteran == null) {
        this.setData({
          createPatientWhetherVeteran: '不是'
        })
      }
      //默认患者存活
      if (this.data.createPatientWhetherDead == null) {
        this.setData({
          createPatientWhetherDead: 'N'
        })
      }
      //身份证号如果输入了验证号在创建
      if (this.data.createPatientIdnumber != null) {
        if (!Api.validateIdcard(this.data.createPatientIdnumber)) {
          Api.wxToast('请输入正确的身份证号')
        }
      }
      if (this.data.receiveCreatFileTag == "0826") { //创建本人档案
        if (this.data.createPatientPhoneValue != null) {
          if (Api.validatemobile(this.data.createPatientPhoneValue)) {
            this.judgeHasselfFile(app.globalData.jwt)
          } else {
            Api.wxToast('请输入正确格式的手机号')
          }
        } else {
          this.judgeHasselfFile(app.globalData.jwt)
        }
      } else { //创建家人档案
        if (this.data.createPatientPhoneValue != null) {
          if (Api.validatemobile(this.data.createPatientPhoneValue)) {
            this.patientfileCreate(app.globalData.jwt)
          } else {
            Api.wxToast('请输入正确格式的手机号')
          }
        } else {
          this.patientfileCreate(app.globalData.jwt)
        }
      }
    }
  },
  //获取患者名字
  getPatientName(event) {
    this.setData({
      createPatientNameValue: event.detail
    })
  },
  //获取患者医保卡号
  getMedicalCard(event) {
    this.setData({
      createPatientMedicalCard: event.detail
    })
  },
  onChange(event) {
    const {
      key
    } = event.currentTarget.dataset;
    this.setData({
      [key]: event.detail
    });
  },
  //选择患者性别
  bindGenderChange: function (e) {
    this.setData({
      showPatientGender: this.data.arryGender[e.detail.value]
    })
    //根据患者性别分别赋值
    if (this.data.arryGender[e.detail.value] == "女") {
      this.setData({
        createPatientGenderValue: 'F'
      })
    }
    if (this.data.arryGender[e.detail.value] == "男") {
      this.setData({
        createPatientGenderValue: 'M'
      })
    }
    console.log('新建档案患者性别===>', this.data.arryGender[e.detail.value])
  },
  //获取患者电话
  getPatientPhone(event) {
    console.log('event.detail.length', event.detail.length)
    if (event.detail.length != 0) {
      this.setData({
        createPatientPhoneValue: event.detail
      })
    } else {
      this.setData({
        createPatientPhoneValue: null
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
        createPatientMarriage: 'D'
      })
    } else if (this.data.arrayMarriage[e.detail.value] == "已婚") {
      this.setData({
        createPatientMarriage: 'M'
      })
    } else if (this.data.arrayMarriage[e.detail.value] == "丧偶") {
      this.setData({
        createPatientMarriage: 'W'
      })
    } else if (this.data.arrayMarriage[e.detail.value] == "未婚") {
      this.setData({
        createPatientMarriage: 'B'
      })
    } else if (this.data.arrayMarriage[e.detail.value] == "其他") {
      this.setData({
        createPatientMarriage: 'O'
      })
    }
    console.log('新建档案患者婚姻状况===>', this.data.arrayMarriage[e.detail.value])
  },
  //患者生日
  bindDateChange: function (e) {
    console.log('新建档案患者生日===>', e.detail.value)
    this.setData({
      date: e.detail.value,
      createPatientBirth: e.detail.value
    })
  },
  //患者关系类型
  bindRelationshipType: function (e) {
    this.setData({
      showPatientRelationshipType: this.data.arrayRelationshipType[e.detail.value]
    })
    //根据患者关系类型赋值
    if (this.data.arrayRelationshipType[e.detail.value] == '父母') {
      this.setData({
        createPatientRelationshipType: '2'
      })
    } else if (this.data.arrayRelationshipType[e.detail.value] == '配偶') {
      this.setData({
        createPatientRelationshipType: '5'
      })
    } else if (this.data.arrayRelationshipType[e.detail.value] == '子女') {
      this.setData({
        createPatientRelationshipType: '3'
      })
    } else { //其他
      this.setData({
        createPatientRelationshipType: '4'
      })
    }
    console.log('新建档案患者关系类型===>', this.data.arrayRelationshipType[e.detail.value])
  },
  //获取患者身份证号
  getPatientIdNumber(event) {
    this.setData({
      createPatientIdnumber: event.detail
    })
  },
  //宗教信仰
  bindFaithChange: function (e) {
    this.setData({
      createPatientFaith: this.data.arryFaith[e.detail.value]
    })
    console.log('新建档案患者宗教信仰===>', this.data.arryFaith[e.detail.value])
  },
  //民族
  bindNationalityChange: function (e) {
    this.setData({
      createPatientNationality: parseInt(e.detail.value) + parseInt(1),
      showPatientNationality: this.data.arrayNationality[e.detail.value]
    })
    console.log('创建民族为=>', this.data.arrayNationality[e.detail.value])
  },
  //是否退伍军人
  bindChangeVeteranStatus: function (e) {
    this.setData({
      createPatientWhetherVeteran: this.data.arryYesNo[e.detail.value]
    })
    console.log('新建档案患者===>', this.data.arryYesNo[e.detail.value] + "退伍军人")
  },
  //是不是多胞胎
  bindChangeMultipleBirths: function (e) {
    this.setData({
      showPatientWhetherMultiple: this.data.arryYesNo[e.detail.value]
    })
    if (this.data.arryYesNo[e.detail.value] == '是') {
      this.setData({
        createPatientWhetherMultiple: 'Y'
      })
    } else if (this.data.arryYesNo[e.detail.value] == '不是') {
      this.setData({
        createPatientWhetherMultiple: 'N'
      })
    }
    console.log('新建档案患者===>', this.data.arryYesNo[e.detail.value] + "多胞胎")
  },
  //是否死亡
  bindChangeWhetherDead: function (e) {
    this.setData({
      showPatientWhetherDead: this.data.arrayPatientLiving[e.detail.value]
    })
    if (this.data.arrayPatientLiving[e.detail.value] == '患者已故') {
      this.setData({
        createPatientWhetherDead: 'Y'
      })
    } else if (this.data.arrayPatientLiving[e.detail.value] == '患者存活') {
      this.setData({
        createPatientWhetherDead: 'N'
      })
    }
    console.log('新建档案患者===>', this.data.arrayPatientLiving[e.detail.value])
  },
  //身份可信度
  bindIdentityCredibilityChange: function (e) {
    this.setData({
      showPatientIdentityCredibility: this.data.arrayIdentityCredibility[e.detail.value]
    })
    if (this.data.arrayIdentityCredibility[e.detail.value] == '缺少社会保险号码') {
      this.setData({
        createPatientIdentityCredibility: 'US'
      })
    } else if (this.data.arrayIdentityCredibility[e.detail.value] == '缺少出生日期') {
      this.setData({
        createPatientIdentityCredibility: 'UD'
      })
    } else if (this.data.arrayIdentityCredibility[e.detail.value] == '缺少地址') {
      this.setData({
        createPatientIdentityCredibility: 'UA'
      })
    } else if (this.data.arrayIdentityCredibility[e.detail.value] == '个人姓名是一个化名') {
      this.setData({
        createPatientIdentityCredibility: 'AL'
      })
    }
    console.log('新建档案患者身份可信度===>', this.data.arrayIdentityCredibility[e.detail.value])
  },
  //未知身份标识
  bindUnknownIdentityChange: function (e) {
    this.setData({
      showPatientUnknownIdentity: this.data.arryUnknownIdentity[e.detail.value]
    })
    if (this.data.arryUnknownIdentity[e.detail.value] == '不知道患者个人身份') {
      this.setData({
        createPatientUnknownIdentity: 'Y'
      })
    } else if (this.data.arryUnknownIdentity[e.detail.value] == '知道患者个人身份') {
      this.setData({
        createPatientUnknownIdentity: 'N'
      })
    }
    console.log('新建档案患者未知身份标识===>', this.data.arryUnknownIdentity[e.detail.value])
  },
  //患者别名
  getPatientAlias(event) {
    this.setData({
      createPatientAlias: event.detail
    })
  },
  //患者母亲名字
  getPatientMotherName(event) {
    this.setData({
      createPatientMotherName: event.detail
    })
  },
  //患者家中电话
  getPatientHomePhone(event) {
    this.setData({
      createPatientHomePhone: event.detail
    })
  },
  //患者帐号
  getPatientAccount(event) {
    this.setData({
      createPatientAccount: event.detail
    })
  },
  //患者地址
  bindPatientAddressChange: function (e) {
    console.log('新建档案患者地址===>', e.detail.value.join("-"))
    this.setData({
      createPatientLiveAddress: e.detail.value.join("-")
    })
  },
  //出生地
  bindPlaceBirthChange: function (e) {
    console.log('新建档案患者出生地===>', e.detail.value.join("-"))
    this.setData({
      createPatientPlaceBirth: e.detail.value.join("-")
    })
  },
  /**
   * 点击"次要信息(选填)设置次要信息的显示状态""
   */
  setSecondaryInfoShow: function () {
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
   * 创建患者档案
   */
  patientfileCreate(jwt) {
    var that = this
    request.httpCreate("/api/PatientInfo", {
        patientName: this.data.createPatientNameValue, //名字
        sex: this.data.createPatientGenderValue, //性别
        phoneNumberBusiness: this.data.createPatientPhoneValue, //电话
        maritalStatus: this.data.createPatientMarriage, //婚姻状况
        birthday: this.data.createPatientBirth, //生日
        idNumber: this.data.createPatientIdnumber, //身份证号
        religion: this.data.createPatientFaith, //宗教信仰
        ethnicGroup: this.data.createPatientNationality, //民族
        veteransMilitaryStatus: this.data.createPatientWhetherVeteran, //退伍军人标识
        identityReliabilityCode: this.data.createPatientIdentityCredibility, //身份可信度
        identityUnknownIndicator: this.data.createPatientUnknownIdentity, //未知身份标识
        patientAlias: this.data.createPatientAlias, //别名
        multipleBirthIndicator: this.data.createPatientWhetherMultiple, //是否多胞胎
        motherName: this.data.createPatientMotherName, //母亲名字
        phoneNumberHome: this.data.createPatientHomePhone, //家中电话
        patientDeathIndicator: this.data.createPatientWhetherDead, //是否死亡标识
        patientAccountNumber: this.data.createPatientAccount, //患者帐号
        patientAddress: this.data.createPatientLiveAddress, //患者地址
        birthPlace: this.data.createPatientPlaceBirth, //患者出生地址
        medicalInsuranceCardNumber: this.data.createPatientMedicalCard, //患者医保卡号
        uid: this.data.uidValue
      })
      .then(res => {
        console.log('患者档案创建成功==createPatientFile==>' + JSON.stringify(res.data))
        // 此处将 新建患者信息作为 返回值传回调用 前一页面，
        // 前一页面 无论 是否使用可在data中添加字段 
        // newPatientInfo: null 这样可以避免 走catch 打印报错信息
        let arr = getCurrentPages();
        console.log("pageArr", arr)
        try {
          if (arr && arr.length >= 2) {
            var newPatientInfo = res.data
            newPatientInfo.relationship = that.data.createPatientRelationshipType
            arr[arr.length - 2].setData({
              newPatientInfo
            })
          }
        } catch (err) {
          console.log(err);
        }
        //患者家庭类型关联
        request.httpCreate("/api/MembershipPersonalFamily", {
            pid: res.data.id,
            type: that.data.createPatientRelationshipType, //关系类型
            uid: jwt.payload.userId
          })
          .then(res => {
            console.log('患者档案家庭类型关联成功==createPatientFile==>' + JSON.stringify(res.data))
            wx.navigateBack({
              delta: 1,
            })
          })
      })
  },
  //判断当前用户是否具有本人档案
  judgeHasselfFile(jwt) {
    request.httpFind("/api/server_membershipPersonalFamily", {
        uid: jwt.payload.userId,
        type: 1,
        untying: 0
      })
      .then(res => {
        if (res.msg == '查询成功' && res.data.data.length != '0') { //具有本人档案时,提示具有本人档案
          console.log('judgeHasselfFile==createPatientFile==>', '创建本人档案时已有本人档案')
          Api.wxToast('当前用户已有本人档案')
        } else if (res.msg == '查询成功' && res.data.data.length == '0') { //没有本人档案时,创建本人档案
          console.log('judgeHasselfFile==createPatientFile==>', '创建本人档案时没有本人档案')
          this.patientfileCreate(app.globalData.jwt)
        }
      })
  },
})