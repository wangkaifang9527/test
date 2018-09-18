// pages/my/apply-tg/apply-tg.js
//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    banner:'http://www.levau.com/icon/tuiguang.png',
    tg_gz_photo: 'http://www.levau.com/icon/tg_gz_photo.png',
    tg_gz_flag:false,
    share_title: '申请推广',
    share_path: 'pages/my/apply-tg/apply-tg',
  },

  
  on_tg_gz:function(){
    var that = this
    that.setData({
      tg_gz_flag: !that.data.tg_gz_flag
    })
  },

  //申请开通推广
  apply_tg:function(){

    wx.showModal({
      title: '提示',
      content: '申请开通需支付100.00元，收益满100元，100元原路退回 是否继续支付',
      success: function (res) {
        if(res.confirm){
          url.ajaxPost(false, url.promotePay, {
            openId: app.globalData.openid,
          }, function (re) {
            console.log(re);
            var ss = re.result;
            wx.requestPayment({
              'timeStamp': ss.timeStamp,
              'nonceStr': ss.nonceStr,
              'package': ss.package_,
              'signType': 'MD5',
              'paySign': ss.sign,
              'success': function (res) {
                console.log("支付成功回掉：", res);
                wx.showModal({
                  title: '提示',
                  content: '恭喜!!!成为车字典推广者',
                  success: function (res) {
                    wx.switchTab({
                      url: '/pages/my/my',
                    })
                  }
                })

              }
            })
          })
        }else{
          util.showToast('取消支付','success');
        }
      }
    })  
    
  },

  onLoad: function (options) {
    if (options.openid) {
      //获取用户登陆身份
      wx.showLoading({ title: "初始化", mask: true });
      app.getUserId(function (data) {
        wx.hideLoading();
        //that.callBackgetUserId(options, data);
      });
    }
  },
  onShareAppMessage: function (res) {
    var that = this;
    console.log('res', res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('来自页面内转发按钮', res.target)
    }
    return {
      title: that.data.share_title,
      path: that.data.share_path + '?openid=' + app.globalData.openid,
      // imageUrl: that.data.share.imageUrl,
      success: function (res) {
        console.log(app.globalData.openid);
      },
      fail: function (res) {
        // 转发失败
      }
    }

  },
})

