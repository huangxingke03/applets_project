// component/doctoritem/doctoritem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    doctorArry: {
      type: Array,
      value: []
    }
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
     * 医生信息条目点击事件
     */
    doctorItemEvent: function(e) {
      let doctor = e.currentTarget.dataset.doctor;
      console.log('doctor', doctor)
      this.triggerEvent('doctorItemEvent', { doctor: doctor})
    }
  }
})