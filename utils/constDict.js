// 可用门店信息
const storeInfo = {
  ids:3
}
const weekArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
// 可预约的周期，默认一周 
const appointMentWeekCount = 30;
// 医生简介 默认显示值
const staffInfoDefValue = '中医专家';
// 目前检验是否有可用套餐 提供的 服务收费项目id 
const serverIds = [2,3]; 
// 预约状态 显示时使用
// 1.提交预约，待确认 2.已取消 3.已确认 4.未确认 5.已完成
const appointmentStatus = {
  1: {
    text: '待确认',
    color:'#9d6212'
  },
  2: {
    text: '已取消',
    color: '#9c3b0e'
  },
  3: {
    text: '预约成功',
    color: '#24aa70'
  },
  4: {
    text: '未确认',
    color: '#9c3b0e'
  },
  5: {
    text: '已完成',
    color: '#24aa70'
  }
}
// 腾讯地图key
const qqMapWxKey = '4UUBZ-MMWCI-QFMGA-5NKH5-KPAXO-GGFNJ';
// 雇员表 医师级别
const physicianLevel = {
  1: '执业医师',
  2: '主治医师',
  3: '副主任医师',
  4: '主任医师'
}
// 雇员表 医师类别
const physicianCategory = {
  1: '临床',
  2: '中医',
  3: '口腔',
  4: '公共卫生'
}
// 雇员默认头像
const doctorDefImg = {
  "F":"../../images/doctorDefImgF.jpg",
  "M":"../../images/doctorDefImgM.jpg"
}
// 从门诊列表进入预约医生 加载上门或门诊数据
const schedulTypes = ["2"];

module.exports = {
  storeInfo: storeInfo,
  weekArr: weekArr,
  appointMentWeekCount: appointMentWeekCount,
  staffInfoDefValue: staffInfoDefValue,
  serverIds: serverIds,
  appointmentStatus: appointmentStatus,
  qqMapWxKey: qqMapWxKey,
  physicianLevel: physicianLevel,
  physicianCategory: physicianCategory,
  doctorDefImg: doctorDefImg,
  schedulTypes: schedulTypes
}