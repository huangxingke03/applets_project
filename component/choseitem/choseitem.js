// component/chose-item/chose-item.js
Component({
  /**
   * 组件的属性列表   
   * 医生科室选择
   */
  properties: {
    /**
     * 条目标题
     */
    itemTitle: {
      type: String,
      value: null
    },
    /**
     * 数据源信息
     */
    resourceArray: {
      type: Array,
      value: []
    },
    /**
     * 医生科室
     */
    departmentTag: {
      type: Boolean,
      value: true
    },
    /**
     * 专家类别
     */
    categoryTag: {
      type: Boolean,
      value: false
    },
    /**
     * 当前选中科室id
     */
    selectDepartmentId: {
      type: Number,
      value: 0
    },
    /**
     * 当前选中专家类别id
     */
    selectCategoryId: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentDepartmentId: null,
    currentCategoryId: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 选择科室
     */
    choseDepartment: function(e) {
      var departmentName = e.currentTarget.dataset.name
      var departmentId = e.currentTarget.dataset.id
      // this.setData({
      //   currentDepartmentId: departmentId
      // })
      this.triggerEvent('choseDepartment', {
        departmentName: departmentName,
        departmentId: departmentId
      })
    },
    /**
     * 选择专家类别
     */
    choseCategory: function(e) {
      var categoryName = e.currentTarget.dataset.name
      var categoryId = e.currentTarget.dataset.id
      // this.setData({
      //   currentCategoryId: categoryId
      // })
      this.triggerEvent('choseCategory', {
        categoryName: categoryName,
        categoryId: categoryId
      })
    }
  }
})