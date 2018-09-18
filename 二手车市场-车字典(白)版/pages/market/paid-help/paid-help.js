// pages/market/paid-help/paid-help.js
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
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
    this.setData({
      vehicleId: options.vehicleId
    })
  },

 
  //确定支付
  formSubmitPay: function(e){
    console.log(e)
    var that = this;
    var from_data = e.detail.value
    var vehicleId = that.data.vehicleId
    
    if (e.detail.value.amount == '') {
      util.showToast("赏金金额为空", 'error');
      return;
    }
    if (from_data.amount < 30 ){
      util.showToast("最低30元", 'error');
      return;
    }
    
    if (from_data.amount > app.globalData.balance) {
      wx.showModal({
        title: '提示',
        content: '余额不足,是否去充值',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/memberopening/memberopening?vehicleId=' + vehicleId,
            })
          }
        }
      })
      return
    }

    url.ajaxPost(false, url.forward_setForward, {
      openId: app.globalData.openid,
      vehicleId: that.data.vehicleId,
      amount: from_data.amount,
    }, function (data) {
      console.log("服务器:", data);
      if (data.resultCode==1){
        util.showToast('成功', 'success');
        setTimeout(function(){
          wx.switchTab({
            url: '/pages/index/index',
          })
        },800)
      }else{
        util.showToast(data.resultMsg, 'error');
      }
    });
  },
})