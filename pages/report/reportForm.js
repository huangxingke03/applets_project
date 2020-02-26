// pages/report/reportForm.js
const app = getApp()
import request from "../../utils/request.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientInfo: null,
    show: false,
    error: {},
    isIphoneX: app.globalData.isIphoneX,
    placeholderText: "详细主诉：如病史，主要需求等。",
    placeholder: "详细主诉：如病史，主要需求等。",
    actions: [{
        name: '男',
        value: "M"
      },
      {
        name: "女",
        value: "F"

      }
    ],
    family: [{

    }],
    gender: {
      M: "男",
      F: "女"
    },
    patientInfo: {},
    //更新手机号标志
    updatePhoneTag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    if (!app.globalData.jwt.isValid()) { // 如果未登录，保存当前页面信息，跳出进行登录
      app.globalData.logout(app.globalData.getCurrentURL(this));
      return
    }
    var that = this;
    let jwt = app.globalData.jwt
    let uid = jwt.isValid() && jwt.payload.userId
    let dataarr = []

    request.httpFind("/api/MembershipPersonalFamily", {
        uid,
        untying: 0,
        $sort: {
          createdAt: 1
        }
      })
      .then(res => {
        console.log("mebershippersonalfamily", res)
        dataarr = res.data.data
        let promiseArr = []
        dataarr.map((item) => {
          promiseArr.push(
            request.httpGet("/api/patientInfo", item.pid)
          )
        })
        return Promise.all(promiseArr)
      }).then(res => {
        let family = []
        let resarr = res || []
        let data = {}
        let hasSelf = false
        resarr.map(function (item, i) {
          item.data.name = item.data.patientName
          if (dataarr[i].type == 1) {
            hasSelf = true
            data = item.data
          } else {
            family.push(item.data)
          }

        })
        if (JSON.stringify(data) == "{}") {
          console.log(family)
          if (family.length > 0 && family[0].data)
            data = family[0].data

          family.push({
            name: "新建个人档案",
            newSelf: true,
          })
        }
        // 添加新建档案选项
        family.push({
          name: "新建家人档案",
          new: true,
        })
        if (JSON.stringify(data) != "{}") {
          data.name = data.name + " (本人)"
          family.unshift(data)
        }
        var patientInfo = data || {}
        patientInfo.telNumber = data.phoneNumberBusiness || data.phoneNumberHome
        patientInfo.userName = data.patientName
        patientInfo.gender = data.sex
        console.log(patientInfo)
        this.setData({
          patientInfo,
          family,
          domain: app.globalData.domain,
          hasSelf,
          ...option
        })
        this.setupdatePhoneTag()
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var {
      newPatientInfo
    } = this.data
    if (newPatientInfo && newPatientInfo.patientName && newPatientInfo.sex) {
      1
      newPatientInfo.telNumber = newPatientInfo.phoneNumberBusiness || newPatientInfo.phoneNumberHome
      newPatientInfo.userName = newPatientInfo.patientName
      newPatientInfo.name = newPatientInfo.patientName
      newPatientInfo.gender = newPatientInfo.sex
      console.log("返回信息", newPatientInfo)
      this.onLoad({
        newPatientInfo: [],
        patientInfo: newPatientInfo
      })
    }
  },
  //提交时是否更新患者档案手机号
  setupdatePhoneTag() {
    console.log("setupdatePhoneTag",this.data.patientInfo)
    if (this.data.patientInfo.telNumber == null) { //提交申请时更新患者手机号
      this.setData({
        updatePhoneTag: true,
      })
    } else { //提交申请时不更新手机号
      this.setData({
        updatePhoneTag: false,
      })
    }
  },
  onSelect(e) {
    var gender = e.detail.value;
    var {
      patientInfo
    } = this.data
    patientInfo.gender = gender
    this.setData({
      patientInfo,
      show: false
    })
  },
  onSelect2(e) {
    console.log(e)
    var data = e.detail
    var patientInfo = e.detail
    // 如果data 有new 这个属性 则是是新建档案 
    if (data.new || data.newSelf) {
      let url = '/pages/createPatientFile/createPatientFile';
      if (data.newSelf) {
        url = '/pages/createPatientFile/createPatientFile?sendCreatFileTag=0826';
      }
      // console.log(url)
      this.setData({
        show2: false,
      })
      wx.navigateTo({
        url,
      })
      return
    }
    //如果不是就切换档案
    patientInfo.telNumber = data.phoneNumberBusiness || data.phoneNumberHome
    patientInfo.userName = data.patientName
    patientInfo.name = data.patientName
    patientInfo.gender = data.sex
    this.setData({
      patientInfo,
      show2: false
    })
    this.setupdatePhoneTag()
  },
  toggleShow(e) {
    this.setData({
      show: !this.data.show,
      placeholder: ""
    })
  },
  toggleShow2(e) {
    this.setData({
      show2: !this.data.show2,
      placeholder: ""
    })
  },
  hideShow(e) {
    this.setData({
      show: false,
      placeholder: this.data.placeholderText
    })
  },
  hideShow2(e) {
    this.setData({
      show2: false,
      placeholder: this.data.placeholderText
    })
  },
  changeTag(e) {
    var {
      patientInfo
    } = this.data
    patientInfo.tag = e.detail
    this.setData({
      patientInfo
    })
  },
  changeUsername(e) {
    var {
      patientInfo,
      error
    } = this.data
    patientInfo.userName = e.detail.value
    if (e.detail.value) {
      error.userName = ""
    }
    this.setData({
      patientInfo,
      error
    })
  },
  changeTelNumber(e) {
    var {
      patientInfo,
      error
    } = this.data
    if (e.detail.value) {
      error.telNumber = ""
    }
    patientInfo.telNumber = e.detail.value
    this.setData({
      patientInfo,
      error
    })

  },
  changeDetailInfo(e) {
    console.log(e)
    var {
      patientInfo,
      error
    } = this.data
    if (e.detail) {
      error.detailInfo = ""
    }
    patientInfo.detailInfo = e.detail
    this.setData({
      patientInfo,
      error
    })

  },
  submit: function () {
    var {
      status,
      patientInfo,
      updatePhoneTag
    } = this.data
    const {
      userName,
      telNumber,
      detailInfo
    } = patientInfo
    var isValid = true
    var error = {}
    if (!detailInfo) {
      error.detailInfo = "主诉不能为空"
      isValid = false
    }
    if (!telNumber) {
      error.telNumber = "手机号不能为空"
      isValid = false
    } 
    if(updatePhoneTag){ //更新患者手机号
      request.httpUpdate("/api/PatientInfo", patientInfo.id, {
        "phoneNumberBusiness": telNumber,
      }, {
        "id": patientInfo.id
      }).then(data => {
        console.log('手机号更新成功===>', data);
      }).catch(err => {
        console.error('手机号更新失败===>', err);
      })
    }
    // else{
    //   if (!(/^1(3|4|5|7|8)\d{9}$/.test(telNumber))) { 
    //     error.telNumber = "手机号格式不正确"
    //     isValid = false
    //   }
    // }
    if (!userName) {
      error.userName = "名字不能为空"
      isValid = false
    }
    if (!isValid) {
      this.setData({
        error
      })
      return false
    }
 
    let jwt = app.globalData.jwt
    let uid = jwt.isValid() && jwt.payload.userId

    console.log(patientInfo)
    request.httpCreate("/api/RegistrationPrior", {
      pid: patientInfo.id,
      readme: patientInfo.detailInfo,
      source: 2
    }).then((res) => {
      console.log(res)
      var data = res.data
      var name = this.data.patientInfo.userName
      wx.redirectTo({
        url: 'report?id=' + data.id + "&&pid=" + data.pid + "&&name=" + name,
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    // return {
    //   title: "申请中医辅诊",
    //   path: "/pages/report/reportForm"
    // }
  }
})