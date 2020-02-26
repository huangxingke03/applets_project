// component/canclesurebt/canclesurebt.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 取消按钮
     */
    cancelEvent: function(e) {
      var viewId = e.target.id;
      console.log('cancelEvent', viewId)
      this.triggerEvent('cancelEvent', {
        viewId: viewId,
      })
    },
    /**
     * 确定按钮
     */
    sureEvent: function(e) {
      var viewId = e.target.id;
      console.log('sureEvent', viewId)
      this.triggerEvent('sureEvent', {
        viewId: viewId,
      })
    },
  }
})