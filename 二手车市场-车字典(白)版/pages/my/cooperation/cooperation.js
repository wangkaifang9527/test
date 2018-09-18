// pages/my/cooperation/cooperation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share_title: '商务合作',
    share_path: 'pages/my/cooperation/cooperation',
  },
  onLoad:function(options){
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
  
  onCityCharge: function(){
    wx.navigateTo({
      url: '/pages/my/city-charge/city-charge',
    })
  },
})