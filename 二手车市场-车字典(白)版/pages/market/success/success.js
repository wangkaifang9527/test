// pages/market/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: 'pages/market/details/details',//分享的页面路径
    id_: '',//车辆ID
    title_flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()//隐藏转发按钮
    console.log(options)
    this.setData({
      id_: options.id_,
      title_flag: options.title_flag,
    })
  },

  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    console.log('res', res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('button', res.target)
    }
    return {
      title: '车辆详细信息',
      path: that.data.path + "?id_=" + that.data.id_,
      // imageUrl: that.data.share.imageUrl,
      success: function (res) {
        console.log(app.globalData.openid);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  fanhuishouye: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  //分享朋友圈 到canvas画布页面
  pyq: function () {
    wx.navigateTo({
      url: '/pages/market/canvas/canvas?id_=' + this.data.id_,
    })
  },

  //onPaidHelp
  onPaidHelp: function(){
    wx.navigateTo({
      url: '/pages/market/paid-help/paid-help?vehicleId='+this.data.id_,
    })
  },
})