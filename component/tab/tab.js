var tab = {
    chose_index:1,
    tab_ch:function (e) {
      console.log(e)
        var dataset = e.currentTarget.dataset
        return dataset.id
    },
    // isIphoneX:true
}
module.exports = tab