// component/imgInfo/imgInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 列表 数据源
    infosData:{
      type: Array,
      value: []
    },
    // item中 titel字段名
    titelKey:{
      type: String,
      value: "staffName"
    },
    // tagKey1 
    tagKey1: {
      type: String,
      value: ""
    },
    // tagKey2
    tagKey2: {
      type: String,
      value: ""
    },
    // 简介内容 字段名
    infoTextKey: {
      type: String,
      value: ""
    },
    // 左侧按钮颜色
    neutralBtnCOlor: {
      type: String,
      value: "#124395"
    },
    // 左侧按钮文字
    neutralBtnText: {
      type: String,
      value: "咨询"
    },
    // 右侧按钮颜色
    positiveBtnColor: {
      type: String,
      value: "#EE501A"
    },
    // 右侧按钮文字
    positiveBtnText: {
      type: String,
      value: "预约"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    infosData:[],
    tag1Def: "老中医",
    tag2Def: "主任",
    infoTextDef:""
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 左侧按钮
    _neutral(){
      console.log("点击 neutralBtn");
    },
    // 右侧按钮
    _positive(){
      console.log("点击 positiveBtn");
    }
  }
})
