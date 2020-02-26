// pages/auth/auth.js
const app = getApp()
import request from '../../utils/request.js';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';


Page({

  /**
   * 页面的初始数据
   */
  data: {},
  doLogin: function(e) {
    // console.log(e)
    let referralUid;
    if (this.data && this.data.referralUid) {
      referralUid = this.data.referralUid;
      // console.log('referralUid: ' + referralUid)
    }
    // debugger
    Toast.loading({
      mask: true,
      message: '正在登录',
      duration: 0,
    });
    wx.login({
      success(res) {
        let code = res.code;
        var url = app.globalData.domain + "/api/server_creatAuthentications?code=" + code + "&apptype=wechat"
        if (referralUid) {
          url += "&referralUid=" + referralUid
        }
        // console.log("login: " + url)
        // debugger
        request.pass({
            url
          }).then(res => {
            if (app.globalData.login(res.data.data)) { // 验证并存储token
              // console.log(true)
              return request.httpFind("/api/users", {
                id: res.data.uid
              })
            }
          }).then(res => {
            Toast.clear();
            if (res.data.data && res.data.data[0]) {
              var user = res.data.data[0]
              // console.log('服务端用户信息', user)
              //获取微信端用户信息
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: res => {
                        // console.log('微信用户信息', res.userInfo)
                        //更新本地用户信息昵称 头像
                        // console.log('getUserInfo', user)
                        request.httpUpdate("/api/users", user.id, {
                          "nickname": res.userInfo.nickName,
                        }, {
                          "username": user.username,
                        }).then(data => {
                          // console.log('用户昵称修改成功=>', data);
                        }).catch(err => {
                          console.error('用户昵称修改失败=>', err);
                        })
                      }
                    })
                  }
                }
              })
            }
            if (app.globalData.pendingURL) {
              wx.redirectTo({
                url: '/' + app.globalData.pendingURL,
              });
              delete app.globalData.pendingURL;
            } else {
              if (app.globalData.giftTag) {
                wx.redirectTo({
                  url: '/pages/getGiftPackage/getGiftPackage',
                });
              } else {
                wx.redirectTo({
                  url: '/pages/index/index',
                });
              }
            }
          })
          .catch(err => {
            Toast.clear();
            console.error(err);
            // todo 完善登录失败
            app.globalData.logout();
          })
      }
    });
  },
  // OTDO 添加相应的跳转
  navToProtocol() {
    // console.log('点击协议');
  },
  navToFeedBack() {
    // console.log('点击反馈');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function({
    referralUid　
  }) {
    if (referralUid) {
      this.setData({
        referralUid
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
    return getApp().globalData.defaultShareObject;
  },
  /**
   * 登录成功后更新本地用户昵称信息
   */
  updateNickName(idValue) {
    request.httpFind("/api/users", {
      id: idValue
    }).then(res => {
      // console.log('updateNickName', res)
      if (res.data.data && res.data.data[0]) {
        var user = res.data.data[0]
        if (!user.nickname || user.nickname == "") {
          // request.httpUpdate("/api/users", jwt.payload.userId, user, {
          //   isDelete: 0
          // })
        }
      }
    })
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log('微信用户信息',res.userInfo)

    //         }
    //       })
    //     }
    //   }
    // })
  },
})
