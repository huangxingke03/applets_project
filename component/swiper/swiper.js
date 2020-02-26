import util from '../../utils/util.js'

Component({
  properties: {
    imgArray: {
      type: Array,
      value: []
    }
  },
  data: {
    imgUrls: [
      // util.addFileUrl('wxapp-1547101846373-swiper1.png?wx_lazy=1'),
      // util.addFileUrl('wxapp-1547101846435-swiper2.png?wx_lazy=1'),
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    clickIndex: null
  },
  methods: {
    changeIndicatorDots: function(e) {
      this.setData({
        indicatorDots: !this.data.indicatorDots
      })
    },
    changeAutoplay: function(e) {
      this.setData({
        autoplay: !this.data.autoplay
      })
    },
    intervalChange: function(e) {
      this.setData({
        interval: e.detail.value
      })
    },
    durationChange: function(e) {
      this.setData({
        duration: e.detail.value
      })
    },
    /**
     * 点击事件
     */
    carouselMapItemEvent: function(e) {
      var itemIndex = e.currentTarget.dataset.index
      var itemType = e.currentTarget.dataset.type
      var itemPath = e.currentTarget.dataset.path
      console.log('carouselMapItemEvent:itemPath--itemIndex--itemType', itemPath, itemIndex, itemType)
      this.triggerEvent('carouselMapItemClick', {
        itemIndex: itemIndex, itemType: itemType, itemPath: itemPath
      })
    }
  }
})