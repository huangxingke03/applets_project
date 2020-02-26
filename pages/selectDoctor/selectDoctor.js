// pages/selectDoctor/selectDoctor.js
import request from '../../utils/request.js';
import constDict from '../../utils/constDict.js';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
import keys from '../../utils/enum.js';

const app = getApp()
let pagesize1 = 50,
  pageIndex1 = 1,
  index1 = 0,
  total1 = 0,
  pagesize2 = 10,
  pageIndex2 = 1,
  index2 = 0,
  total2 = 0;
let appointMentWeekCount = constDict.appointMentWeekCount || 30;
const message = '当前功能需要用户登录';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    active: 0,
    uid: -1,
    tabs: ['我的医生', '门诊医生'],
    myStaffInfos: [],
    titelKey: "staffName",
    color1: "#124395",
    color2: "#EE501A",
    noDataShow1: false,
    noDataShow2: false,
    dataAllLoaded1: false,
    dataAllLoaded2: false,
    myStaffIds: {},
    firstLoad: true,
    labArray: [],
    labShowTag: false,
    searchLoading: false,
    searchLoadingComplete: false,
    searchPageNum: 1, // 设置加载的第几次，默认是第一次
    skipValue: 0,
    hasData: false, //有数据
    noData: false, //没数据
    moreLoad: false,
    loadDataSuccess: false, //加载问诊医生数据成功 ,
    currentPage: 0,
    //有门诊医生数据
    hasOutDoctor: false,
    //没有门诊医生数据
    noOutDoctor: false,
    startChoseContion: false,
    departmentArray: [],
    doctorKindArray: [{
        name: "全部",
        id: 0
      },
      {
        name: "普通",
        id: 1
      },
      {
        name: "特需",
        id: 2
      }
    ],
    //门诊医生列表
    staffInfos: [],
    //选择条件部分透明度
    opacityValue: 0,
    backWallShow: false,
    //显示筛选按钮
    startFilterTag: true,
    //显示清除按钮
    startClearTag: false,
    deptAll: {
      name: '全部',
      id: 0
    },
    //结束筛选 医生名字 科室 专家类别拼接信息框是否显示
    endChoseContion: true,
    //显示录入名字,选择科室,专家类别信息
    showInputValue: '',
    //列表上下滑动状态
    verticalSlidingTag: true,
    //上次筛选条件
    previousFilter: {
      staffNameValue: '', //医生名字
      expertCategoryValue: '', //专家类别 1 或者2
      deptsNameValue: '', //科室名字
      expertCategoryName: '', //专家类别名字 普通 专家
      deptChoseId: 0, //选中科室id
      expertCategoryChoseId: 0, //选中专家类别id
    },
    previousStaffName: 'previousFilter.staffNameValue',
    previousExpertCategory: 'previousFilter.expertCategoryValue',
    previousExpertCategoryChoseId: 'previousFilter.expertCategoryChoseId',
    previousExpertCategoryName: 'previousFilter.expertCategoryName',
    previousDeptsName: 'previousFilter.deptsNameValue',
    previousDeptChoseId: 'previousFilter.deptChoseId',
    //本次选中科室id 专家类别id 保存选中状态
    currentDepartMentId: 0,
    currentCategoryId: 0,
    //当前选中科室名字 id
    selectDepartMentName: '',
    selectDepartMentId: '',
    //当前选中专家类别名字  id  
    selectExpertCategoryName: '',
    selectExpertCategoryChoseId: '',
    //1表示普通  2表示特需
    selectExpertCategoryTag: '',
    //录入医生名字
    inputName: '',
    jwtValue: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    let jwt = app.globalData.jwt;
    this.setData({
      jwtValue: jwt,
    })
    if (jwt != null) {
      if (jwt && jwt.isValid()) {
        this.setData({
          uid: jwt.payload.userId,
        })
      }
    }
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    console.log('winWidth:winHeight',this.data.winWidth,this.data.winHeight)
    if (options.doctorType != null) {
      that.setData({
        currentTab: 1,
        staffInfos: [],
        searchLoadingComplete: false,
        searchPageNum: 1, // 设置加载的第几次，默认是第一次
        skipValue: 0,
        loadDataSuccess: false
      })
    }
    this.refresh();
    this.getDepartmentList()
    //隐藏转发按钮
    // wx.hideShareMenu()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      firstLoad: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return getApp().globalData.defaultShareObject;
  },

  /**
   * 点击标题切换页面
   */
  clickChange: function(e) {
    console.log('e.target.dataset.current:', e.target.dataset.current);
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
      if (e.target.dataset.current == 0) { //切换到我的医生页面结束筛选
        wx.hideShareMenu()
        if (this.data.jwtValue!=null){
          if (!this.data.jwtValue.isValid()) {
            Dialog.confirm({
              title: '登录提醒',
              message,
              confirmButtonText: "去登陆"
            });
            return;
          }
        }else{
          Dialog.confirm({
            title: '登录提醒',
            message,
            confirmButtonText: "去登陆"
          });
          return;
        }
        this.setData({
          currentCategoryId: 0,
          selectExpertCategoryName: '',
          selectExpertCategoryTag: '',
          currentDepartMentId: 0,
          selectDepartMentName: '',
          inputName: '',
          showInputValue: '',
          [this.data.previousStaffName]: '',
          [this.data.previousExpertCategory]: '',
          [this.data.previousExpertCategoryChoseId]: '',
          [this.data.previousExpertCategoryName]: '',
          [this.data.previousDeptsName]: '',
          [this.data.previousDeptChoseId]: '',
        })
        this.endSelectFilter()
        this.refresh();
      } else if (e.target.dataset.current == 1) {
        wx.showShareMenu()
        this.setData({
          staffInfos: [],
          myStaffInfos: [],
          searchLoadingComplete: false,
          searchPageNum: 1, // 设置加载的第几次，默认是第一次
          skipValue: 0,
          loadDataSuccess: false
        })
        this.refresh();
      }
    }
  },
  refresh() {
    if (this.data.currentTab == 0) {
      this.setData({
        myStaffInfos: [],
        staffInfos: [],
        dataAllLoaded1: false,
        noDataShow1: false
      })
      pageIndex1 = 1, index1 = 0, total1 = 0;
      this.getMyStaffInfosData();
    } else {
      this.getStaffInfosData(this.data.inputName, this.data.selectExpertCategoryTag, this.data.selectDepartMentName)
    }
  },
  /**
   * 我的医生开始预约
   */
  gotoAppointmentDoctor(e) {
    let doctor = e.currentTarget.dataset.doctor;
    let doctorString = JSON.stringify(doctor);
    wx.navigateTo({
      url: `/pages/appointmentDoctor/appointmentDoctor?stfid=${doctor.stfid}&schedulType=${doctor.schedulType}`,
    })
  },
  /**
   * 门诊医生开始预约
   */
  outDoctorEvent: function(e) {
    let doctor = e.detail.doctor
    wx.navigateTo({
      url: `/pages/appointmentDoctor/appointmentDoctor?stfid=${doctor.stfid}&schedulType=${doctor.schedulType}`,
    })
  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    });
  },
  /**
   * 加载数据失败
   */
  loadDataFailure() {
    if (this.data.searchPageNum == '1') {
      this.setData({
        searchLoadingComplete: false,
        searchLoading: false,
        noOutDoctor: true,
        hasOutDoctor: false,
      })
    } else {
      this.setData({
        searchLoadingComplete: true,
        searchLoading: false,
      })
    }
  },
  /**
   * 获取录入医生名字信息
   */
  getInputName: function(e) {
    if (e.detail.value == '') {
      this.setData({
        inputName: ''
      })
    } else {
      this.setData({
        inputName: e.detail.value
      })
    }
  },
  /**
   * 获取结束筛选后显示的名字 科室 类别信息
   */
  getSelectInfo: function(e) {
    this.setData({
      showInputValue: e.detail.value
    })
  },
  /**
   * 筛选
   */
  filterEvent: function(e) {
    if (this.data.startChoseContion != true) {
      this.selectFilterCondition()
    }
  },

  /**
   * 点击输入框开始筛选
   */
  clickInputBox: function(e) {
    if (this.data.startChoseContion == false) {
      this.selectFilterCondition()
    }
  },
  /**
   * 选择科室信息 
   */
  choseDepartment: function(e) {
    if (e.detail.departmentId == 0) { //全部科室
      this.setData({
        selectDepartMentId: 0,
        selectDepartMentName: '',
        currentDepartMentId: 0,
      })
    } else { //某个科室
      this.setData({
        selectDepartMentId: e.detail.departmentId,
        selectDepartMentName: e.detail.departmentName,
        currentDepartMentId: e.detail.departmentId,
      })
    }
    console.log('科室类别--id', e.detail.departmentName, e.detail.departmentId)
  },
  /**
   * 选择医生类别信息
   */
  choseCategory: function(e) {
    this.setData({
      selectExpertCategoryName: e.detail.categoryName,
      selectExpertCategoryChoseId: e.detail.categoryId,
      currentCategoryId: e.detail.categoryId
    })
    if (e.detail.categoryId == 1) { //普通类专家
      this.setData({
        selectExpertCategoryTag: 1
      })
    } else if (e.detail.categoryId == 2) { //特需类专家
      this.setData({
        selectExpertCategoryTag: 2
      })
    } else if (e.detail.categoryId == 0) { //全部类专家
      this.setData({
        selectExpertCategoryName: '',
        selectExpertCategoryTag: '',
        selectExpertCategoryChoseId: '',
      })
    }
    console.log('医生专家类别--id', e.detail.categoryName, e.detail.categoryId)
  },
  /**
   * 选择筛选条件时,点击 取消按钮
   */
  cancelEvent: function(e) {
    console.log('点击取消', this.data.previousFilter.staffNameValue, this.data.previousFilter.deptsNameValue, this.data.previousFilter.expertCategoryName)
    //当前筛选条件值默认恢复到上一次的筛选
    this.setData({
      selectDepartMentName: this.data.previousFilter.deptsNameValue,
      selectExpertCategoryName: this.data.previousFilter.expertCategoryName,
      selectExpertCategoryTag: this.data.previousFilter.expertCategoryValue,
      selectDepartMentId: this.data.previousFilter.deptChoseId,
      selectExpertCategoryChoseId: this.data.previousFilter.expertCategoryChoseId,
      inputName: this.data.previousFilter.staffNameValue,
      //科室  专家类别选择状态
      currentCategoryId: this.data.previousFilter.expertCategoryChoseId,
      currentDepartMentId: this.data.previousFilter.deptChoseId,
    })
    //显示上一次的筛选条件 医生名字 专家类别  医生科室拼接后显示
    this.spliceSelectData(this.data.previousFilter.staffNameValue, this.data.previousFilter.deptsNameValue, this.data.previousFilter.expertCategoryName)
    this.endSelectFilter()
  },
  /**
   * 选择筛选条件时,点击 确定按钮
   */
  sureEvent: function(e) {
    this.setData({
      skipValue: 0,
      staffInfos: [],
      //保存当前的筛选条件为上一次的
      [this.data.previousStaffName]: this.data.inputName,
      [this.data.previousExpertCategory]: this.data.selectExpertCategoryTag,
      [this.data.previousExpertCategoryChoseId]: this.data.selectExpertCategoryChoseId,
      [this.data.previousExpertCategoryName]: this.data.selectExpertCategoryName,
      [this.data.previousDeptsName]: this.data.selectDepartMentName,
      [this.data.previousDeptChoseId]: this.data.selectDepartMentId,
    })
    console.log("点击确定==>", this.data.inputName, this.data.selectDepartMentName, this.data.selectExpertCategoryName)
    //结束筛选后拼接 录入医生名字  医生科室  医生专家类别并显示
    this.spliceSelectData(this.data.inputName, this.data.selectDepartMentName, this.data.selectExpertCategoryName)
    //根据筛选条件获取门诊医生数据
    this.getStaffInfosData(this.data.inputName, this.data.selectExpertCategoryTag, this.data.selectDepartMentName)
    //结束筛选
    this.endSelectFilter()
    console.log('previousFilter==>', this.data.previousFilter)
  },
  /**
   * 选择筛选条件时,点击 清除按钮
   */
  clearEvent: function(e) {
    this.setData({
      //开始筛选录入的名字信息清空
      inputName: '',
      //清空上一次筛选条件
      [this.data.previousStaffName]: '',
      [this.data.previousExpertCategory]: '',
      [this.data.previousExpertCategoryChoseId]: '',
      [this.data.previousExpertCategoryName]: '',
      [this.data.previousDeptsName]: '',
      [this.data.previousDeptChoseId]: '',
      //清空当前筛选条件
      inputName: '',
      selectDepartMentId: '',
      selectDepartMentName: '',
      selectExpertCategoryChoseId: '',
      selectExpertCategoryName: '',
      selectExpertCategoryTag: '',
      //科室 转接类别 默认选中全部类
      currentDepartMentId: 0,
      currentCategoryId: 0,
      searchPageNum: 1,
      staffInfos: [],
      skipValue: 0,
    })
    this.endSelectFilter()
    this.getStaffInfosData('', '', '');
  },
  /**
   * 开始筛选
   */
  selectFilterCondition() {
    this.setData({
      //显示录入名字文本框 显示选择选择条件栏
      startChoseContion: true,
      backWallShow: true,
      //隐藏筛选按钮
      startFilterTag: false,
      //显示删除按钮
      startClearTag: true,
      endChoseContion: false,
      //清空拼接后的名字  科室  专家类别信息
      showInputValue: '',
      searchPageNum: 1,
      //选择筛选条件时禁止上下滑动
      verticalSlidingTag: false,
    })
    console.log('selectFilterCondition--previousFilter:', this.data.previousFilter)
  },
  /**
   * 结束选择筛选
   */
  endSelectFilter() {
    this.setData({
      //隐藏录入名字文本框 隐藏选择选择条件栏
      startChoseContion: false,
      backWallShow: false,
      //显示筛选按钮
      startFilterTag: true,
      //隐藏删除按钮
      startClearTag: false,
      endChoseContion: true,
      //筛选条件结束可以上下互动
      verticalSlidingTag: true
    })
  },
  /**
   *拼接科室 名字 专家类别信息
   */
  spliceSelectData(doctorName, deptsName, expertCategoryName) {
    //拼接录入医生名字
    if (doctorName != '') {
      this.setData({
        showInputValue: doctorName
      })
    }
    //拼接医生科室
    if (deptsName != '') {
      if (this.data.showInputValue == '') {
        this.setData({
          showInputValue: deptsName
        })
      } else {
        this.setData({
          showInputValue: this.data.showInputValue + "-" + deptsName
        })
      }
    }
    //拼接医生专家类别
    if (expertCategoryName != '') {
      if (this.data.showInputValue == '') {
        this.setData({
          showInputValue: expertCategoryName
        })
      } else {
        this.setData({
          showInputValue: this.data.showInputValue + "-" + expertCategoryName
        })
      }
    }
  },
  /**
   * scroll-view互动到底部触发加载医生数据事件
   */
  searchScrollLower: function() {
    if (this.data.loadDataSuccess) { //滑动分页加载时,前一次加载成功后加载
      this.setData({
        loadDataSuccess: false
      })
      this.setData({
        searchPageNum: this.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1
        moreLoad: true
      });
      console.log('searchScrollLower:==>this.data.searchPageNum', this.data.searchPageNum)
      this.getStaffInfosData(this.data.inputName, this.data.selectExpertCategoryTag, this.data.selectDepartMentName)
    }
  },
  /**
   * 获取问诊医生
   */
  getStaffInfosData(staffNameValue, expertCategoryValue, deptsNameValue) {
    console.log('getStaffInfosData:==>this.data.searchPageNum', this.data.searchPageNum)
    let that = this;
    let params = {
      key: 'xiaoyouyishengDoctor',
      limit: '20',
      skip: this.data.skipValue,
      staffName: staffNameValue,
      expertCategory: expertCategoryValue,
      deptsName: deptsNameValue,
    }
    request.httpOpenFind('/static/server/server_getdoctor', params).then(res => {
      let data = res.data;
      this.data.searchPageNum
      console.log("本次加载门诊医生:data.data==>", data.data)
      if (res.code === 200 && data.data && data.data.length != 0) {
        let staffs = this.formateStaffData(data.data, '1-2');
        staffs.forEach(staff => {
          var endLabel;
          if (staff.label && staff.label.length > 0) {
            console.log('staff.label,staff.expertCategory:', staff.label, staff.expertCategory)
            // if (staff.expertCategory == 2) {
            //   endLabel = "特需专家," + staff.label
            // } else {
            //   endLabel = staff.label
            // }
            staff['labArray'] = staff.label.split(",")
          }
        });
        let dataList = [];
        that.data.searchPageNum == '1' ? dataList = staffs : dataList = that.data.staffInfos.concat(staffs)
        this.setData({
          hasOutDoctor: true,
          noOutDoctor: false,
          staffInfos: dataList,
          searchLoading: true,
          skipValue: this.data.skipValue + data.data.length,
          moreLoad: false
        })
        console.log("下次加载起始数据起始编号==>", this.data.skipValue)
        if (data.data.length < data.rowcount) {
          this.setData({
            loadDataSuccess: true,
          })
        } else {
          this.setData({
            loadDataSuccess: false,
          })
        }
        staffs = null;
      } else {
        this.loadDataFailure()
      }
    }).catch(err => {
      console.log(err);
      this.loadDataFailure()
    })
  },
  /**
   * 获取个人医生
   */
  getMyStaffInfosData() {
    let that = this;
    let params = {
      uid: that.data.uid,
      limit: pagesize1,
      skip: index1
    }
    request.httpFind('/api/server_membershipPersonalDoctor', params).then(res => {
      let data = res.data;
      // console.log('43 ', res);
      if (res.code === 200 && data.data) {
        if (data.data.length > 0) {
          total1 = data.total;
          let staffs = data.data;
          index1 = index1 + staffs.length;
          pageIndex1++;
          staffs = this.formateStaffData(staffs, '1');
          //获取医生标签处理并展示
          staffs.forEach(staff => {
            var endLabel;
            if (staff.label && staff.label.length > 0) {
              console.log('staff.label,staff.expertCategory:', staff.label, staff.expertCategory)
              // if (staff.expertCategory == 2) {
              //   endLabel = "特需专家," + staff.label
              // } else {
              //   endLabel = staff.label
              // }
              //医生标签栏
              staff['labArray'] = staff.label.split(",")
            }
          });
          this.setData({
            myStaffInfos: this.data.myStaffInfos.concat(staffs)
          })
          staffs = null;
          // console.log('146 ', this.data);
        } else if (this.data.myStaffInfos.length > 0) {
          // console.log('148 ', this.data.myStaffInfos.length > 0);
          this.setData({
            dataAllLoaded1: true
          })
        } else {
          if (this.data.myStaffInfos.length <= 0) {
            this.setData({
              noDataShow1: true
            })
          }
          //第一次获取我的医生数据如果没有,切换门诊医生页面
          if (that.data.firstLoad) {
            // setTimeout(function() {
            //   that.setData({
            //     currentTab: 1,
            //     firstLoad: false,
            //     currentPage: 1
            //   })
            // }, 1000)
          }
        }
      } else {
        this.setData({
          noDataShow1: true
        })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '获取信息失败',
      }, 1000)
      console.log(err);
    })
  },
  /**
   * 获取科室信息
   */
  getDepartmentList() {
    let that = this;
    let name = {
      name: '上海中和堂门诊部',
    }
    //查询总科室上海中和堂门诊部的id
    request.httpOpenFind('/static/server/Depts', name).then(res => {
      let data = res.data;
      let params = {
        '$skip': 0,
        '$sort[createdAt]': '-1',
        isFictitious: 0, //0:真实科室1:虚拟科室
        isDelete: 0, //状态删除标示(0:正常 1:已删除)
        parentDid: res.data.data[0].id, //上级科室id
      }
      //查询总科室上海中和堂门诊部的下级科室
      request.httpOpenFind('/static/server/Depts', params).then(res => {
        let data = res.data;
        console.log('====>>>Depts', res);
        if (data.data) {
          if (data.data.length > 0) {
            //处理数据,添加科室全部类别
            var deptArray = []
            deptArray.push(this.data.deptAll)
            data.data.forEach(dept => {
              var deptInfo = {
                name: dept.name,
                id: dept.id
              };
              deptArray.push(deptInfo)
            })
            this.setData({
              departmentArray: deptArray,
            })
          }
        }
      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    })
  },
  formateStaffData(data, schedulType) {
    let staffs = [];
    data.forEach(staff => {
      // console.log('======>>> staff ', staff);
      staff.staffInfo = staff.staffInfo && staff.staffInfo.trim().length > 0 ? staff.staffInfo.trim() : constDict.staffInfoDefValue;
      staff['avatarUrl'] = staff.avatar ? staff.avatar : constDict.doctorDefImg[staff.sex];
      staff['physicianLevel'] = staff.physicianLevel;
      staff['physicianLevelText'] = staff.physicianLevel && constDict.physicianLevel[staff.physicianLevel] ? constDict.physicianLevel[staff.physicianLevel] : '';
      staff['physicianCategory'] = staff.physicianCategory;
      staff['physicianCategoryText'] = staff.physicianCategory && constDict.physicianCategory[staff.physicianCategory] ? constDict.physicianCategory[staff.physicianCategory] : '';
      // 1 代表上门 1-2 代表所有排班（1，2的并集）
      staff['schedulType'] = schedulType;
      staff['id'] = staff.stfid;
      if (schedulType === '1') {
        this.data.myStaffIds[staff.stfid] = 1;
      }
      // 排除 我的医生中存在的医生信息
      // if (!this.data.myStaffIds[staff.id]){
      staffs.push(staff);
      // }
    })
    return staffs;
  },
  /**
   * 禁止swiper滑动事件
   */
  catchTouchMove: function(res) {
    return false
  },
  onClose(event) {
    if (event.detail === 'confirm') {
      app.globalData.logout(app.globalData.getCurrentURL(this));
    } else if (event.detail === 'cancel') {
      wx.redirectTo({
        url: '/pages/selectDoctor/selectDoctor?doctorType=2',
      })
    }
  },
})