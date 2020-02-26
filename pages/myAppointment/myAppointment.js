// pages/myAppointment.js
//我的预约记录页面
import util from '../../utils/util.js'
import request from '../../utils/request.js'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js'
import constDict from '../../utils/constDict.js'
const app = getApp()

let pagesize = 10,
  pageIndex1 = 1, index1 = 0, total1 = 0, dataAllLoaded1 = false,
  pageIndex2 = 1, index2 = 0, total2 = 0, dataAllLoaded2 = false;
Page({
  data: {
    scrollTop: 0,
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    active: 0,
    uid: -1,
    tabs: ['未完成','已完成'],
    apponitmentsNotComplete: [],
    appointmentsCompleted: [],
    noDataShow1: false,
    noDataShow2: false
  },
  onLoad: function (options) {
    var that = this;
    let jwt = app.globalData.jwt;
    if (jwt && jwt.isValid()) {
      this.setData({
        uid: jwt.payload.userId
      })
    }
    // console.log('我的预约 获取的uid', that.data.uid);
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    //隐藏转发按钮
    wx.hideShareMenu()
  },
  /**
   * 点击标题切换页面
   */
  changeTab(event) {
    // console.log('====> 点击切换 ', event);
    this.setData({
      currentTab: event.detail.index
    })
  },
  /**
   * 滑动切换页面
   */
  swiperchange: function (e) {
    // console.log('====> 滑动切换 ', e);
    // console.log(e.detail.current)
    this.setData({
      currentTab: e.detail.current
    });
    this.refresh();
  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    });
    
  },
  onShow: function () {
    this.refresh();
  },
  refresh() {
    if (this.data.uid > 0) {
      if (this.data.currentTab === 0){
        this.setData({
          apponitmentsNotComplete: [],
          noDataShow1: false
        })
        pageIndex1 = 1, index1 = 0, total1 = 0, dataAllLoaded1 = false;
      } else {
        this.setData({
          appointmentsCompleted: [],
          noDataShow2: false
        })
        pageIndex2 = 1, index2 = 0, total2 = 0, dataAllLoaded2 = false;
      }
      this.getAppointmentsData();
    } else {
      Toast.fail({
        message: "获取用户信息有误",
        duration: 1000
      });
    }
  },
  getAppointmentsData() {
    let that = this;
    Toast.loading({
      message: "加载中……"
    });
    let date = new Date().dateFormat('yyyy-MM-dd hh:mm:ss');
    // console.log('====>>> 169 ',that.data);
    let params = {
      uid: that.data.uid,
      limit: pagesize,
      skip: that.data.currentTab === 0 ? index1 : index2,
      state: that.data.currentTab === 0 ? '1,3':'1,2,3',
      orderby: 'desc',
      date: date
      // apponitmentStatus: '2',
      // apponitmentStatus: ['2'],
      // schedulType: ['1'],
      // isProhibit: 1
    }
    // 
    console.log('====>>> 110 server_myAppointmentList params ', params);
    request.httpFind('/api/server_myAppointmentList', params).then(res => {
      Toast.clear();
      console.log('====>>> 113 server_myAppointmentList ', that.data.currentTab, res);
      let data = util.getObjectValue(res, ['data', 'data']);
      if (res.code === 200){
        if (data && data.length > 0) {
          data.forEach(da => {
            if (da.startDate) {
              try {
                da['startDateString'] = new Date((da.startDate).replace(/-/g, '/')).dateFormat('yyyy-MM-dd hh:mm')//'yyyy年MM月dd日 hh:mm'
              } catch (e) {
                console.log('预约开始时间转换失败：', e);
                da['startDateString'] = '----';
              }
            }
            // console.log('====>>> 284 da.appointmentState ', da.appointmentState, date, da.startDate, date < da.startDate);
            // 1.提交预约，待确定 2.已取消 3.已确认 4.未确认 5.已完成
            da['sStatus'] = da.appointmentState === '2' ? 2 : (da.appointmentState === '1' ? (date <= da.startDate ? 1 : 4) : (da.appointmentState === '3' ? (date <= da.startDate ? 3 : 5): 5));
            da['sStatusObj'] = constDict.appointmentStatus[da['sStatus']];
            // (da.appointmentState === '1' || da.appointmentState === '3') && date < da.startDate ? 1 : (da.appointmentState === '2' ? 2 : 3);
          })
          if (that.data.currentTab === 0){
            that.setData({
              apponitmentsNotComplete: this.data.apponitmentsNotComplete.concat(data)
            })
            if (res.data && res.data.total > 0){
              total1 = res.data.total;
            }
            index1 = index1 + data.length;
            pageIndex1++;
          } else {
            that.setData({
              appointmentsCompleted: this.data.appointmentsCompleted.concat(data)
            })
            if (res.data && res.data.total > 0) {
              total2 = res.data.total;
            }
            index2 = index2 + data.length;
            pageIndex2++;
          }
          console.log('====>>> 114 apponitments ', index1, index2, that.data);
          if (that.data.currentTab === 1 && index2 > 0 && index2 === total2){
            that.setData({
              dataAllLoaded2: true
            })
          }
          data = null;
        } 
        // else if (that.data.currentTab === 0 && this.data.apponitmentsNotComplete.length > 0){
        //   that.setData({
        //     dataAllLoaded1: true
        //   })
        // } 
        else if (that.data.currentTab === 0 ) {
          if (that.data.apponitmentsNotComplete.length > 0) {
            that.setData({
              dataAllLoaded1: true
            })
          } else {
            that.setNoDataTrue();
          }
        } 
        // else if (that.data.currentTab === 1 && this.data.appointmentsCompleted.length > 0) {
        //   that.setData({
        //     dataAllLoaded2: true
        //   })
        // }
        else if (that.data.currentTab === 1 ){
          if (that.data.appointmentsCompleted.length > 0) {
            that.setData({
              dataAllLoaded2: true
            })
          } else {
            that.setNoDataTrue();
          }
        }
        
      } else {
        console.log('获取预约信息失败：', err)
        Toast.fail({
          message: "获取预约信息失败",
          duration: 1000
        });
        that.setNoDataTrue();
      } 
    }).catch(err => {
      console.log('获取预约信息失败：', err)
      Toast.fail({
        message: "获取预约信息失败",
        duration: 1000
      });
      that.setNoDataTrue();
    })
  },
  setNoDataTrue(){
    console.log('===>> 236 ', this.data.currentTab);
    if (this.data.currentTab === 0){
      this.setData({
        noDataShow1: true
      })
    } else {
      this.setData({
        noDataShow2: true
      })
    }
  },
  navigateToAppointDetail(e) {
    console.log(e);
    let apponitment = e.currentTarget.dataset.apponitment;
    wx.navigateTo({
      url: `/pages/addAppointment/addAppointment?apponitment=${JSON.stringify(apponitment)}`
    })
  },
  navToSelectDoctor(e){
    wx.navigateTo({
      url: `/pages/selectDoctor/selectDoctor`
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    console.log('====> 下拉 ', e);
    // this.refresh();
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function (e) {
    console.log('====> 滑动到底部 ', this.data.currentTab);
    this.getAppointmentsData();
  },
  scrollbot(e){
    console.log('====> scrollbot ', e);
  }
})