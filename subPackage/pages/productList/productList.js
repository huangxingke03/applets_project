// miniprogram/pages/productList/productList.js
const app = getApp();
const goodsGroupIds = ["107185584", '107962890', "107065485", ]; // 会员套餐，实物产品
import request from '../../../utils/request.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopId: app.globalData.shopId,
    appId: app.globalData.appId,
    openId: app.globalData.jwt.payload.openid,
    //默认选中一级目录的index
    selectPrimaryIndex: 0,
    //默认选中二级目录的index
    selectSecondaryIndex: 0,
    //一级目录数据
    primaryDirectory: [],
    rightView: '',
    //二级目录数据
    secondaryDirectory: [],
    //有赞商品分组id
    youZanGoodsGroupId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let jwt = app.globalData.jwt;
    if (jwt != null) {
      if (!jwt.isValid()) { // 如果未登录或者token失效，则跳转登录。
        app.globalData.logout(app.globalData.getCurrentURL(this));
        return;
      }
    } else {
      app.globalData.logout(app.globalData.getCurrentURL(this));
      return;
    }
    //获取商品一级目录
    this.getGoodsDirectory(options);
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
   * 商品详情购买页面跳转
   */
  handleGoodsClick: function(e) {
    let t = e.detail;
    // request.httpCreate('/api/server_youzanQRcode', {
    //   alias: t.alias
    // }).then(res => {
    //   // console.log(res);
    //   if (res.code === 200) {
    //     wx.downloadFile({
    //       url: app.globalData.domain + '/file/' + options.alias + '.jpg',
    //       success: (res) => {
    //         console.log("tempFilePath: " + res.tempFilePath);
    //         app.globalData.tempFilePath[t.alias] = res.tempFilePath;
    //       },
    //     });
    //   }
    // })
    wx.request({
      url: app.globalData.domain + '/api/server_youzanQRcode',
      method: 'POST',
      data: JSON.stringify({
        alias: t.alias
      }),
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.globalData.jwt.token
      },
      success: (res) => {

      },
      complete: () => {
        wx.downloadFile({
          url: app.globalData.domain + '/file/' + t.alias + '.jpg',
          success: (res) => {
            console.log('download success: ' + res.tempFilePath)
            app.globalData.tempFilePaths[t.alias] = res.tempFilePath;
          },
          complete: () => {
            wx.navigateTo({
              url: '/subpackage1/pages/yzGoodsProxy/yzGoodsProxy?alias=' + t.alias,
            })
          }
        })
      }
    })
  },
  /**
   * 选择一级分组,并加载对应的二级分组
   */
  selectPrimaryDirectory: function(options) {
    let primaryIndexValue = options.currentTarget.dataset.index
    //二级分组数据源
    let childSortValue = options.currentTarget.dataset.childsort
    let idValueView = options.currentTarget.dataset.idvalue
    //保存重定向view
    app.globalData.saveView = idValueView
    if (childSortValue) {
      const secondaryDirectoryData = this.initDirectoryData(JSON.parse(childSortValue))
      this.setData({
        secondaryDirectory: secondaryDirectoryData,
      })
      // console.log('secondaryDirectoryData', secondaryDirectoryData)
      //默认加载每项一级目录的,第一项二级目录的商品
      let youZanGoodsGroupIdValue = secondaryDirectoryData[0].youZanDirectoryId
      wx.redirectTo({
        url: '/subPackage/pages/productList/productList?youZanGoodsGroupIdKey=' + youZanGoodsGroupIdValue + '&selectPrimaryIndexKey=' + primaryIndexValue +
          '&selectSecondaryIndexKey=' + 0,
      })
    }
  },
  /**
   * 选择二级分组,加载商品
   */
  selectSecondaryDirectory: function(options) {
    let secondaryIndexValue = options.currentTarget.dataset.index
    let youZanGoodsGroupIdValue = options.currentTarget.dataset.id
    this.setData({
      selectSecondaryIndex: secondaryIndexValue,
    })
    wx.redirectTo({
      url: '/subPackage/pages/productList/productList?youZanGoodsGroupIdKey=' + youZanGoodsGroupIdValue + '&selectPrimaryIndexKey=' + this.data.selectPrimaryIndex +
        '&selectSecondaryIndexKey=' + secondaryIndexValue,
    })
  },
  /**
   * 点击箭头滑动到最右端
   */
  scrollToRight: function() {
    this.setData({
      rightView: this.data.primaryDirectory[this.data.primaryDirectory.length - 1].idValue,
      selectPrimaryDirectoryIndex: this.data.primaryDirectory.length - 1
    })
  },
  /**
   *获取商品一级目录并展示
   */
  getGoodsDirectory: function(options) {
    //加载一级分类
    if (options.directoryData) {
      this.setData({
        primaryDirectory: JSON.parse(options.directoryData),
      })
    } else {
      this.setData({
        primaryDirectory: app.globalData.primaryDirectoryData,
      })
    }
    //根据传进来的分组id 一级 二级目录选中编号显示选中状态,并加载商品
    if (options.youZanGoodsGroupIdKey && options.selectPrimaryIndexKey && options.selectSecondaryIndexKey) {
      const secondaryDirectoryData = this.initDirectoryData(JSON.parse(app.globalData.primaryDirectoryData[options.selectPrimaryIndexKey].childSort))
      this.setData({
        youZanGoodsGroupId: options.youZanGoodsGroupIdKey,
        selectPrimaryIndex: parseInt(options.selectPrimaryIndexKey),
        selectSecondaryIndex: parseInt(options.selectSecondaryIndexKey),
        secondaryDirectory: secondaryDirectoryData,
      })
    } else { //一级分组 二级分组默认选中第一个
      const secondaryDirectoryData = this.initDirectoryData(JSON.parse(app.globalData.primaryDirectoryData[this.data.selectPrimaryIndex].childSort))
      this.setData({
        youZanGoodsGroupId: secondaryDirectoryData[0].youZanDirectoryId,
        secondaryDirectory: secondaryDirectoryData,
      })
    }
  },
  /**
   * 商品分组数据处理
   */
  initDirectoryData(directoryResource) {
    const directoryArray = []
    for (var i = 0; i < directoryResource.length; i++) {
      var directoryItem = directoryResource[i]
      directoryItem['index'] = i
      directoryItem['idValue'] = 'view' + i
      directoryArray.push(directoryItem)
    }
    return directoryArray;
  },
  /**
   * 跳转购物车模块
   */
  jumpToCartPage: function() {
    wx.navigateTo({
      url: '/subPackage2/pages/youZancart/youZancart',
    })
  },
  /**
   * 跳转拼团模块
   */
  jumpToGroupPage: function() {
    wx.navigateTo({
      url: '/subPackage/pages/youZanGroup/youZanGroup',
    })
  },
  onShareAppMessage: function() {
    let title = "小优家庭医生商城"
    return {
      title: title,
      path: "/pages/ProductListProxy/ProductListProxy"
    };
  },
})