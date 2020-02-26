// component/doctorsearch/doctorsearch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 抖索输入框是否禁用 默认不禁用
     */
    hasFocus: {
      type: Boolean,
      value: false
    },
    /**
     * 搜索图标按钮透明度,默认不透明
     */
    iconOpacity: {
      type: Number,
      value: 1
    },
    /**
     * 清空按钮是否隐藏 默认不隐藏
     */
    btShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //搜索输入框输入内容
    inoutValue: null,
    btTextValue: '筛选'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 搜索框整体条目点击事件
     */
    itemEvent: function(e) {
      this.triggerEvent('itemEvent')
    },
    /**
     * 点击搜索符号事件
     */
    seachEvent: function(e) {
      this.triggerEvent('seachEvent')
    },
    /**
     * 点击清空按钮事件
     */
    clearEvent: function(e) {
      this.setData({
        inoutValue: null
      })
      this.triggerEvent('clearEvent')
    },
    /**
     * 条件输入框录入值获取
     */
    getInputData: function(e) {
      var inputData = e.detail.value
      this.triggerEvent('getInputData', {
        inputData: inputData
      })
    }
  }
})