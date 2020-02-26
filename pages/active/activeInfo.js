// pages/active/activeInfo.js
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
var app = getApp()
import request from "../../utils/request.js"
import {
  DateDifference
} from "../../utils/dateUtil.js"
const message = '当前功能需要用户登录';
Page({

  /**
   * 页面的初始数据
   */
  data: {
//活动没被禁用
activeDisableTag: false,
//活动没被禁用
activeEnableTag: false,
  },
  contactStore(e) {
    // e._relatedInfo.anchorTargetText;
    let contactNumber = this.data.active.contactsTelephone;
    if (contactNumber !== '--') {
      wx.makePhoneCall({
        phoneNumber: contactNumber,
        success: function(res) {
          console.log('调用电话成功');
        },
        fail: function(res) {
          wx.showToast({
            title: '调用电话失败',
          }, 1000)
          console.log(res);
        },
        complete: function(res) {
          console.log('调用电话完成');
          wx.hideToast();
        },
      })
    }
  },
  navigateToStoreMap(e) {
    let active = this.data.active || {}
    let {
      address
    } = active;
    if (active && address && address.length > 0) {
      wx.openLocation({
        latitude: Number(active.latitude),
        longitude: Number(active.longitude),
        scale: 18,
        name: address,
        address
      })
    }
  },
  Join() {
    // on close
    let jwt = app.globalData.jwt
    if(jwt!=null){
      if (!jwt.isValid()) {
        Dialog.confirm({
          title: '登录提醒',
          message,
          confirmButtonText: "去登陆"
        }).then(() => {
          app.globalData.logout(app.globalData.getCurrentURL(this));
        });
      } else {
        let uid = jwt.isValid() && jwt.payload.userId
        let {
          isJoin,
          active
        } = this.data
        let that = this
        let cancelled = parseInt(active.zyt_activityregistrationcancelled)
        let type = 1
        if (cancelled == 0) {
          console.log(cancelled)
          type = 2
        }
        let title = "报名参加",
          message = "您确定要报名参加活动吗？";
        if (cancelled == 0) {
          title = "取消报名",
            message = "您确定要取消报名活动吗？"
        }
        Dialog.confirm({
          title,
          message,
          confirmButtonText: "是",
          cancelButtonText: "否",
        }).then(() => {
          // 添加/修改报名状态/报名/取消
          return request.httpFind("/api/server_zyt_activity", {
            uid,
            zyt_activityId: that.data.id,
            type
          })
        })
          .then((res) => {
            console.log(res)
            if (res.data.code == "40303") {
              Dialog.alert({
                message: res.data.message
              })
            }
            return request.httpFind("/api/server_zyt_activitylist_app", {
              id: that.data.id,
              uid
            })
          })
          .then(res => {
            active = res.data.data
            console.log(active)
            var isJoin = false;
            let cancelled = parseInt(active.zyt_activityregistrationcancelled)
            if (active.zyt_activityregistrationid != null && cancelled != null) {
              if (cancelled == 0)
                isJoin = true
            }
            this.setData({
              active,
              isJoin,
            })
          })
      }
    }else{
      Dialog.confirm({
        title: '登录提醒',
        message,
        confirmButtonText: "去登陆"
      }).then(() => {
        app.globalData.logout(app.globalData.getCurrentURL(this));
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function({
    id = 3
  }) {
    var active = []
    var ProList = []
    let jwt = app.globalData.jwt
    if (jwt != null) {
      let uid = jwt.isValid() && jwt.payload.userId
      console.log("id uid",id,uid)
      if (jwt.isValid()) {
        request.httpFind("/api/server_zyt_activitylist_app", {
          id,
          uid
        }).then(res => {
          // console.log("活动内容/api/server_zyt_activitylist_app",res.data.data)
          active = res.data.data
          ProList = res.data.data.staffInfo
          this.setData({
            id
          })
          if(res.data.data.state=="0"){ //活动被禁用
            this.setData({
              activeDisableTag:true,
              activeEnableTag:false,
            })
          }else{
            this.setData({
              activeDisableTag:false,
              activeEnableTag:true,
            })
            this.showActivityInfo(active, ProList, res)
          }
        })
      } else {
        request.httpOpenFind("/static/server/server_zyt_activitylist_app", {
          id,
        }).then(res => {
          // console.log("活动内容/static/server/server_zyt_activitylist_app:",res.data.data)
          active = res.data.data
          ProList = res.data.data.staffInfo
          this.setData({
            id
          })
          if(res.data.data.state=="0"){ //活动被禁用
            this.setData({
              activeDisableTag:true,
              activeEnableTag:false,
            })
          }else{
            this.setData({
              activeDisableTag:false,
              activeEnableTag:true,
            })
            this.showActivityInfo(active, ProList, res)
          }
        })
      }
    } else {
      request.httpOpenFind("/static/server/server_zyt_activitylist_app", {
        id,
      }).then(res => {
        // console.log("活动内容/static/server/server_zyt_activitylist_app:",res.data.data)
        active = res.data.data
        ProList = res.data.data.staffInfo
        this.setData({
          id
        })
        if(res.data.data.state=="0"){ //活动被禁用
          this.setData({
            activeDisableTag:true,
            activeEnableTag:false,
          })
        }else{
          this.setData({
            activeDisableTag:false,
            activeEnableTag:true,
          })
          this.showActivityInfo(active, ProList, res)
        }
      })
    }
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
  onHide: function() {

  },

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
    let title = this.data.active.title;
    if (!title) {
      title = "小优家庭医生";
    }
    return {
      title: title,
      path: app.globalData.getCurrentURL(this)
    };
  },
  showActivityInfo(active, ProList, res) {
    console.log(active)
    ProList.map((x) => {
      // console.log(x)
      switch (x.physicianLevel) {
        case "1":
          x.physicianLevel = "执业医师"
          break;
        case "2":
          x.physicianLevel = "主治医师"
          break;
        case "3":
          x.physicianLevel = "副主治医师"
          break;
        case "4":
          x.physicianLevel = "主任医师"
          break;
        default:
          x.physicianLevel = "专家"
      }
    })
    var isJoin = false;
    let cancelled = parseInt(active.zyt_activityregistrationcancelled)
    if (active.zyt_activityregistrationid != null) {
      if (cancelled == 0)
        isJoin = true
    }
    var today = new Date().getTime()
    var startTime = new Date((active.startTime).replace(/-/g, '/')).getTime()
    var isExpire = today > startTime
    active.startTime = active.startTime.substr(0, 16)
    active.endTime = active.endTime.substr(0, 16)
    let storeDetails = active.details.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ').replace('<html>', '')
      .replace('</html>', '')
      .replace('<head>', '')
      .replace('</head>', '')
      .replace('<body>', '')
      .replace('</body>', '');
    active.details = storeDetails
    this.setData({
      ProList,
      active,
      isJoin,
      isIphoneX: app.globalData.isIphoneX,
      isExpire,
      domain: app.globalData.domain,
    })
  }
})