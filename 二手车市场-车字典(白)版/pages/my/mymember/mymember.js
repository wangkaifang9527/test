// pages/my/mymember/mymember.js

var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismember:0,
    expiretime:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var ismember = options.ismember;
    var expiretime = options.expiretime;
    this.setData({
      ismember: ismember,
      expiretime: expiretime
    })
    
  },

  
  //换卡
  huanka:function(){
    wx.navigateTo({
      url: '/pages/my/memberopening/memberopening?type=3',
    })
  },
  //续费
  xufei:function(){
    wx.showModal({
      title: '提示',
      content: '确认续费吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: "提交中"
          });
          url.ajaxGet(false, url.member_renew,
            {
              openId: app.globalData.openid,
            }, function (data) {
              console.log("续费会员:", data);

              wx.hideLoading();
              if (data.resultCode == 1) {
                var ss = data.result;
                //发起微信支付
                wx.requestPayment({
                  'timeStamp': ss.timeStamp,
                  'nonceStr': ss.nonceStr,
                  'package': ss.package_,
                  'signType': 'MD5',
                  'paySign': ss.sign,
                  'success': function (res) {
                    console.log("支付成功回掉：", res);
                    //wx.setStorageSync('package', data.data.package);
                    wx.showModal({
                      title: '提示',
                      content: '恭喜您!成为车字典的' + that.data.title,
                      success: function (res) {

                      }
                    })
                  }, 'fail': function (res) {
                    console.log(res);
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: data.resultMsg,
                  success: function (res) {
                  }
                })
              }

            });

        }
      }
    })
    
  }
})