// pages/warrant/deal-order-admin/deal-order-admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],//渲染数据
    isEmpty: true,//第一次为空
    isloading: false,//
    isloadover: false,//
    tab_show: 1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

 
  //同意退款
  onRefund: function(){
    wx.navigateTo({
      url: '/pages/warrant/refund/refund',
    })
  },
  //tab 切换
  onTab: function (e) {
    this.setData({
      tab_show: e.currentTarget.dataset.i
    })
  },
})