// pages/address/address.js
import request from "../../utils/request.js"
import areaList from "../../utils/getAllRegion.js"
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    areaList: {},
    loading: false,
    show: false,
    userInfo: {},
    protoUserInfo: {},
    error: {
      telNumber: ""
    }
  },
  getlocation(e) {
    console.log('--getlocation--')
    var that = this
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        var {
          userInfo
        } = that.data
        userInfo.detailInfo = res.address.split("区")[1]
        that.setData({
          userInfo
        })
      },
      fail: function(res) {
        console.log(res);
      }
    })
  },
  toggleShow(e) {
    this.setData({
      show: !this.data.show
    })
  },
  hideShow(e) {
    this.setData({
      show: false
    })
  },
  changeTag(e) {
    var {
      userInfo
    } = this.data
    userInfo.tag = e.detail
    this.setData({
      userInfo
    })
  },
  changeUsername(e) {
    var {
      userInfo,
      error
    } = this.data
    userInfo.userName = e.detail.value
    if (e.detail.value) {
      error.userName = ""
    }
    this.setData({
      userInfo,
      error
    })
  },
  changeNationalCode(e) {
    var {
      userInfo
    } = this.data
    userInfo.nationalCode = e.detail.value
    this.setData({
      userInfo
    })

  },
  changeTelNumber(e) {
    var {
      userInfo,
      error
    } = this.data
    // if (e.detail.value && (/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value))) {
    //   error.telNumber = ""
    // }
    userInfo.telNumber = e.detail.value
    this.setData({
      userInfo,
      error
    })

  },
  changeDetailInfo(e) {
    var {
      userInfo,
      error
    } = this.data
    if (e.detail.value) {
      error.detailInfo = ""
    }
    userInfo.detailInfo = e.detail.value
    this.setData({
      userInfo,
      error
    })

  },
  changePostalCode(e) {
    var {
      userInfo
    } = this.data
    userInfo.postalCode = e.detail.value
    this.setData({
      userInfo
    })

  },
  changeAddress(e) {
    console.log(e)
    var {
      userInfo,
      error
    } = this.data
    if (e.detail.values) {
      error.address = ""
    }
    userInfo.provinceName = e.detail.values[0].name
    userInfo.cityName = e.detail.values[1].name
    userInfo.countyName = e.detail.values[2].name

    this.setData({
      userInfo,
      error
    })

  },
  comfirmAddress(e) {
    this.changeAddress(e)

    this.setData({
      show: false,
    })

  },
  resetAddress() {
    var {
      userInfo,
      protoUserInfo,
      error
    } = this.data
    if (protoUserInfo.provinceName) {
      error.address = ""
    }
    userInfo.provinceName = protoUserInfo.provinceName
    userInfo.cityName = protoUserInfo.cityName
    userInfo.countyName = protoUserInfo.countyName
    this.setData({
      userInfo,
      error,
      show: false
    })

  },
  submit: function() {
    var {
      status,
      userInfo,
      protoUserInfo
    } = this.data
    const {
      cityName,
      provinceName,
      countyName,
      userName,
      telNumber,
      detailInfo,
      id
    } = userInfo
    var isValid = true
    var error = {}
    if (!provinceName || !cityName || !countyName) {
      error.address = "省市区不能为空"
      isValid = false
    }
    if (!detailInfo) {
      error.detailInfo = "详细地址不能为空"
      isValid = false
    }
    if (!telNumber) {
      error.telNumber = "手机号不能为空"
      isValid = false
    }
    // else{
    //   if (!(/^1(3|4|5|7|8)\d{9}$/.test(telNumber))) { 
    //     error.telNumber = "手机号格式不正确"
    //     isValid = false
    //   }
    // }
    if (!userName) {
      error.userName = "收货人不能为空"
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
    // console.log(userInfo)
    userInfo.nationalCode = "00086"
    if (status == 1) {
      request.httpCreate("/api/zyt_deliveryaddress", {
        uid,
        ...userInfo
      }).then((res) => {
        wx.navigateBack({})
      })
    }
    if (status == 2) {

      Dialog.confirm({
        title: "您已修改信息",
        message: "确认修改吗",
        confirmButtonText: "是",
        cancelButtonText: "否",
      }).then(() => {
        return request.httpUpdate("/api/zyt_deliveryaddress", id, {
          uid,
          ...userInfo
        }, {
          uid
        })

      }).then((res) => {
        wx.navigateBack({})
      })
    }

  },

  onShow() {},
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function({
    id = "",
    status = 1,
  
  }) { //1添加2修改
    var that = this;
    let jwt = app.globalData.jwt
    let uid = jwt.isValid() && jwt.payload.userId
    // console.log(app.globalData.jwt.payload)
    // console.log(status)
    if (status == 1) {
      request.httpFind("/api/MembershipPersonalFamily", {
          uid,
          untying: 0,
          type: 1
        })
        .then(res => {
          var data = res.data.data[0]
          return request.httpFind("/api/patientInfo", {
            id: data.pid
          })
        }).then(res => {
          var data = res.data.data[0]
          var userInfo = that.data.userInfo
          console.log(userInfo)
          var protoUserInfo = userInfo
          userInfo.detailInfo = data.patientAddress
          userInfo.telNumber = data.phoneNumberBusiness || data.phoneNumberHome
          this.setData({
            status,
            areaList,
            protoUserInfo,
            userInfo
          })

        })
        .catch((err) => {
          this.setData({
            status,
            areaList
          })
        })


    }
    if (status == 2) {
      request.httpFind("/api/zyt_deliveryaddress", {
          uid,
          isDelete: 0,
          id
        })
        .then((res) => {
          this.setData({
            status,
            areaList,
            userInfo: res.data.data[0],
            protoUserInfo: res.data.data[0]
          })

        })
    }
    wx.hideShareMenu()
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

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
    return getApp().globalData.defaultShareObject;
  }
})