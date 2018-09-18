// pages/warrant/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

 
  //查看订单
  onOrder: function(){
    wx.navigateTo({
      url: '/pages/warrant/deal-order/deal-order',
    })
  },
  //返回首页
  onHomePage: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})