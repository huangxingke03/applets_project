// miniprogram/pages/doctorScreening/doctorScreening.js
const app = getApp();
import request from '../../utils/request.js';
import constDict from '../../utils/constDict.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    expertCategoryName: '',
    expertCategoryValue: '',
    deptsNameValue: '',
    //医生列表
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
    //录入医生名字
    inputName: '',
    noData: false, //没医生数据
    hasData: false, //有医生数据
    endChoseContion: true, //显示选择结果
    //显示录入名字,选择科室,专家类别信息
    showInputValue: '',
    searchLoading: false,
    searchLoadingComplete: false,
    searchPageNum: 1, // 设置加载的第几次，默认是第一次
    skipValue: 0,
    moreLoad: false,
    //列表上下滑动状态
    verticalSlidingTag: true,
    //当前选择科室id 保存选中状态
    currentDepartMentId: 0,
    //当前选择科室id 保存选中状态
    currentCategoryId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let jwt = app.globalData.jwt;
    // debugger
    if (!jwt.isValid()) { // 如果未登录或者token失效，则跳转登录。
      app.globalData.logout();
    } else {
      this.getDepartmentList()
      this.getDoctorList()
      this.selectFilterCondition()
    }
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

  },
  /**
   * 获取录入医生名字信息
   */
  getInputName: function(e) {
    if (e.detail.value == '') {
      console.log('清空输入框内容')
      this.setData({
        inputName: ''
      })
    } else {
      console.log('输入框输入内容=>' + e.detail.value)
      this.setData({
        inputName: e.detail.value
      })
    }
  },
  /**
   * 获取拼接展示的名字 科室 类别信息
   */
  getSelectInfo: function(e) {
    this.setData({
      showInputValue: e.detail.value
    })
  },
  /**
   * 点击筛选按钮显示选择筛选项
   */
  filterEvent: function(e) {
    if (this.data.startChoseContion != true) {
      this.selectFilterCondition()
    }
  },
  /**
   * 清除按钮事件
   */
  clearEvent: function(e) {
    this.setData({
      expertCategoryValue: '',
      inputName: '',
      //医生科室点击 清除 后默认选中全部
      deptsNameValue: '',
      currentDepartMentId: 0,
      //专家类别点击 清除 后默认选中全部
      currentCategoryId: 0,
      expertCategoryName: ''
    })
    this.endSelectFilter()
    this.getDoctorList()
  },
  /**
   * 点击搜条目显示选择筛选项
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
    var departMentName = e.detail.departmentName
    var departMentId = e.detail.departmentId
    console.log("医生科室=>", departMentName)
    if (departMentId == 0) { //所有科室
      this.setData({
        deptsNameValue: '',
        currentDepartMentId: 0,
      })
    } else { //单个科室
      this.setData({
        deptsNameValue: departMentName,
        currentDepartMentId: departMentId
      })
    }
  },
  /**
   * 选择医生类别信息
   */
  choseCategory: function(e) {
    var categoryName = e.detail.categoryName
    var categoryId = e.detail.categoryId
    console.log('医生专家类别==>', categoryName)
    console.log('医生专家类别id==>', categoryId)
    this.setData({
      currentCategoryId: categoryId,
      expertCategoryName: categoryName,
    })
    if (categoryId == 1) { //加载普通专家类医生
      this.setData({
        expertCategoryValue: 1,
      })
    } else if (categoryId == 2) { //加载特需专家类医生
      this.setData({
        expertCategoryValue: 2,
      })
    } else if (categoryId == 0) { //加载所有专家类医生
      this.setData({
        expertCategoryValue: '',
        expertCategoryName: ''
      })
    }
  },
  /**
   * 选择筛选条件后点击取消按钮
   */
  cancelEvent: function(e) {
    this.endSelectFilter()
  },
  /**
   * 选择筛选条件后点击确定按钮
   */
  sureEvent: function(e) {
    this.setData({
      skipValue: 0,
    })
    this.spliceSelectData()
    this.endSelectFilter()
    this.getDoctorList()
  },
  /**
   * 选择医生筛选条件 科室 专家类别
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
      //隐藏录入信息汇总显示框
      endChoseContion: false,
      //清空拼接后的名字  科室  专家类别信息
      showInputValue: '',
      skipValue: 0,
      searchPageNum: 1,
      //选择筛选条件时禁止上下滑动
      verticalSlidingTag: false,
    })
  },
  /**
   * 滑动加载数据
   */
  slideLoadData: function() {
    console.log('滑动到底部加载数据')
    if (this.data.searchLoading && !this.data.searchLoadingComplete) {
      this.setData({
        searchPageNum: this.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1
        moreLoad: true
      });
      if (this.data.loadDataSuccess) { //滑动分页加载时,前一次加载成功后加载
        this.setData({
          loadDataSuccess: false
        })
        this.getDoctorList()
      }
    }
  },
  /**
   *拼接科室 名字 专家类别信息
   */
  spliceSelectData() {
    //拼接录入医生名字
    if (this.data.inputName != '') {
      this.setData({
        showInputValue: this.data.inputName
      })
    }
    console.log("inputName,showInputValue", this.data.inputName, this.data.showInputValue)
    //拼接医生科室
    if (this.data.deptsNameValue != '') {
      if (this.data.showInputValue == '') {
        this.setData({
          showInputValue: this.data.deptsNameValue
        })
      } else {
        this.setData({
          showInputValue: this.data.showInputValue + "-" + this.data.deptsNameValue
        })
      }
    }
    console.log("deptsNameValue,showInputValue", this.data.deptsNameValue, this.data.showInputValue)
    //拼接医生专家类别
    if (this.data.expertCategoryName != '') {
      if (this.data.showInputValue == '') {
        this.setData({
          showInputValue: this.data.expertCategoryName
        })
      } else {
        this.setData({
          showInputValue: this.data.showInputValue + "-" + this.data.expertCategoryName
        })
      }
    }
    console.log("expertCategoryName,showInputValue", this.data.expertCategoryName, this.data.showInputValue)
  },
  /**
   * 结束选择筛选条件
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
      //显示录入信息汇总显示框
      endChoseContion: true,
      //筛选条件结束可以上下互动
      verticalSlidingTag: true
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
    request.httpFind('/api/Depts', name).then(res => {
      let data = res.data;
      let params = {
        '$skip': 0,
        '$sort[createdAt]': '-1',
        isFictitious: 0, //0:真实科室1:虚拟科室
        isDelete: 0, //状态删除标示(0:正常 1:已删除)
        parentDid: res.data.data[0].id, //上级科室id
      }
      //查询总科室上海中和堂门诊部的下级科室
      request.httpFind('/api/Depts', params).then(res => {
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
  /**
   * 获取在线医生列表
   */
  getDoctorList() {
    let that = this;
    let params = {
      key: 'xiaoyouyishengDoctor',
      limit: '20',
      skip: this.data.skipValue,
      staffName: this.data.inputName,
      expertCategory: this.data.expertCategoryValue,
      deptsName: this.data.deptsNameValue,
    }
    request.httpFind('/api/server_getdoctor', params).then(res => {
      let data = res.data;
      if (res.code === 200 && data.data && data.data.length != 0) {
        let staffs = this.formateStaffData(data.data, '1-2');
        staffs.forEach(staff => {
          if (staff.label && staff.label.length > 0) {
            staff['labArray'] = staff.label.split(",")
          }
        });
        let dataList = [];
        that.data.searchPageNum == '1' ? dataList = staffs : dataList = that.data.staffInfos.concat(staffs)
        this.setData({
          hasData: true,
          noData: false,
          staffInfos: dataList,
          searchLoading: true,
          loadDataSuccess: true,
          skipValue: this.data.skipValue + data.data.length,
          moreLoad: false
        })
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
   * 加载数据失败
   */
  loadDataFailure() {
    if (this.data.searchPageNum == '1') {
      this.setData({
        searchLoadingComplete: false,
        searchLoading: false,
        noData: true,
        hasData: false,
      })
    } else {
      this.setData({
        searchLoadingComplete: true,
        searchLoading: false,
      })
    }
  },
  formateStaffData(data, schedulType) {
    let staffs = [];
    data.forEach(staff => {
      // console.log('======>>> staff ',staff);
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
      staffs.push(staff);
    })
    return staffs;
  },
  /**
   * 进入医生预约页面
   */
  doctorItemEvent: function(e) {
    let doctor = e.detail.doctor
    wx.navigateTo({
      url: `/pages/appointmentDoctor/appointmentDoctor?stfid=${doctor.stfid}&schedulType=${doctor.schedulType}`,
    })
  }
})