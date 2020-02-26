// pages/storeInfo/storeInfo.js
import request from '../../utils/request.js'
import util from '../../utils/util.js'
import constDict from '../../utils/constDict.js'

const app = getApp();

var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    storeImgUrl: '',
    name: '',
    contactNumber: '--',
    coverPhoto: '',
    storeStatus: '--',
    startTime: '',
    endTime: '',
    briefIntroduction: '',
    storeAddress: '',
    recommendedRoute: '',
    storeDetails: '',
    score: '',
    environmentalScience: '',
    service: '',
    storeDetailsNodes: '',
    latitude: 0,
    longitude: 0,
    storeImgUrls:[],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    currentImgIndex: 0,
    isIphoneX: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // if (!app.globalData.jwt.isValid()) { // 如果未登录，保存当前页面信息，跳出进行登录
    //   app.globalData.logout(app.globalData.getCurrentURL(this));
    //   return;
    // }


    var that = this;
    this.setData({
      id: options.id
    });
    qqmapsdk = new QQMapWX({
      key: constDict.qqMapWxKey
    });
    wx.getSystemInfo({
      success: function success(_ref) {
        var model = _ref.model,
          sh = _ref.screenHeight,
          sw = _ref.screenWidth
        var isIphoneX = sh / 18 - sw / 9 > 0 ? true : false
        that.setData({
          isIphoneX
        })
      }
    });
    wx.showLoading({
      title: '加载中……',
      mask: true,
      success: function(res) {},
      fail: function(res) {
      },
      complete: function(res) {},
    });
    var that = this;
    let params = {
      'id': this.data.id,
      $select: ["name",'rotationChart','contactNumber', 'photoType', 'startTime', 'endTime', 'briefIntroduction', 'storeAddress', 'recommendedRoute','officeDays' ,'environmentalScience', 'service', 'latitude', 'longitude', 'coverPhoto', 'storeDetails']
    }//'coverPhoto','storeDetails'
    request.httpOpenFind('/static/server/storeInfo', params).then(res => {
      if (res.code === 200) {
        let data1 = res.data;
        if (data1.code !== 400 && data1.data && data1.data[0]) {
          let data = data1.data[0];
          // console.log('=======>> 71 ', data);
          // let imgUrl = util.getBase64ImgUrl(data.photoType, data.coverPhoto);
          //`data:${data.photoType};base64${data.coverPhoto}`;
          let imgUrl = data.coverPhoto;
          let storeDetails = data.storeDetails
          .replace(/\<img/gi, '<img style="max-width:100%;height:auto" ').replace('<html>', '')
            .replace('</html>', '')
            .replace('<head>', '')
            .replace('</head>', '')
            .replace('<body>', '')
            .replace('</body>', '');
          this.setData({
            storeImgUrl: imgUrl,
            name: data.name,
            contactNumber: data.contactNumber || '--',
            coverPhoto: data.coverPhoto,
            storeStatus: this.getStoreStatus(data.startTime, data.endTime, data.officeDays),
            startTime: data.startTime,
            endTime: data.endTime,
            briefIntroduction: data.briefIntroduction || '',
            storeAddress: data.storeAddress,
            recommendedRoute: data.recommendedRoute || '',
            storeDetails: storeDetails,
            storeDetailsNodes: storeDetails,
            score: data.name ? 5 : 0,
            environmentalScience: data.name && data.environmentalScience ? data.environmentalScience : data.name ? '9.1' : '--',
            service: data.name && data.service ? data.service : data.name ? '9.1' : '--',
            latitude: Number(data.latitude) || 0,
            longitude: Number(data.longitude) || 0,
            storeImgUrls: data.rotationChart ? data.rotationChart.split(',') : [imgUrl]
          })
          if (this.data.name && !this.isValidLocationInfo(this.data.latitude, this.data.longitude)) {
            this.searchStoreLocationInfo();
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '获取信息失败',
          }, 1000)
        }
        wx.hideLoading();
      }
    }).catch(err => {
      wx.showToast({
        title: '获取信息失败',
      }, 1000)
      console.log(err);
    })
  },
  searchStoreLocationInfo() {
    let that = this;
    // wx.showLoading({
    //   title: '加载中……',
    // });
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 10000);
    // 调用接口
    qqmapsdk.search({
      keyword: this.data.storeAddress,
      success: function(res) {
        console.log('success', res);
        if (res.message === "query ok" && res.count > 0) {
          let data = res.data;
          for (let i in data) {
            let da = data[i];
            if (da.title && da.title.match(that.data.name)) {
              that.setData({
                latitude: da.location.lat,
                longitude: da.location.lng
              });
              break;
            }
          }
        }
      },
      fail: function(res) {
        console.log('搜索位置失败', res);
      },
      complete: function(res) {
        // console.log('complete', res);
      }
    });
  },
  isValidLocationInfo(latitude, longitude) {
    if ((typeof latitude) === Number && latitude > 0 &&
      (typeof longitude) === Number && longitude > 0) {
      return true;
    } else if (latitude && longitude && Number(latitude) > 0 && Number(longitude) > 0) {
      return true;
    }
    return false;
  },
  gotoStoreServer (e) {
    wx.navigateTo({
      url: `/pages/storeServer/storeServer?storeId=${this.data.id}`,
    })
  },
  getStoreStatus(startTime, endTime, officeDays) {
    let offDays = officeDays && JSON.parse(officeDays).length > 0 ? JSON.parse(officeDays):[];
    let now = new Date();
    let d = now.getDay();
    //  工作日无数据/周日未上班/非周日未上班 均直接返回 休息中
    if (offDays.length === 0 || (d === 0 && offDays.indexOf(7) < 0) || (d !== 0 && offDays.indexOf(d) < 0)){
      return '休息中';
    }  
    let h = now.getHours() < 10 ? `0${now.getHours()}` : `${now.getHours()}`;
    let m = now.getMinutes() < 10 ? `0${now.getMinutes()}` : `${now.getMinutes()}`;
    let s = now.getSeconds() < 10 ? `0${now.getSeconds()}` : `${now.getSeconds()}`;
    let ss = now.getMilliseconds() < 10 ? `0${now.getMilliseconds()}` : `${now.getMilliseconds()}`;
    let nowString = `${h}:${m}:${s}:${ss}`;
    return nowString >= startTime && nowString < endTime ? '营业中' : "休息中";
  },
  previewImg (e){
    wx.previewImage({
      urls: this.data.storeImgUrls,
      current: this.data.storeImgUrls[this.data.currentImgIndex]
    })
  },
  swiperchange: function (e) {
    this.setData({
      currentImgIndex: e.detail.current
    });
  },
  contactStore(e) {
    // e._relatedInfo.anchorTargetText;
    let contactNumber = this.data.contactNumber;
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
    let address = this.data.storeAddress;
    if (address && address.length > 0) {
      wx.openLocation({
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        scale: 18,
        name: this.data.name,
        address: this.data.storeAddress
      })
    }
  },
  makeAnOppointmentDoctor() {
    console.log('点击预约');
    wx.navigateTo({
      url: '/pages/selectDoctor/selectDoctor?doctorType=2',
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
    // return getApp().globalData.defaultShareObject;

    let storeName = this.data.storeDetails.name;
    if (!storeName) {
      title = "小优家庭医生";
    }
    return {
      title: storeName,
      path: app.globalData.getCurrentURL(this)
    };


  }
});
