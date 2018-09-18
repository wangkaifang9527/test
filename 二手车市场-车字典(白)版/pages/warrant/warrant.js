// pages/warrant/warrant.js
var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ispingtai: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      vehicleId: options.vehicleId
    })
  },

 
  //是否平台
  onISpt: function(){
    this.setData({
      ispingtai: !this.data.ispingtai
    });
  },
  //担保支付
  formSubmit: function (e) {
    var that = this
    console.log(e);
    if (e.detail.value.price<3000){
      util.showToast('小于3000', 'error');
      return;
    }
    if (that.data.ispingtai){//委托平台检测
      wx.showModal({
        title: '提示',
        content: '委托平台检测及过户将产生额外的服务费用(具体费用请咨询客服)，是否继续',
        success: function (res) {
          if (res.cancel) {
            util.showToast('已取消', 'success');
            return;
          }else {
            //判断用户是否 担保金额大于 余额的时候 需要先充值
            if (e.detail.value.price > app.globalData.balance){
              wx.showModal({
                title: '提示',
                content: '余额不足，请先充值',
                success: function (res) {
                  if(res.confirm){
                    wx.navigateTo({
                      url: '/pages/my/memberopening/memberopening?vehicleId=' + that.data.vehicleId,
                    })
                  }
                }
              })  
            }else{
              that.getVehicleTrade(e.detail);
            }
          }
        }
      })
    }else{
      if (e.detail.value.price > app.globalData.balance) {
        wx.showModal({
          title: '提示',
          content: '余额不足，请先充值',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/my/memberopening/memberopening?vehicleId=' + that.data.vehicleId,
              })
            }
          }
        })
        return ;
      }else{
        that.getVehicleTrade(e.detail);
      }
    }
  },

  //交易担保 1.下单（买家）
  getVehicleTrade: function (detail){
    var that = this;
    url.ajaxPost(false, url.vehicleTrade_createTrade, {
      openId: app.globalData.openid,
      vehicleId: that.data.vehicleId,
      earnestMoney: detail.value.price,
      formId: detail.formId
    }, function (data) {
      console.log("买家下单:", data, data.resultCode == 1);
      if (data.resultCode == 1){
        //下单成功
        //2买家支付
        url.ajaxPost(false, url.vehicleTrade_pay, {
          openId: app.globalData.openid,
          orderNo: data.result.tradeInfo.orderNo
        }, function (data1) {
          console.log("买家支付:", data1);
          if (data1.resultCode == 1){
            wx.navigateTo({
              url: '/pages/warrant/success/success',
            })
          }else{
            util.showToast(data1.resultCode, 'success');
          }
        });
      }else{
        util.showToast(data.resultCode, 'success');
      }
    });
  }
})