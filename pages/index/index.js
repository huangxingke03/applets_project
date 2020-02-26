import tab from '../../component/tab/tab.js';
import request from '../../utils/request.js';
import util from '../../utils/util.js'
import constDict from '../../utils/constDict.js'
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
import {
  storeInfo
} from '../../utils/constDict.js';
const app = getApp();
const titleValue = '欢迎使用小优家庭医生';
const messageValue = '您尚未登记健康档案,在使用之前请先完善资料。';
const buttonValue = '去填写'
const message = '当前功能需要用户登录';

function dateFormat(date) {
  var today;
  if (!(date instanceof Date)) {
    today = new Date(date);
  } else {
    today = date
  }

  var y = (today.getFullYear()).toString();
  var m = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1).toString() : (today.getMonth() + 1).toString();
  var d = today.getDate() < 10 ? '0' + (today.getDate()).toString() : (today.getDate()).toString()
  today = new Date(y + "/" + m + "/" + d)
  return today;
}

const conf = {
  data: {
    staffList: [],
    domain: app.globalData.domain,
    acolor: "black",
    active: 100,
    chose_index: 1,
    storeInfos: [],
    uid: -1,
    show: false,
    apponitments: [], //预约
    primary: {
      cardName: "暂无会员",
      url: "/images/noCard.png"
    },
    defaultBg: "/images/noCard.png",
    news: [],
    imgArray: [],
    avatarUrl: "../../images/avatar.png",
    userInfo: {
      nickName: "小优家庭医生用户"
    },
    jwtValue: null,
    //我的模块一栏是否显示 登录后显示 不登陆不显示
    myModuleShow: false,
  },

  onChange: function (e) {
    return false;
  },
  goTo: function (e) {
    var index = e.currentTarget.dataset.id;
    this.setData({
      chose_index: tab.tab_ch(e)
    })
    // 跳转预约模块
    if (index == '2') {
      wx.navigateTo({
        url: '/pages/selectDoctor/selectDoctor?doctorType=2',
      })
    }
    //跳转小优商城
    // if (index == '2') {
    //   if (this.data.jwtValue != null) {
    //     if (!this.data.jwtValue.isValid()) {
    //       this.dialogToLogin()
    //     } else {
    //       this.toProductList();
    //     }
    //   } else {
    //     this.dialogToLogin()
    //   }
    // }
    //活动页面
    // if (index == '4') {
    //   wx.navigateTo({
    //     url: '/pages/active/active',
    //   })
    // }
    //我的模块
    if (index == '4') {
      if (this.data.jwtValue != null) {
        if (!this.data.jwtValue.isValid()) {
          this.setData({
            myModuleShow: false
          })
          this.dialogToLogin()
        }
      } else {
        this.setData({
          myModuleShow: false
        })
        this.dialogToLogin()
      }
    }
  },
  /**
   * 弹窗提示登录
   */
  dialogToLogin() {
    Dialog.confirm({
      title: '登录提醒',
      message,
      confirmButtonText: "去登陆"
    });
  },
  bindViewTap: function () {
    var self = this;
    schedule.bindViewTap(self);
  },
  getweather: function () {
    var self = this;
    schedule.getweather(self)
  },
  choosearea: function () {
    var self = this;
    picker.choosearea(self)
  },
  bindChange: function (e) {
    var self = this;
    picker.bindChange(e, self)
  },
  onShareAppMessage: function () {
    return getApp().globalData.defaultShareObject;
  },
  navto(e) {
    let stfid = (e.currentTarget.dataset.stfid);
    wx.navigateTo({
      url: `/pages/appointmentDoctor/appointmentDoctor?stfid=${stfid}&schedulType=${"1-2"}`,
    })
  },
  onLoad: function () {
    wx.stopPullDownRefresh();
    // 检查用户是否已经登录，jwt属性在app.js中进行了初始化。
    var that = this;
    let jwt = app.globalData.jwt;
    this.setData({
      isIphoneX: app.globalData.isIphoneX,
      jwtValue: app.globalData.jwt,
    })
    this.getStoreInfoTableData()
    this.getZytArticle()
    this.getPageRotationChart()
    this.getStaffList()
    if (jwt != null && jwt.isValid()) {
      this.checkPhone(jwt)
      this.getDirectoryData()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.jwtValue != null) {
      if (this.data.jwtValue && this.data.jwtValue.isValid()) {
        this.getAppointmentsData(this.data.jwtValue.payload.userId)
        this.getShipChargePackage(this.data.jwtValue)
        this.getDirectoryData()
        app.globalData.myModuleShow = true
        this.setData({
          myModuleShow: true
        })
      } else {
        this.setData({
          myModuleShow: app.globalData.myModuleShow
        })
      }
    } else {
      this.setData({
        myModuleShow: app.globalData.myModuleShow
      })
    }
    if (app.globalData.backMinePage) {
      this.setData({
        chose_index: 5,
      })
      app.globalData.backMinePage = false
    } else {
      this.setData({
        chose_index: 1
      })
    }
    if (app.globalData.jwt) {
      this.setData({
        jwtValue: app.globalData.jwt,
        myModuleShow: true
      })
    } else {
      this.setData({
        jwtValue: null,
        myModuleShow: false
      })
    }
  },
  /**
   * 首页跳转文章列表页面
   */
  showMoreArticle() {
    wx.navigateTo({
      url: '/pages/indexArticleList/indexArticleList',
    })
  },
  /**
   * 首页轮播图页面点击跳转小程序页面或者网页
   */
  carouselMapItemClick: function (e) {
    var urlValue = null;
    var type = e.detail.itemType
    var path = e.detail.itemPath
    console.log('轮播图跳转:--type--path', type, path)
    if (type == '1' && path && path.length > 0) { //点击轮播图跳转小程序
      urlValue = path
      wx.navigateTo({
        url: urlValue,
      })
    } else if (type == '2' && path && path.length > 0) { //点击轮播图跳转网页
      urlValue = '../webview/webview?src=' + path
      wx.navigateTo({
        url: urlValue,
      })
    }
  },
  /**
   * 首页文章详情页面跳转
   */
  gotoweb: function (e) {
    console.log(e.currentTarget.dataset);
    var typeValue = e.currentTarget.dataset.type;
    var idValue = e.currentTarget.dataset.id;
    if (typeValue && typeValue.length != 0 && typeValue == 1) { //首页文章跳转链接
      wx.navigateTo({
        url: '../webview/webview?id=' + idValue
      })
    } else if (typeValue && typeValue.length != 0 && typeValue == 2 && idValue) { //首页文章跳转站内编辑文章
      wx.navigateTo({
        url: '../editArticleShow/editArticleShow?id=' + idValue
      })
    }
  },
  getAppointmentsData(uidValue) {
    if (!uidValue) {
      return;
    }
    let that = this;
    that.setData({
      uid: uidValue
    });
    let date = new Date().dateFormat('yyyy-MM-dd hh:mm:ss');
    let params = {
      limit: 50,
      skip: 0,
      uid: uidValue,
      state: '1,3',
      date: date,
      // '2019-01-18 09:00',
      oderby: 'asc'
      // apponitmentStatus: '2',
      // apponitmentStatus: ['2'],
      // schedulType: ['1'],
      // isProhibit: 1
    };
    request.httpFind('/api/server_myAppointmentList', params).then(res => {
      // console.log('====>>> 193 server_myAppointmentList ', res);
      let data = util.getObjectValue(res, ['data', 'data']);
      if (data) {
        if (data.length > 0) {
          let pidsNew = [];
          data.forEach(da => {
            pidsNew.push(da.pid)
            if (da.startDate) {
              try {
                da['startDateString'] = new Date((da.startDate).replace(/-/g, '/')).dateFormat('yyyy-MM-dd hh:mm') //'yyyy年MM月dd日 hh:mm'
              } catch (e) {
                console.log('预约开始时间转换失败：', e);
                da['startDateString'] = '----';
              }
            }
            // da['sStatus'] = (da.appointmentState === '1' || da.appointmentState === '3') && date < da.startDate ? 1 : (da.appointmentState === '2' ? 2 : 3);
            // 1.提交预约，待确定 2.已取消 3.已确认 4.未确认 5.已完成
            da['sStatus'] = da.appointmentState === '2' ? 2 : (da.appointmentState === '1' ? (date <= da.startDate ? 1 : 4) : (da.appointmentState === '3' ? (date <= da.startDate ? 3 : 5) : 5));
            da['sStatusObj'] = constDict.appointmentStatus[da['sStatus']];
          });
          that.setData({
            apponitments: data,
            pids: pidsNew
          })
        } else {
          that.setData({
            apponitments: data
          })
        }
        // console.log('====>> 210 ',that.data);
      }
    }).catch(err => {
      console.log('获取预约信息失败：', err)
    });
    let pidsNew = [];
    this.data.apponitments.forEach(da => {
      pidsNew.push(da.pid)
    });
    that.setData({
      pids: pidsNew
    })
  },
  getShipChargePackage(jwt) {
    request.httpFind("/api/membershipchargepackage", {
        uid: jwt.payload.userId,
        isProhibit: 1
      })
      .then(res => {
        var primary = res.data && res.data.data && res.data.data[0] && res.data.data[res.data.data.length - 1];
        if (primary) {
          primary.cardName = primary.packageName.slice(0, primary.packageName.length - 2)
          primary.endTime = primary.endTime.slice(0, 10)
          this.setData({
            primary
          })
        }
      })
  },
  getDirectoryData() {
    request.httpFind("/api/commodityCatalogue", {
        parentId: 0,
        isDisabled: 0
      })
      .then(res => {
        const primaryDirectoryData = this.initDirectoryData(res.data.data)
        app.globalData.primaryDirectoryData = primaryDirectoryData
      })
  },
  initDirectoryData(directoryResource) {
    const directoryArray = []
    for (var i = 0; i < directoryResource.length; i++) {
      var directoryItem = directoryResource[i]
      if (directoryItem.childSort && JSON.parse(directoryItem.childSort).length != 0) {
        directoryItem['index'] = i
        directoryItem['idValue'] = 'view' + i
        directoryArray.push(directoryItem)
      }
    }
    return directoryArray;
  },
  /**
   * 获取首页文章列表
   */
  getZytArticle() {
    if (this.data.news.length != 0) {
      this.setData({
        news: []
      })
    }
    //获取首页文章列表最多显示四条
    let articleParams = {
      '$limit': 4,
      '$skip': 0,
      '$sort[createdAt]': '-1',
      'isDelete': 0,
      'state': 'T'
    }
    request.httpOpenFind('/static/server/zyt_article', articleParams).then(res => {
      let data = res.data;
      // console.log('====>>>zyt_article ', res);
      if (res.code === 200 && data.data) {
        if (data.data.length > 0) {
          data.data.forEach(itemNews => {
            itemNews['addTime'] = new Date(itemNews.createdAt.replace(/-/g, '/')).dateFormat('yyyy-MM-dd')
          })
          this.setData({
            news: data.data
          })
        }
      }
    }).catch(err => {
      wx.showToast({
        title: '获取文章列表失败',
      }, 1000)
      console.log(err);
    })
  },
  /**
   * 获取首页轮播图数据
   */
  getPageRotationChart() {
    request.httpOpenFind('/static/server/server_zyt_homePageRotationChart').then(res => {
      let data = res.data;
      // console.log('====>>>zyt_homePageRotationChart ', res);
      if (res.code === 200 && data.data) {
        if (data.data.length > 0) {
          this.setData({
            imgArray: data.data
          })
        }
      }
    }).catch(err => {
      wx.showToast({
        title: '获取轮播图数据失败',
      }, 1000)
      console.log(err);
    })
  },
  /**
   * 获取首页横向诊断医生列表
   */
  getStaffList() {
    let that = this;
    let params = {
      key: 'xiaoyouyishengDoctor',
      homepage: "1",
      skip: 0
    }
    request.httpOpenFind('/static/server/server_getdoctor', params).then(res => {
      let data = res.data;
      // console.log('====>>>server_getdoctor', res);
      if (res.code === 200 && data.data) {
        if (data.data.length > 0) {
          this.setData({
            staffList: data.data,
          })
        }
      } else {}
    }).catch(err => {
      console.log(err);
    })
  },
  /**
   * 获取首页门店信息
   */
  getStoreInfoTableData() {
    let that = this;
    let params = {
      id: storeInfo.ids
    }
    console.log('=storeInfo:id>>', params);
    request.httpOpenFind('/static/server/storeInfo', params).then(res => {
      console.log('=storeInfo>>', res);
      if (res.code === 200 && res.data && res.data.total > 0) {
        that.setData({
          storeInfos: res.data.data
        })
      }
    }).catch(err => {
      console.log('=storeInfo>>', err);
      wx.showToast({
        title: '获取信息失败',
      }, 1000)
    })
  },
  /**
   * 检查用户信息是否有电话,并提示获取
   */
  checkPhone(jwt) {
    request.httpFind("/api/users", {
        id: jwt.payload.userId
      })
      .then(res => {
        if (res.data.data && res.data.data[0]) {
          var user = res.data.data[0]
          console.log('checkPhone', user)
          if (!user.telphone || user.telphone == null || user.telphone == "") {
            wx.navigateTo({
              url: '../auth/authPhone',
            });
          }
          if (!user.nickname || user.nickname == "") {
            request.httpUpdate("/api/users", jwt.payload.userId, user, {
              isDelete: 0
            })
          }
        }
      }).then(res => {
        // console.log(res)
      })
  },
  /**
   * 判断当前患者是否创建档案如果没有跳转添加档案页面
   */
  judgePatientFile(jwt) {
    request.httpFind("/api/server_membershipPersonalFamily", {
        uid: jwt.payload.userId,
        type: 1,
        untying: 0
      })
      .then(res => {
        // console.log('==res.data.data==>', JSON.stringify(res.data.data))
        // console.log('==res.data.data.length==>', res.data.data.length)
        if (res.msg == '查询成功' && res.data.data.length == '0') {
          wx.showModal({
            title: titleValue,
            content: messageValue,
            success: (res) => {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.navigateTo({
                  url: '/pages/createPatientFile/createPatientFile?sendCreatFileTag=0826',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
        }
      })
  },
  onClose(event) {
    if (event.detail === 'confirm') {
      wx.navigateTo({
        url: '/pages/createPatientFile/createPatientFile?sendCreatFileTag=0826',
      })
    }
  },

  navigateToMyDoctor(e) {
    app.globalData.backMinePage = true
    wx.navigateTo({
      url: '/pages/myDoctor/myDoctor',
    })
  },
  navigateToAppointmentDetail(e) {
    console.log(e);
    let uid = this.data.uid;
    let apponitment = e.currentTarget.dataset.apponitment;
    wx.navigateTo({
      url: `/pages/addAppointment/addAppointment?apponitment=${JSON.stringify(apponitment)}`
    })
  },
  navigateToMyAppointment(e) {
    app.globalData.backMinePage = true
    wx.navigateTo({
      url: `/pages/myAppointment/myAppointment`
    })
  },
  navigateToStoreInfo(e) {
    // console.log("======>> 点击了 ",e,"⭐")
    let id = e.currentTarget.id;
    if (id > 0) {
      wx.navigateTo({
        url: `/pages/storeInfo/storeInfo?id=${id}`,
      })
    }

  },
  onReady: function () {},
  /**
   * 我的健康,患者档案管理入口
   */
  selectMedical(e) {
    app.globalData.backMinePage = true
    wx.navigateTo({
      url: '../patientFileList/patientFileList',
    })
  },
  /**
   * 商城订单跳转入口
   */
  jumpOrderPage(e) {
    app.globalData.backMinePage = true
    wx.navigateTo({
      url: '/subpackage1/pages/order_list/order_list',
    });
  },
  /**
   * 中药物流模块跳转入口
   */
  jumpLogisticsModular(e) {
    wx.navigateTo({
      url: '../address/delivery',
    });
  },
  /**
   * 中医辅诊模块跳转入口
   */
  jumpAuxiliaryModular(e) {
    wx.navigateTo({
      url: '../report/reportList',
    });
  },
  /**
   * 退出登录当前用户
   */
  logoutClicked(e) {
    wx.showModal({
      title: '退出登录',
      content: '请问您是否要退出登录？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.myModuleShow = false
          // getApp().globalData.logout();
          getApp().globalData.againBackIndex();
        } else if (res.cancel) {
          this.setData({
            chose_index: 1
          })
        }
      }
    });
  },
  toProductList() {
    wx.navigateTo({
      url: '/pages/ProductListProxy/ProductListProxy',
    })
  },
  /**
   * 跳转小优商城模块
   */
  // toXiaoyouMall(e) {
  //   if (this.data.jwtValue != null) {
  //     if (!this.data.jwtValue.isValid()) {
  //       this.dialogToLogin()
  //     } else {
  //       this.toProductList();
  //     }
  //   } else {
  //     this.dialogToLogin()
  //   }
  // },
  /**
   * 跳转套餐模块
   */
  toSetMeal(e) {
    if (this.data.jwtValue != null) {
      if (!this.data.jwtValue.isValid()) {
        this.dialogToLogin()
      } else {
        // this.toProductList();
      }
    } else {
      this.dialogToLogin()
    }
  },
  /**
   * 跳转私人医生模块
   */
  // toPrivateDoctor(e) {
  //   if (this.data.jwtValue != null) {
  //     if (!this.data.jwtValue.isValid()) {
  //       this.dialogToLogin()
  //     } else {
  //       wx.navigateTo({
  //         url: '/pages/myDoctor/myDoctor',
  //       })
  //     }
  //   } else {
  //     this.dialogToLogin()
  //   }
  // },
  /**
   * 跳转我的医疗模块
   */
  toMedicalModual(e) {
    if (this.data.jwtValue != null) {
      if (!this.data.jwtValue.isValid()) {
        this.dialogToLogin()
      } else {
        // wx.navigateTo({
        //   url: '/pages/myDoctor/myDoctor',
        // })
      }
    } else {
      this.dialogToLogin()
    }
  },
  /**
   * 查看更多热门医生
   */
  moreDoctor(e) {
    wx.navigateTo({
      url: '/pages/selectDoctor/selectDoctor?doctorType=2',
    })
  },
  onClose(event) {
    if (event.detail === 'confirm') {
      app.globalData.logout(app.globalData.getCurrentURL(this));
    } else if (event.detail === 'cancel') {
      this.setData({
        chose_index: 1
      })
    }
  },
  onPullDownRefresh: function () {
    this.getStoreInfoTableData()
    this.getZytArticle()
    this.getPageRotationChart()
    this.getStaffList()
    this.onLoad();
  }
};

Page(conf);