// pages/oppointmentDoctor/oppointmentDoctor.js
import util from '../../utils/util.js'
import constDict from '../../utils/constDict.js'
import request from '../../utils/request.js'
import JWTPayload from '../../utils/jwt-payload.js'
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js'
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp();

// Toast.fail("暂无排班记录");
let appointMentWeekCount = constDict.appointMentWeekCount || 30;
let mySchedulTypes = constDict.schedulTypes || ["2"];
let pagesize = 10000,
  pageIndex = 1,
  index = 0,
  total = 0;
let touchDotStart = 0; //X按下时坐标
let touchDotEnd = 0; //y按下时坐标
let interval; //计时器
let time = 0; //从按下到松开共多少时间*100
let windowHeight = 0,
  windowWidth = 0;
import keys from '../../utils/enum.js';
const message = '当前功能需要用户登录';
Page({
  /**
   * 页面的初始数据
   */
  // "../../images/appointmentDoctorBg.jpg",
  data: {
    doctor: null,
    imgUrl: '',
    stfid: -1,
    schedulType: -1,
    // util.addFileUrl("wxapp-1547100601938-appointmentDoctorBg.jpeg"),
    scrollWidth: 5 * 137,
    weekCanlander: [],
    noDataShow: false,
    selectedIndex: 0,
    selectedColor: '#EF8C1F',
    selectedDate: null,
    doctorSchedulData: [],
    schedulDataAll: {},
    appointmentStatus: 1,
    uid: -1,
    membershipChargePackage: [],
    patients: [],
    pids: [],
    labArray: [],
    isShareTag: null,
    //预约信息
    reservationInfo: [],
    //当前有排班的日期
    dateValue: null,
    reservationTag: true,
    startDataValue: null,
    endDateValue: null,
    doctorId: '',
    isFirsttag: true,
    jwtValue: null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.stfid && options.schedulType) {
      // console.log('=====>>>>66 ',options,options.stfid, options.schedulType)
      this.setData({
        stfid: options.stfid,
        schedulType: options.schedulType
      })
      this.getDoctorDetail(options.stfid);
    }
    let jwt = app.globalData.jwt;
    this.setData({
      jwtValue: app.globalData.jwt
    })
    if (jwt && jwt.isValid()) {
      this.setData({
        uid: jwt.payload.userId
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        windowHeight = res.windowHeight;
        windowWidth = res.windowWidth;
      },
    })
    //进入当前页面判断入口是否是通过分享进入的
    if (options.isShare) {
      this.setData({
        isShareTag: options.isShare
      })
    }
    //隐藏转发按钮
    // wx.hideShareMenu()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // if (!app.globalData.jwt.isValid()) { // 如果未登录，不执行数据加载
    //   return;
    // }
    let that = this;
    if (app.globalData.jwt!=null){
      if (app.globalData.jwt.isValid()) {
        this.getPersonalFamily();
      }
    }
    // this.getMembershipChargePackage();
    // this.refresh();
    setTimeout(() => {
      this.setData({
        // weekCanlander: [],
        // schedulDataAll: {},
        noDataShow: false
      })
      that.getDoctorSchedulData()
    }, 500)
  },
  setCanlanderData() {
    this.setData({
      scrollWidth: Math.abs(appointMentWeekCount) * 137,
      weekCanlander: util.getDateData(appointMentWeekCount),
      selectedDate: util.getDateData(appointMentWeekCount) && util.getDateData(appointMentWeekCount)[0] ? util.getDateData(appointMentWeekCount)[0] : util.getDateData(1)
    })
    // console.log(this.data.weekCanlander, this.data.selectedDate);
    console.log('weekCanlander', this.data.weekCanlander)
  },
  /**
   * 选择对应的时间查看医生排版预约
   */
  onSelectedDate(e) {
    let sdate = this.data.weekCanlander[e.currentTarget.dataset.sindex];
    this.setData({
      selectedIndex: e.currentTarget.dataset.sindex,
      selectedDate: sdate.date,
      doctorSchedulData: this.data.schedulDataAll[sdate.date]
    })
    console.log("doctorSchedulData", this.data.doctorSchedulData)
    console.log("sdate.date", sdate.date)
    let currentDate = new Date().dateFormat(sdate.date);
    this.data.doctor['currentDate'] = currentDate;
    console.log("onSelectedDate:doctor", this.data.doctor)
    this.setData({
      doctor: this.data.doctor
    })
    // this.refresh();
  },
  /**
   * 开始医生预约
   */
  gotoAppointmentDetail(e) {
    if (this.data.jwtValue!=null){
      if (!this.data.jwtValue.isValid()) {
        Dialog.confirm({
          title: '登录提醒',
          message,
          confirmButtonText: "去登陆"
        }).then(() => {
          app.globalData.logout(app.globalData.getCurrentURL(this));
        })
      } else {
        this.startReservation(e)
      }
    }else{
      Dialog.confirm({
        title: '登录提醒',
        message,
        confirmButtonText: "去登陆"
      }).then(() => {
        app.globalData.logout(app.globalData.getCurrentURL(this));
      })
    }
  },

  /**
   *开始预约
   */
  startReservation(e) {
    let schedul = e.currentTarget.dataset.schedul;
    console.log("startReservation", e.currentTarget.dataset.schedul)
    if (this.data.doctor) {
      let doctor = this.data.doctor;
      doctor['schedul'] = schedul;
      let doctorString = JSON.stringify(doctor);
      wx.navigateTo({
        url: `/pages/addAppointment/addAppointment?doctor=${doctorString}&stfid=${this.data.stfid}`,
      })
    } else {
      Toast.fail({
        message: "获取医生信息失败",
        duration: 1000
      });
    }
  },
  getDoctorSchedulData() {
    let that = this;
    let date = new Date();
    date = date.setDate(date.getDate() + appointMentWeekCount)
    date = new Date(date).dateFormat('yyyy-MM-dd 00:00:00');
    // console.log('====>>>this.data.doctor.schedulType ', this.data.doctor.schedulType);
    let params = {
      limit: pagesize,
      skip: index,
      sid: this.data.stfid,
      pids: this.data.pids,
      startdate: new Date().dateFormat('yyyy-MM-dd hh:mm:ss'),
      enddate: date,
      // '2019-01-17 00:00:00'
      // todo 修改服务后 更新条件

      // date
      // this.data.selectedDate.date

      // new Date('2019-01-17 00:00:00')
      // '2019-01-17 00:00:00' '2018-12-27 00:00:00'
    }
    if (this.data.schedulType === '1') {
      params['schedulType'] = '1'
    }
    // console.log('=====>>> 157 params ', params);
    // let pidsDict = {};
    // this.data.pids.forEach(pid => {
    //   pidsDict[pid] = 1
    // })
    // console.log('====>> 155 this.data.doctor this.data.doctor.id',this.data.doctor,this.data.doctor.id);
    // debugger
    if (this.data.stfid > 0) {
      request.httpOpenFind('/static/server/server_storeSchedulinglist', params).then(res => {
        console.log('===>> 161 server_storeSchedulinglist ', res);
        if (res.code === 200 && res.data) {
          let data1 = res.data;
          if (data1 && data1.data && data1.data.length > 0) {
            // total = data1.total;
            let data2 = data1.data;
            // index = index + data2.length;
            // pageIndex++;
            let changTimeData = [];
            let dates = {};
            let weekCanlander = [];
            for (let da of data2) {
              if (this.data.schedulType === '1-2' && mySchedulTypes.indexOf(da.type) < 0) {
                continue;
              }
              da['startDateText'] = new Date((da.startDate).replace(/-/g, '/')).dateFormat('hh:mm');
              da['endDateText'] = new Date((da.endDate).replace(/-/g, '/')).dateFormat('hh:mm');
              da.doctorStatusText = da.type === '1' ? '上门出诊' : '医院门诊';
              da.doctorStatusColor = da.type === '1' ? '#9c6311' : '#6B96CB';
              let btnText = '预约';
              let disable = false;
              let pids = da.pid;
              console.log("this.data.schedulType", this.data.schedulType)
              if (this.data.schedulType === '1') {
                if (da.receivingcount > 0 && pids && pids.length > 0) {
                  if (that.include(pids, that.data.pids)) {
                    btnText = '已预约'
                  } else {
                    btnText = '被预约'
                  }
                  disable = true;
                }
              } else if (this.data.schedulType === '1-2') { //1-2 代表所有排班（1，2的并集）
                if (da.receivingVolume > 0 && da.receivingVolume > da.receivingcount) {
                  disable = false;
                } else {
                  if (da.type === '1') {
                    if (da.receivingcount === 0) {
                      disable = false;
                    } else {
                      disable = true;
                    }
                  } else {
                    if (da.receivingVolume > 0 && da.receivingcount >= da.receivingVolume) {
                      disable = true;
                    } else {
                      disable = false;
                    }
                  }
                }
                if (pids && pids.length > 0) {
                  if (that.include(that.data.pids, pids)) {
                    btnText = '已预约'
                  } else {
                    if (da.receivingVolume > 0 && da.receivingVolume === da.receivingcount) {
                      btnText = '已满'
                    }
                  }
                }
              }
              da['btnText'] = btnText;
              da['btnDisable'] = disable;
              changTimeData.push(da);
              let d = new Date((da.startDate).replace(/-/g, '/')).dateFormat('yyyy-MM-dd 00:00:00');
              if (dates[d]) {
                dates[d].push(da)
              } else {
                dates[d] = [da];
                weekCanlander.push(...(util.getDateData(1, new Date(d.replace(/-/g, '/')))));
              }
            }
            let selectedIndex = this.data.selectedIndex;
            this.setData({
              // todo 数据对比
              schedulDataAll: dates,
              weekCanlander: weekCanlander,
              scrollWidth: weekCanlander.length * 137,
              selectedDate: weekCanlander && selectedIndex > 0 && weekCanlander[selectedIndex] ? weekCanlander[selectedIndex] : (weekCanlander && weekCanlander[0] ? weekCanlander[0] : null),
              doctorSchedulData: weekCanlander && selectedIndex > 0 && weekCanlander[selectedIndex] ? dates[weekCanlander[selectedIndex].date] : (weekCanlander && weekCanlander[0] ? dates[weekCanlander[0].date] : [])
            })
            // console.log('getDoctorSchedulData', this.data.weekCanlander)
            // console.log('getDoctorSchedulData', this.data.weekCanlander[0].date)
            //第一次进入本页面,默认排班日期为排班日期列表的第一天
            if (that.data.isFirsttag) {
              this.data.doctor['currentDate'] = this.data.weekCanlander[0].date;
              this.setData({
                isFirsttag: false
              })
            }
            if (weekCanlander.length === 0) {
              this.setData({
                noDataShow: true
              })
            }
            changTimeData = null;
            data2 = null;
          } else {
            this.setData({
              noDataShow: true
            })
          }
        } else {
          Toast.fail({
            message: "获取排班记录失败",
            duration: 1000
          });
          this.setData({
            noDataShow: true
          })
        }
      }).catch(err => {
        wx.hideLoading()
        Toast.fail({
          message: "获取排班记录失败",
          duration: 1000
        });
        this.setData({
          noDataShow: true
        })
        console.log(err);
      })
    } else {
      Toast.fail({
        message: "获取医生信息失败",
        duration: 1000
      });
      this.setData({
        noDataShow: true
      })
    }
  },
  include(selfPids, pids) {
    if (!selfPids || selfPids.length === 0 || !pids || pids.length === 0) {
      return false;
    }
    for (let spid of selfPids) {
      if (pids.indexOf(spid) > -1) {
        return true;
      }
    }
    return false;
  },
  //membershipChargePackage
  getMembershipChargePackage() {
    let that = this;
    wx.showLoading({
      title: '加载中……',
    })
    let params = {
      uid: that.data.uid,
      isProhibit: '1',
      $sort: {
        startTime: '1'
      }
    }
    request.httpFind('/api/membershipChargePackage', params)
      .then(res => {
        // console.log('===> 246 ',res);
        wx.hideLoading();
        let data = util.getObjectValue(res, ['data', 'data']);
        if (data && data.length > 0) {
          data.sort((a, b) => {
            return a.startTime - b.startTime
          });
          that.setData({
            membershipChargePackage: data
          })
        }
      })
  },
  getStaffInfosData() {
    let that = this;
    wx.showLoading({
      title: '加载中……',
    })
    let params = {
      id: that.data.stfid,
      workingState: 'A'
    }
    request.httpFind('/api/staffinfo', params).then(res => {
      let data = res.data;
      console.log('38 ', res);
      if (res.code === 200 && data.data) {
        if (data.data.length > 0) {
          let staff = data.data[0];
          let certificateDateOfIssueText = staff.certificateDateOfIssue ? new Date((staff.certificateDateOfIssue).replace(/-/g, '/')).dateFormat('yyyy-MM-dd') : null;
          staff['certificateDateOfIssueText'] = certificateDateOfIssueText;
          let eDate = new Date();
          let sDate = staff.certificateDateOfIssue ? new Date(Date.parse(staff.certificateDateOfIssue.replace(/-/g, "/"))) : eDate;
          let years = eDate.getFullYear() - sDate.getFullYear();
          staff['certificateDateOfYears'] = years;
          staff['avatarUrl'] = staff.avatar ? staff.avatar : constDict.doctorDefImg[staff.sex];
          staff['physicianLevel'] = staff.physicianLevel;
          staff['physicianLevelText'] = staff.physicianLevel && constDict.physicianLevel[staff.physicianLevel] ? constDict.physicianLevel[staff.physicianLevel] : '';
          staff['physicianCategory'] = staff.physicianCategory;
          staff['physicianCategoryText'] = staff.physicianCategory && constDict.physicianCategory[staff.physicianCategory] ? constDict.physicianCategory[staff.physicianCategory] : '';
          staff['staffInfo'] = staff.staffInfo ? staff.staffInfo : constDict.staffInfoDefValue;
          that.setData({
            staff: staff
          })
        }
      } else {
        this.setData({
          noDataShow: true,
          noDataShowText: '暂无该医生信息'
        })
      }
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading();
      this.setData({
        noDataShow: true
      })
      console.log(err);
    })
  },
  getPersonalFamily() {
    let that = this;
    wx.showLoading({
      title: '加载中……',
    })
    let params = {
      uid: this.data.uid,
      untying: 0
    }
    request.httpFind('/api/server_membershipPersonalFamily', params)
      .then(res => {
        wx.hideLoading();
        let data = util.getObjectValue(res, ['data', 'data']);
        if (data && data.length > 0) {
          data.sort((a, b) => {
            return a.type - b.type
          });
          let pidsNew = [];
          data.forEach(da => {
            da['id'] = da.pid;
            pidsNew.push(da.pid)
          })
          that.setData({
            patients: data,
            pids: pidsNew
          })
        }
      })
  },
  getDoctorDetail(stfid) {
    if (stfid > 0) {
      let that = this;
      wx.showLoading({
        title: '加载中……',
      })
      let params = {
        id: stfid
      }
      request.httpOpenFind('/static/server/StaffInfo', params)
        .then(res => {
          wx.hideLoading();
          // console.log('=====>>> 319 StaffInfo ',res);
          let data = util.getObjectValue(res, ['data', 'data', '0'])
          console.log('=====>>> 321 data ', data);
          if (data) {
            let certificateDateOfIssue = data.certificateDateOfIssue;
            let eDate = new Date();
            let sDate = certificateDateOfIssue ? new Date(Date.parse(certificateDateOfIssue.replace(/-/g, "/"))) : eDate;
            let years = eDate.getFullYear() - sDate.getFullYear();
            let doctor = data;
            doctor.staffInfo = doctor.staffInfo && doctor.staffInfo.trim().length > 0 ? doctor.staffInfo.trim() : constDict.staffInfoDefValue;
            doctor['certificateDateOfYears'] = years;
            doctor['avatar'] = data.avatar;
            doctor['avatarUrl'] = data.avatar ? data.avatar : constDict.doctorDefImg[data.sex];
            doctor['physicianLevel'] = data.physicianLevel;
            doctor['physicianLevelText'] = data.physicianLevel && constDict.physicianLevel[data.physicianLevel] ? constDict.physicianLevel[data.physicianLevel] : '';
            doctor['physicianCategory'] = data.physicianCategory;
            doctor['physicianCategoryText'] = data.physicianCategory && constDict.physicianCategory[data.physicianCategory] ? constDict.physicianCategory[data.physicianCategory] : '';
            doctor['expertCategory'] = data.expertCategory;
            //医生id
            doctor['doctorId'] = data.id;
            var endLabel
            // if (data.expertCategory == 2) {
            //   endLabel = "特需专家," + doctor.label
            // } else {
            //   endLabel = doctor.label
            // }
            this.setData({
              doctor: doctor,
              labArray: doctor.label && doctor.label.length > 0 ? doctor.label.split(",") : [],
              doctorId: data.id
            })
          } else {
            this.setData({
              noDataShow: true,
              noDataShowText: '暂无该医生信息'
            })
          }
        }).catch(err => {
          wx.hideLoading();
          this.setData({
            noDataShow: true
          })
          console.log(err);
        })
    } else {
      Toast.fail({
        message: "获取医生信息失败",
        duration: 1000
      });
    }
  },
  previewImg(e) {
    if (this.data.doctor && this.data.doctor.avatar) {
      wx.previewImage({
        urls: [this.data.doctor.avatarUrl]
      })
    }
  },
  navtoDoctorInfo() {
    console.log('跳转医生信息', this.data.stfid);
    if (this.data.doctor) {
      wx.navigateTo({
        url: `/pages/doctorInfo/doctorInfo?stfid=${this.data.stfid}`,
      })
    }
  },
  changDateTiem(timeString) {
    if (timeString && timeString.substr(0, 2)) {
      let h = Number(timeString.substr(0, 2));
      let hs = h < 10 ? '0' + h : '' + h;
      return h >= 12 ? `上午${hs}时` : `下午${hs}时`;
    }
    return '------'
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
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
    console.log('下拉执行 onPullDownRefresh');
    // this.refresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // this.getDoctorSchedulData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let staffName = this.data.doctor.staffName;
    let title = "小优家庭医生"
    if (staffName) {
      title += ' - ' + staffName;
    }
    return {
      title: title,
      path: app.globalData.getCurrentURL(this)
    };
  },
  backIndexPage: function() {
    console.log('分项医生后点击返回index首页')
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
})