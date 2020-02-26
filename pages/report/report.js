// pages/report/report.js
const app = getApp()
import request from "../../utils/request.js"
import { resultsDetail } from "../../utils/resource.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    steps:[
      { desc:"  正在等待医生叫号进行诊断" }
      , { desc: " 正在等待面诊" }
      , { desc: " 正在等待舌诊" }
      , { desc: "未出报告，请等待" }
    ],
 direction: "vertical",
    activeColor: "#adadad",
    active:-1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ id=617,pid=2837,name}) {
    if (!app.globalData.jwt.isValid()) { // 如果未登录，保存当前页面信息，跳出进行登录
      app.globalData.logout(app.globalData.getCurrentURL(this));
      return;
    }
    request.httpFind("/api/server_auxiliaryInfoStatus", { pid,rid:id}).then(
      res=>{
        console.log(res)
        var data=res.data.data
        let { patientName, reportStatus, results = null, reporting=""}=data
        let { steps}=this.data
        let active=-1
        if (data.hasOwnProperty("results"))
        {
          steps[0].desc = "医生已叫号进行诊断"
          active++
        }
       
        if (data.AuxiliaryFacial)
        {
          steps[1].desc = "已完成面诊"
          active++
        }
        if (data.AuxiliaryTongue)
        {
          steps[2].desc = "已完成舌诊"
          active++
        }
        if (data.reportStatus==1)
        {
          active++
          steps[3].desc = "已出报告"
        }
        console.log(active)
        var index=active<0?0:active
        var status = steps[index].desc
          if(results)
            results =results&&results.split(",")
        this.setData({
          resultsDetail,
          reportStatus,
          reporting,
          active,
          patientName:name,
          results,
          steps,
          status,
          id,
          pid,
          name
        })
      }
    )
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    console.log('下拉')
   var load= this.onLoad
   var {id,name,pid}=this.data
    new Promise(function(resolve, reject) {
      resolve(load({id,pid,name}))
    }).then(res=>{
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})