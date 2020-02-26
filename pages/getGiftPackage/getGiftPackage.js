// miniprogram/pages/addGiftPackage/addGiftPackage.js
var Api = require("../../utils/util.js");
const app = getApp()
import request from '../../utils/request.js';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js'
import enumVal from '../../utils/enum.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //赠送码
    giftCodeValue: '',
    //是否正在加载
    whether_loading: false,
    //是否加载成功
    whether_success: false,
    //是否加载失败
    whether_failure: false,
    //领取套餐失败提示文案
    failureTitleValue: '',
    jwtValue: null,
    //获取套餐失败未知错误,网络请求错误时显示
    unknown_internet_error: false,
    whether_back: false,
    //是否显示套餐信息
    whether_show_package: false,
    //套餐名称
    package_name_value: null,
    //套餐介绍
    package_details_value: null,
    //获取套餐信息失败再次获取
    retry_receive_package: false,
    zh_number: [
      "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"
    ],
    height: ["392px", "196px"],
    //套餐信息
    packageInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.jwt.isValid()) { // 如果未登录，保存当前页面信息，跳出进行登录
      app.globalData.logout(app.globalData.getCurrentURL(this));
      return;
    }
    app.globalData.giftTag = true;
    console.log("app.globalData.giftTag", app.globalData.giftTag)
    let jwt = app.globalData.jwt;
    this.setData({
      jwtValue: jwt
    })
    if (options.giftCode) { //扫描二维码后进入该页面,并获取赠送码
      this.setData({
        giftCodeValue: options.giftCode,
      })
      //获取赠送套餐
      this.getGiftPackage(app.globalData.jwt)
    }
    //检查当前用户是否有手机号,没有就获取
    request.httpFind("/api/users", {
      id: app.globalData.jwt.payload.userId
    })
      .then(res => {
        console.log('users')
        console.log(res.data.data)
        if (res.data.data && res.data.data[0]) {
          console.log('检查个人信息中')
          var user = res.data.data[0]
          // user.nickname = userInfo.nickName
          console.log({
            ...user
          })
          if (!user.telphone || user.telphone == null || user.telphone == "") {
            wx.navigateTo({
              url: '../auth/authPhone?fromGetGiftPackage=true',
            });
          }
          if (!user.nickname || user.nickname == "") {
            request.httpUpdate("/api/users", app.globalData.jwt.payload.userId, user, {
              isDelete: 0
            })
          }
        }
      }).then(res => {
        console.log(res)
      })
    // if (options.isShare){
    //     this.setData({
    //       giftCodeValue: '8zo0v2HJojJSZdjBHbIG5C8OrQ8',
    //     })
    //     //获取赠送套餐
    //     this.getGiftPackage(app.globalData.jwt)
    //   }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // let title = "小优家庭医生"
    // return {
    //   title: title,
    //   path: app.globalData.getCurrentURL(this) + "&giftCode=8zo0v2HJojJSZdjBHbIG5C8OrQ8"
    // };
    // return getApp().globalData.defaultShareObject;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 返回首页index页面
   */
  backIndex: function() {
    app.globalData.giftTag = false;
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  /**
   * 根据赠送码领取套餐
   */
  retryGet: function() {
    this.setData({
      whether_failure: false,
      whether_loading: true
    })
    setTimeout(() => {
      this.setData({
        whether_loading: false
      })
      this.addGiftPackage(this.data.jwtValue)
    }, 2000)
  },
  /**
   * 根据赠送码重试领取套餐
   */
  receivePackage: function() {
    this.setData({
      whether_failure: false,
      whether_loading: true,
      whether_show_package: false
    })
    setTimeout(() => {
      this.setData({
        whether_loading: false
      })
      this.addGiftPackage(this.data.jwtValue)
    }, 2000)
  },
  /**
   * 获取赠送套餐内容
   */
  retryReceivePackage: function() {
    this.setData({
      whether_failure: false,
      retry_receive_package: false
    })
    this.getGiftPackage(app.globalData.jwt)
  },
  collapse: function() {
    var maxHeight;
    var i = 1;
    console.log('this.data.data:', this.data.data)
    this.data.data.map((item) => {
      console.log('item.packageinfo:', item.packageinfo)
      console.log('i:', i)
      // console.log
      if (i < item.packageinfo.length)
        i = item.packageinfo.length
    })
    var j = 1;
    this.data.data.map((item) => {
      item.packageinfo.map((itemJ) => {
        console.log('itemJ.items:', itemJ.items)
        console.log('j:', j)
        if (j < itemJ.items.length)
          j = itemJ.items.length
      })
    })
    if (this.data.height[0] == "392px")
      this.setData({
        height: [j * 98 * i + 196 + "px", j * 98 + "px"]
      })
    else {
      this.setData({
        height: ["392px", "196px"]
      })
    }
  },
  /**
   * 根据赠送码添加套餐
   */
  addGiftPackage(jwt) {
    let params = {
      uid: jwt.payload.userId,
      giftcode: this.data.giftCodeValue,
    }
    console.log("params", params)
    request.httpFind('/api/server_activityGiftPackageQRCode', params).then(res => {
      console.log('====>>>server_activityGiftPackageQRCode:res', res);
      if (res.code === enumVal.Success) {
        console.log('====>>>server_activityGiftPackageQRCode:res.data:res.data.code', res.data, res.data.code);
        if (res.data && res.data.code == '200') { //获取套餐成功
          this.setData({
            whether_success: true
          })
        } else if (res.data && res.data.code == '400') { //获取套餐失败,未知错误
          this.setData({
            whether_failure: true,
            failureTitleValue: '获取套餐失败：未知错误',
            unknown_internet_error: true
          })
        } else if (res.data && res.data.code == '405') { //获取套餐失败,该套餐已禁用
          this.setData({
            whether_failure: true,
            failureTitleValue: '获取套餐失败：该套餐已禁用',
            whether_back: true
          })
        } else if (res.data && res.data.code == '403') { //赠送码已使用
          this.setData({
            whether_failure: true,
            failureTitleValue: '获取套餐失败：已经使用过该赠送码',
            whether_back: true
          })
        } else if (res.data && res.data.code == '406') { //赠送码不存在
          this.setData({
            whether_failure: true,
            failureTitleValue: '获取套餐失败：赠送码不存在',
            whether_back: true
          })
        } else if (res.data && res.data.code == '416') { //套餐不能重复添加
          this.setData({
            whether_failure: true,
            failureTitleValue: '获取套餐失败：套餐不能重复添加',
            whether_back: true
          })
        } else if (res.data && res.data.code == '40301') { //赠送码已失效
          this.setData({
            whether_failure: true,
            failureTitleValue: '获取套餐失败：赠送码已失效',
            whether_back: true
          })
        } else if (res.data && res.data.code == '40302') { //活动尚未开始
          this.setData({
            whether_failure: true,
            failureTitleValue: '获取套餐失败：活动尚未开始',
            whether_back: true
          })
        } else if (res.data && res.data.code == '40303') { //活动已经结束
          this.setData({
            whether_failure: true,
            failureTitleValue: '获取套餐失败：活动已经结束',
            whether_back: true
          })
        }
      } else { //网络问题获取失败
        this.setData({
          whether_failure: true,
          failureTitleValue: '获取套餐失败：网络请求失败',
          unknown_internet_error: true
        })
      }
    }).catch(err => {
      console.log('获取赠送套餐失败：', err)
      this.setData({
        whether_failure: true,
        failureTitleValue: '获取套餐失败：网络请求失败',
        unknown_internet_error: true
      })
    })
  },
  /**
   * 获取赠送套餐内容
   */
  getGiftPackage(jwt) {
    console.log('--jwt.payload.userId--', jwt.payload.userId)
    var that = this
    //通过赠送码获取套餐id
    request.httpFind('/api/activityGiftPackageQRCode', {
      giftcode: this.data.giftCodeValue
    }).then(res => {
      console.log('====>>>activityGiftPackageQRCode :res', res);
      if (res.code === enumVal.Success) {
        let dataValue = res.data.data
        console.log('====>>>activityGiftPackageQRCode:dataValue', dataValue);
        console.log('====>>>activityGiftPackageQRCode:dataValue[0].packageId', dataValue[0].packageId);
        //获取套餐服务内容
        var data = []
        console.log('server_chargepackage:userid,cpid', jwt.payload.userId, dataValue[0].packageId)
        var userid = jwt.payload.userId
        request.httpFind("/api/server_chargepackage", {
            userid: userid,
            cpid: dataValue[0].packageId
            // cpid: 18
          })
          .then(res => {
            console.log("server_chargepackage:res", res)
            console.log("server_chargepackage:res.data.data", res.data.data)
            if (res.data.code == 200) {
              data = res.data.data
              data.map(function(item, index) {
                var needcount = item.packageinfo.length;
                item.packageinfo.map(function(itemj, indexJ) {
                  needcount += itemj.items.length
                })
                item.need_collapse = needcount > 6
              })
              this.setData({
                whether_show_package: true,
                data
              })
            } else {
              this.setData({
                whether_failure: true,
                failureTitleValue: '获取套餐失败：网络请求失败',
                whether_back: false,
                retry_receive_package: true
              })
            }
          })
      }
    }).catch(err => {
      console.log('获取赠送套餐id失败：', err)
      this.setData({
        whether_failure: true,
        failureTitleValue: '获取套餐失败：网络请求失败',
        whether_back: false,
        retry_receive_package: true
      })
    })
  }
})