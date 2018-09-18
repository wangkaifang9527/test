//获取应用实例
var url = require("utils/url.js");//服务列表
//app.js
App({
  /**
   * 生命周期函数--监听小程序初始化
   */
  onLaunch: function (options) {
    var that = this;
    console.log('小程序初始化options:', options);
    //调用API从本地缓存中获取数据

  },

  //获取用户登陆身份
  getUserId: function (cb) {
    //console.log("cb:", cb);
    var that = this;

    // 调用接口获取登录凭证（code）进而换取用户登录态信息
    // 包括用户的唯一标识（openid） 及本次登录的 会话密钥（session_key）等
    // 用户数据的加解密通讯需要依赖会话密钥完成。
    wx.login({
      success: function (res) {
        console.log("微信获取登录凭证code:", res);
        if (res.code) {
          wx.request({
            url: url.login,
            data: { 'code': res.code },
            header: { 'content-type': 'application/json' },
            success: function (data1) {
              console.log('登陆回掉数据', data1);
              that.globalData.session_key = data1.data.result.sessionKey;
              that.globalData.openid = data1.data.result.openid;
              that.globalData.isadmin = data1.data.result.user.admin;
              that.globalData.cellphoneNumber = data1.data.result.user.cellphoneNumber;
              that.globalData.balance = data1.data.result.user.balance
              //本地存是否有手机号信息
              wx.setStorageSync('isphone', data1.data.result.user.hasCellphoneNumber)
              wx.setStorageSync('newUser', data1.data.result.user.newUser)
              typeof cb == "function" && cb(data1.data.result.user);
            }
          })
        } else {
          wx.hideLoading();
          console.log('获取用户登录态失败！' + res.errMsg)
          wx.showModal({
            title: '提示',
            content: '获取用户登录态失败！',
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {

              }
            }
          })
        }
      },
      fail: function (res) {
        console.log("微信获取登录凭证code失败", res);
      }
    });
  },





  globalData: {
    userInfo: null,
    openid: null,
    token: null,
    isGetUserInfo: false,
    location: {},
    bg_gary: '/images/bg_gary.png',
    session_key: null,
    isadmin: false,
    cellphoneNumber: '',

  }
})
