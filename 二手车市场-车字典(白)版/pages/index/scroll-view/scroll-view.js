// pages/order/car/add_car/car_brand/car_brand.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open:true,
    interval:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
     
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    setInterval(function () {
      console.log("1");
      if (that.data.interval){
        that.setData({
          interval: false
        })
      }
      that.setData({
        interval: !that.data.interval
      })
    }, 4000)
    
    
  },

 
  
})
