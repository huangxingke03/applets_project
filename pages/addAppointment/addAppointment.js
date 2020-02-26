// pages/addAppointment/addAppointment.js
import util from '../../utils/util.js'
import JWTPayload from '../../utils/jwt-payload.js'
import request from '../../utils/request.js'
import constDict from '../../utils/constDict.js'
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast.js';
import keys from '../../utils/enum.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doctor: null,
    schedul: null,
    uid: -1,
    titelTimeString: '----',
    timeAndTypeString: '----',
    diagnosticCategoryString: '',
    patientIndex: 0,
    patientNameText: '---',
    serverIds: constDict.serverIds,
    patients: [],
    titelString: '新的医疗预约',
    // 查看详情模式 时才传递该参数
    apponitment: null,
    // 1.新增 2.详情
    mode: 1,
    firstLoad: true,
    gotoCreatePatient: false, // 跳转创建患者信息
    newPatientInfo: null, //新建患者成功时会被赋值
    newPid: -1,
    notIncludeMyPatientInfo: 0, //0初始值(无病人数据) 1有本人 2无本人
    currentInput: '',
    appointmentedPids: [], // 已预约的相关pid
    stfid: -1,
    showPatientNameText: null,
    reservationInfoArry: [],
    //预约人
    appointmentPersonArry: []
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.firstLoad) {
      if (this.data.gotoCreatePatient) {
        let newPid = -1;
        let newPatientInfo = null;
        if (this.data.newPatientInfo && this.data.newPatientInfo.id > 0) {
          // console.log('52 this.data.newPatientInfo', this.data.newPatientInfo, this.data.newPatientInfo.id);
          newPid = this.data.newPatientInfo.id;
        }
        this.setData({
          newPid: newPid
        })
      }
    }
    this.setData({
      firstLoad: false
    })
    this.getUid();

  },
  /**
   * 获取当前医生当天的预约信息
   */
  getReservationInfo() {
    request.httpFind('/api/server_myAppointmentList', {
      uid: this.data.uid,
      limit: 10,
      skip: 0,
      state: '1,3', //未完成的预约信息
      orderby: 'desc',
      getdate: this.data.doctor.currentDate,
      sid: this.data.doctor.doctorId
    }).then(res => {
      console.log('====>>>server_myAppointmentList:res.data.data', res.data.data);
      if (res.code === 200) {
        this.setData({
          reservationInfoArry: res.data.data
        })
      }
    }).catch(err => {
      console.log('获取当前医生当天的预约信息失败：', err)
    })
  },
  // onInput(){
  //   this.data({
  //     focus: true
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!app.globalData.jwt.isValid()) { // 如果未登录，保存当前页面信息，跳出进行登录
      app.globalData.logout(app.globalData.getCurrentURL(this));
      return;
    }
    let jwt = app.globalData.jwt;
    if (jwt && jwt.isValid()) {
      this.setData({
        uid: jwt.payload.userId
      })
    }
    if (options.apponitment) {
      let apponitmentString = options.apponitment
      let apponitment = JSON.parse(apponitmentString);
      console.log('接收到预约信息：', apponitment);
      let date = new Date((apponitment.startDate).replace(/-/g, '/'));
      let eDate = new Date();
      let sDate = apponitment.certificateDateOfIssue ? new Date(Date.parse(apponitment.certificateDateOfIssue.replace(/-/g, "/"))) : eDate;
      let years = eDate.getFullYear() - sDate.getFullYear();

      let doctor = {
        stfid: apponitment.sid,
        staffName: apponitment.staffName,
        avatar: apponitment.avatar,
        avatarUrl: apponitment.avatar ? apponitment.avatar : constDict.doctorDefImg[apponitment.staffsex],
        jobTitle: apponitment.jobTitle,
        mobile: apponitment.mobile,
        staffInfo: apponitment.staffInfo && apponitment.staffInfo.trim().length > 0 ? apponitment.staffInfo.trim() : constDict.staffInfoDefValue,
        certificateDateOfIssue: apponitment.certificateDateOfIssue,
        certificateDateOfYears: years,
        physicianLevel: apponitment.physicianLevel,
        physicianLevelText: apponitment.physicianLevel && constDict.physicianLevel[apponitment.physicianLevel] ? constDict.physicianLevel[apponitment.physicianLevel] : '',
        physicianCategory: apponitment.physicianCategory,
        physicianCategoryText: apponitment.physicianCategory && constDict.physicianCategory[apponitment.physicianCategory] ? constDict.physicianCategory[apponitment.physicianCategory] : '',
        // storeId: apponitment.storeId,
        // storeName: apponitment.storeName,
        // storeAddress: apponitment.storeAddress,
        // latitude: apponitment.latitude,
        // longitude: apponitment.longitude,
      }
      this.setData({
        apponitment: apponitment,
        mode: 2,
        titelString: (apponitment.patType === '1' ? '我' : apponitment.patientName) + ' 的医疗预约',
        titelTimeString: date ? date.dateFormat('yyyy-MM-dd hh:mm')  : '----',
        diagnosticCategoryString: apponitment.schedulType === '1' ? ' 上门出诊' : ' 医院门诊',
        // timeAndTypeString: date ? date.dateFormat('MM月dd日 hh:mm') + `${apponitment.schedulType === '1' ? ' 上门出诊' : ' 医院门诊'}` : '----',
        doctor: doctor,
      })
      if (apponitment.patType == 1) {
        this.setData({
          showPatientNameText: '本人-' + apponitment.patientName
        })
      } else {
        this.setData({
          showPatientNameText: '家人-' + apponitment.patientName
        })
      }
      console.log('接收到预约信息预约患者onLoad：', this.data.showPatientNameText);
      wx.setNavigationBarTitle({
        title: '预约详情',
      })
    }
    if (this.options.doctor && this.data.mode === 1 && this.options.stfid) {
      let doctorString = this.options.doctor;
      let doctor = JSON.parse(doctorString);
      let schedul = doctor.schedul;
      console.log('=====>>>69 新建预约 ', doctor, schedul);
      console.log('=====>>>70 新建预约 ', schedul.pid);
      let date = new Date((schedul.startDate).replace(/-/g, '/'));
      this.setData({
        doctor: doctor,
        schedul: schedul,
        titelTimeString: date ? date.dateFormat('yyyy-MM-dd hh:mm') : '----',
        appointmentedPids: schedul.pid,
        diagnosticCategoryString: schedul.type === '1' ? ' 上门出诊' : ' 医院门诊',
        // timeAndTypeString: date ? date.dateFormat('MM月dd日 hh:mm') + `${schedul.type === '1' ? ' 上门出诊' : ' 医院门诊'}` : '----'
        stfid: this.options.stfid
      })
      this.getReservationInfo();
    }

  },
  /**
   * 选择预约人
   */
  changePatient(e) {
    //   if (this.data.patients) {
    // if (this.data.patients.length > 0) {
    let i = e.detail.value;
    // console.log('====>> 114 点击更换病人 ', e, i);
    let patientNameText = this.data.patientNameText;
    if (this.data.patients[i]) {
      patientNameText = this.data.patients[i].patientNameText;
      if (patientNameText === '新建档案') {
        patientNameText = '---'
        let url = '';
        // if (this.data.patients.length === 1 || this.data.patients[0].type !== '1') {
        //   url = '/pages/createPatientFile/createPatientFile?sendCreatFileTag=0826';
        // }
        //
        let creatFamilyFileTag = false;
        this.data.appointmentPersonArry.forEach(personItem => {
          if (personItem.type == 1) { //当前有本人的档案,点击新建档案创建家人档案
            creatFamilyFileTag = true
          }
        })
        if (creatFamilyFileTag) { //进入创建档案页面,创建家人档案
          url = '/pages/createPatientFile/createPatientFile';
        } else { //进入创建档案页面,创建本人档案
          url = '/pages/createPatientFile/createPatientFile?sendCreatFileTag=0826';
        }
        wx.navigateTo({
          url: url,
        })
      }
      this.setData({
        patientIndex: i,
        patientNameText: patientNameText,
        gotoCreatePatient: true,
      })
    }
    // console.log('====>> 123 点击更换病人 ', e, this.data.patientIndex);
    // } else {
    //   wx.showToast({
    //     title: '暂无家人信息，请添加后再修改',
    //   }, 1000);
    // }
    // } else {
    //   wx.showToast({
    //     title: '获取信息有误，不能修改',
    //   }, 1000);
    // }
  },
  appointmentSubmit(e) {
    console.log('====>> ', e, e.detail.formId, this.data.patientIndex, e.detail.value);
    if (this.data.schedul) {
      // if (this.data.schedul.type === '1') {
      //   this.getChargePackageinfocount(e)
      // } else {
      //   this.whetherHasFile(this.data.patients[this.data.patientIndex].id, e)
      // }
      this.whetherHasFile(this.data.patients[this.data.patientIndex].id, e)
    }
  },
  /**
   * 查询当前患者是否已有预约
   */
  whetherHasFile(selectPatientId, e) {
    let reservationTag = false;
    let reservationInfo = null;
    console.log('this.data.reservationInfoArry.length', this.data.reservationInfoArry.length)
    if (this.data.reservationInfoArry.length == 0) { //没有预约可以预约
      this.submitRequest(e);
    } else {
      this.data.reservationInfoArry.forEach(itemData => {
        if (itemData.pid == selectPatientId) {
          console.log('当前预约患者已经有预约：', selectPatientId, itemData.startDate, itemData.endDate)
          reservationTag = true;
          reservationInfo = itemData;
        }
      })
      console.log('reservationTag,reservationInfo', reservationTag, reservationInfo)
      if (reservationTag) { //当前预约人在同一个医生,同一天其他时段,已有预约,所以不能多次预约
        this.promptDialog(reservationInfo, e)
      } else {
        this.submitRequest(e);
      }
    }
  },
  /**
   * 已预约提示弹窗
   */
  promptDialog(itemData, e) {
    console.log('promptDialog', itemData.startDate, itemData.endDate)
    let that = this;
    Dialog.confirm({
      title: '注意',
      message: itemData.patientName + ' 已预约' + itemData.startDate + "到" + itemData.endDate + '，如果预约当天新的时段，将取消该次预约。'
    }).then(() => {
      console.log('确认取消预约');
      console.log('itemData:', itemData.appointmentId, itemData.appointmentState, itemData)
      if (itemData.appointmentId > 0 && (itemData.appointmentState === '1' || itemData.appointmentState === '3')) {
        let params = {
          pid: that.data.patients[that.data.patientIndex].id,
          schedulId: that.data.schedul.id,
          createUid: that.data.uid,
          uid: that.data.uid,
          remark: e.detail.value.remark,
          form_id: e.detail.formId,
          apponitmentId: itemData.appointmentId
        }
        console.log('server_storeSchedulingRefresh:parm', params);
        request.httpCreate('/api/server_storeSchedulingRefresh', params).then(res => {
          // console.log(res);
          if (res.code === 200) {
            console.log('server_storeSchedulingRefresh:res', res)
            if (res.data.code === 200) {
              wx.showToast({
                title: '原有预约已取消，已重新预约。',
              }, 1000)
              var timeout = setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          }
        })
      } else {
        wx.showToast({
          title: '信息有误，取消预约失败',
        }, 1000)
      }
    }).catch(() => {
      console.log('点击取消');
    });
  },
  submitRequest(e) {
    let that = this;
    if (that.data.patients[that.data.patientIndex].id !== 'a') {
      // console.log('===》》 187 ', e.detail.formId, e.detail.value.id, that.data.schedul);
      if (e.detail.value.id > 0 && that.data.schedul && that.data.schedul.id > 0) {
        let params = {
          pid: that.data.patients[that.data.patientIndex].id,
          schedulId: that.data.schedul.id,
          createUid: that.data.uid,
          uid: that.data.uid,
          remark: e.detail.value.remark,
          form_id: e.detail.formId
        }
        console.log('===》》 提交的数据 ', params);
        request.httpCreate('/api/server_storeSchedulingadd', params).then(res => {
          // console.log(res);
          if (res.code === 200) {
            if (res.data.code === 200) {
              Toast.success({
                message: "提交成功，待医生确认",
                duration: 1000
              });
              var timeout = setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            } else if (res.data.code === 405) {
              Toast.fail({
                message: "当前专家不能预约",
                duration: 1000
              });
            } else if (res.data.code === 412) {
              Toast.fail({
                message: "当前专家不能被预约",
                duration: 1000
              });
            }
          } else {
            Toast.fail({
              message: "预约失败",
              duration: 1000
            });
          }
        })
      } else {
        Toast.fail({
          message: "获取信息有误……",
          duration: 1000
        });
      }
    } else {
      wx.showToast({
        title: '请选择预约人',
      }, 1000);
    }
  },
  getInput: function (e) {
    this.setData({
      currentInput: e.detail.value
    })
  },
  cancleAppointment() {
    let that = this;
    Dialog.confirm({
      title: '注意',
      message: '您是否确认取消本次预约？'
    }).then(() => {
      console.log('确认取消预约');
      if (that.data.apponitment && that.data.mode === 2) {
        let apponitment = that.data.apponitment;
        // 
        if (apponitment.appointmentId > 0 && (apponitment.appointmentState === '1' || apponitment.appointmentState === '3')) {
          wx.showLoading({
            title: '请稍后……',
          })
          let params = {
            uid: that.data.uid
          }
          // console.log('====>> 226 ', apponitment.appointmentId, params); //apponitment.appointmentId
          request.httpRemove('/api/server_storeSchedulingadd', apponitment.appointmentId, params).then(res => {
            wx.hideLoading();
            // console.log('====>> 229 ', res);
            if (res.code === 200) {
              let data = util.getObjectValue(res, ['data']);
              if (data) {
                if (data.code === 200) {
                  wx.showToast({
                    title: '取消预约成功',
                  }, 1000)
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (data.code === 400) {
                  wx.showToast({
                    title: '取消预约失败',
                  }, 1000)
                }
              } else {
                wx.showToast({
                  title: '取消预约失败',
                }, 1000)
              }
            } else {
              wx.showToast({
                title: '取消预约失败',
              }, 1000)
            }
          }).catch(err => {
            wx.hideLoading();
            wx.showToast({
              title: '取消预约失败',
            }, 1000)
          })
        } else {
          wx.showToast({
            title: '信息有误，取消预约失败',
          }, 1000)
        }
      }
    }).catch(() => {
      console.log('点击取消');
    });
  },
  getChargePackageinfocount(e) {
    let that = this;
    wx.showLoading({
      title: '加载中……',
    })
    let params = {
      uid: that.data.uid, //285
      id: (that.data.serverIds).toString()
    }
    request.httpFind('/api/server_chargePackageinfocount', params)
      .then(res => {
        wx.hideLoading();
        // console.log('=====>> 287 server_chargePackageinfocount', res);
        let havePages = false;
        if (res.code === 200) {
          let data = util.getObjectValue(res, ['data', 'data']);
          if (Object.values(data).length > 0) {
            for (let a in data) {
              if (data[a].type) {
                havePages = true;
                break;
              }
            }
            if (havePages) {
              that.submitRequest(e)
            }
          }
        }
        if (!havePages) {
          let mesg = '您暂无可用服务，请先购套餐！';
          that.showDialog(mesg);
        }
      })
  },
  showDialog(mesg) {
    Dialog.confirm({
      title: '注意',
      message: mesg
    }).then(() => {
      wx.navigateTo({
        url: '/subPackage/pages/productList/productList'
      })
    }).catch(() => {
      console.log('点击取消');
    });
  },
  getUid() {
    let that = this;
    let jwt = getApp().globalData.jwt;
    let token = jwt.token;
    if (jwt && jwt.isValid()) {
      that.setData({
        uid: jwt.payload.userId
      })
      // that.getPatients();
      that.getPersonalFamily();
    } else {
      wx.showToast({
        title: '您还未登陆',
      }, 1000);
      getApp().globalData.logout();
    }
  },
  getPersonalFamily() {
    let that = this;
    if (that.data.uid > 0) {
      let params = {
        "limit": "7",
        "skip": "0",
        uid: this.data.uid,
        untying: '0'
      }
      request.httpFind('/api/server_membershipPersonalFamily', params)
        .then(res => {
          this.setData({
            appointmentPersonArry: res.data.data
          })
          // console.log('=====>>> 368 ', res, util.getObjectValue(res, ['data','data']),that.data);
          let data = util.getObjectValue(res, ['data', 'data']);
          let appointmentedPids = that.data.appointmentedPids;
          if (appointmentedPids && data && data.length) {
            data = data.filter(pat => {
              return appointmentedPids.indexOf(pat.pid) === -1
            })
          }
          if (data && data.length > 0) {
            let pats = data;
            pats.sort((a, b) => {
              return a.type - b.type
            });
            // if (pats[0] && pats[0].type == '1') { 
            //   that.setData({
            //     notIncludeMyPatientInfo: 1
            //   })
            // } else {
            //   that.setData({
            //     notIncludeMyPatientInfo: 2
            //   })
            // }

            pats.forEach(pat => {
              pat['id'] = pat['pid'];
              if (pat.type === '1') {
                pat['patientNameText'] = `本人-${pat.patientName}`
              } else if (pat.type === '2' || pat.type === '3') {
                pat['patientNameText'] = `家人-${pat.patientName}`
              } else {
                pat['patientNameText'] = `${pat.patientName}`
              }
            })
            console.log('=====>>> 388 ', pats);
            if (this.data.newPid > 0) {
              let patIndex = pats.findIndex(da => {
                return da.id === this.data.newPid
              });
              that.setData({
                patientIndex: patIndex,
                newPid: -1,
                newPatientInfo: null,
                gotoCreatePatient: false,
                patients: pats,
                patientNameText: pats[patIndex] && pats[patIndex]['patientNameText'] ? pats[patIndex]['patientNameText'] : pats[0]['patientNameText'],
              })
            } else {
              let patNameText = pats[0]['patientNameText'];
              if (this.data.patientIndex == pats.length - 1 && pats[this.data.patientIndex] && pats[this.data.patientIndex].id === 'a') {
                patNameText = '---'
              }
              that.setData({
                patients: pats,
                patientNameText: patNameText,
              })
            }
          } else {
            that.setData({
              patientNameText: '---',
            })
          }
          let pats = that.data.patients;
          console.log('pats', pats)
          if (pats && (pats.length < 7 && pats[pats.length - 1] && pats[pats.length - 1].id !== 'a')) {
            pats.push({
              id: 'a',
              patientName: '新建档案',
              patientNameText: '新建档案'
            })
            that.setData({
              patients: pats
            })
          }
        })
    }
    console.log('getPersonalFamily:patients', that.data.patients)
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
  // getPatients() {
  //   let that = this;
  //   if (that.data.uid > 0) {
  //     let params = {
  //       uid: this.data.uid, //292
  //       $sort: {
  //         type: '1'
  //       }
  //     }
  //     request.httpFind('/api/patientinfo', params)
  //       .then(res => {
  //         let data = util.getObjectValue(res, ['data', 'data']);
  //         if (data && data.length > 0) {
  //           // console.log('=====>> 367 patientinfo ', data);
  //           let pats = data;
  //           pats.forEach(pat => {
  //             if (pat.type === '1') {
  //               pat['patientNameText'] = `本人-${pat.patientName}`
  //             } else if (pat.type === '2' || pat.type === '3'){
  //               pat['patientNameText'] = `家人-${pat.patientName}`
  //             } else {
  //               pat['patientNameText'] = `${pat.patientName}`
  //             }
  //           })
  //           // pats.push({
  //           //   id: 'a',
  //           //   patientName: '新建档案',
  //           //   patientNameText: '新建档案'
  //           // })
  //           if (this.data.newPid > 0){
  //             let patIndex = pats.findIndex(da => {
  //               return da.id === this.data.newPid
  //             });
  //             that.setData({
  //               patientIndex: patIndex,
  //               newPid: -1,
  //               newPatientInfo: null,
  //               gotoCreatePatient: false,
  //               patients: pats,
  //               patientNameText: pats[patIndex] && pats[patIndex]['patientNameText'] ? pats[patIndex]['patientNameText'] : pats[0]['patientNameText']
  //             })
  //           } else {
  //             let patNameText = pats[0]['patientNameText'];
  //             if (this.data.patientIndex == pats.length - 1 && pats[this.data.patientIndex] && pats[this.data.patientIndex].id === 'a') {
  //               patNameText = '---'
  //             }
  //             that.setData({
  //               patients: pats,
  //               patientNameText: patNameText
  //             })
  //           }
  //         } else {
  //           that.setData({
  //             patientNameText: '---'
  //           })
  //         }
  //         let pats = that.data.patients;
  //         if (pats && (pats.length === 0 || pats[pats.length - 1] && pats[pats.length - 1].id !== 'a')){
  //           pats.push({
  //             id: 'a',
  //             patientName: '新建档案',
  //             patientNameText: '新建档案'
  //           })
  //           that.setData({
  //             patients: pats
  //           })
  //         }
  //       })
  //   }
  // },
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
    return getApp().globalData.defaultShareObject;
  }
})