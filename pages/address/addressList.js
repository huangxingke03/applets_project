// pages/address/addressList.js
import request from "../../utils/request.js"
const app = getApp()
import areaList from "../../utils/getAllRegion.js"
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';


Page({
  data: {
    actions: [{
        name: '直接添加',
      },
      {
        name: '从微信通讯录中添加',
      }
    ]
  },
  onClick: function(e) {
    e.detail = parseInt(e.currentTarget.dataset.id)
    console.log(e)
    this.onChange(e)
  },
  onChange: function(e) {
    console.log(e)
    Toast.clear();
    let jwt = app.globalData.jwt
    let uid = jwt.isValid() && jwt.payload.userId
    let {
      radio
    } = this.data
    let id = e.detail
    request.httpUpdate("/api/zyt_deliveryaddress", radio, {
        isDefault: 0
      }, {
        uid
      })
      .then(() => {
        if (id != 0) {
          request.httpUpdate("/api/zyt_deliveryaddress", id, {
              isDefault: 1
            }, {
              uid
            })
            .then(() => {
              this.setData({
                radio: parseInt(id)
              })
            })
        } else {
          // 自提
          // Toast.success('设置成功');
          this.setData({
            radio: parseInt(id)
          })
        }
      })
  },

  actionshow: function(e) {
    this.setData({
      show: true
    })
  },
  close: function(e) {
    this.setData({
      show: false
    })
  },
  onSelect: function(e) {
    let {
      name
    } = e.detail
    if (name == "直接添加") {
      wx.navigateTo({
        url: 'address?status=1',
      })
    } else {
      this.add()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let jwt = app.globalData.jwt
    let uid = jwt.isValid() && jwt.payload.userId
    let radio = "0"
    let data
    request.httpFind("/api/zyt_deliveryaddress", {
        uid,
        isDelete: 0
      })
      .then((res) => {
        if (res.data && res.data.data) {
          let data = res.data.data;
          radio = data.filter(x => x.isDefault == 1)
          if (radio.length > 0) {
            console.log(radio)
            radio = radio[0].id
          } else {
            radio = "0"
          }
        }
        data = res.data.data
        this.setData({
          data: res.data.data,
          radio
        })


      }).catch(function(e) {
        throw e
      })
    request.httpFind("/api/zyt_logisticsRequest", {
      uid,
      state: {
        $in: [1, 3]
      }
    }).then(res => {
      console.log(res.data.total)
      let {
        total
      } = res.data
      if (total > 0) {
        Notify({
          text: ' 您有' + total + '个配送请求已提交',
          duration: "",
          selector: '#custom-selector',
          backgroundColor: '#ff976a'
        });
      }
      this.setData({
        total
      })

    })
    //隐藏转发按钮
    wx.hideShareMenu()
  },

  add: function(e) {
    let jwt = app.globalData.jwt
    let uid = jwt.isValid() && jwt.payload.userId
    var that = this
    wx.chooseAddress({
      success(res) {
        res.errMsg = undefined
        console.log(res)
        request.httpCreate("/api/zyt_deliveryaddress", {
          uid,
          ...res
        }).then((res) => {
          that.onLoad()
        })
      },
      fail: function(res) {
        console.log(res)
        if (res.errMsg == "chooseAddress:fail auth deny")
          Toast('无法获取通讯录信息 请重新打开小程序授权');
      }

    })
  },
  delete: function(e) {
    let {
      id
    } = e.target.dataset
    let jwt = app.globalData.jwt
    let uid = jwt.isValid() && jwt.payload.userId
    Dialog.confirm({
      message: '确定删除吗？',
      closeOnClickOverlay: true
    }).then(() => {
      request.httpUpdate("/api/zyt_deliveryaddress", id, {
        isDelete: 1
      }, {
        uid
      }).then(() => {
        this.onLoad()
      })
    });



  },
  edit: function(e) {
    wx.navigateTo({
      url: 'address?status=2&id=' + e.target.dataset.id,
    })
  },
  addOne: function(e) {
    console.log('==addOne==>> ', e, e.detail.formId);
    //查询有没有本人档案
    var that = this;
    request.httpFind("/api/MembershipPersonalFamily", {
        uid: app.globalData.jwt.payload.userId,
        type: 1,
        untying: 0
      })
      .then(res => {
        console.log('MembershipPersonalFamily==>', JSON.stringify(res.data.data), res.data.data.length)
        if (res.data.data.length == 0) { //没有本人患者档案
          Dialog.confirm({
            title: '完善信息',
            message: '请先填写会员档案',
            closeOnClickOverlay: true,
            confirmButtonText: '去填写'
          }).then(() => {
            return wx.navigateTo({
              url: '/pages/createPatientFile/createPatientFile?sendCreatFileTag=0826',
            })
          })
        } else { //有本人患者档案
          var type = e.currentTarget.dataset.type
          let id = e.currentTarget.dataset.id
          console.log('--type--id--', type, id)
          let jwt = app.globalData.jwt
          let uid = jwt.isValid() && jwt.payload.userId
          let {
            radio
          } = this.data
          Dialog.confirm({
              title: '确认配送方式',
              message: '是否使用该配送方式？',
              closeOnClickOverlay: true
            }).then(() => {
              return request.httpCreate("/api/zyt_logisticsRequest", {
                LogisticsCategory: type,
                uid,
                zyt_deliveryAddressid: id,
                state: 1,
                form_id: e.detail.formId
              })
            })
            .then((res) => {
              let {
                total
              } = this.data
              Notify({
                text: ' 您有' + (total + 1) + '个配送请求已提交',
                duration: "",
                selector: '#custom-selector',
                backgroundColor: '#ff976a'
              });
              this.setData({
                total: total + 1
              })
            })
        }
      })
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
    this.onLoad()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      show: false
    })
    this.setData({
      show: false
    })
    this.setData({
      show: false
    })
    this.setData({
      show: false
    })
    this.setData({
      show: false
    })
    this.setData({
      show: false
    })
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
  }
})