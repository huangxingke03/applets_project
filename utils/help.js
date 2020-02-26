

/**
 * 设置 Sorage 内容
 * 直接用wx.setStorage即可
 */
const setStorageVal = (keyVal,dataVal) => {
  wx.setStorage({
    key: keyVal,
    data: dataVal,
  })
}

module.exports = {
  setStorageVal: setStorageVal,
}