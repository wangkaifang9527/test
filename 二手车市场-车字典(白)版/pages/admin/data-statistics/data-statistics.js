var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    url.ajaxPost(false, url.member_change, {
      openId: app.globalData.openid
    }, function (data) {
      console.log("管理员统计信息:", data);
      that.setData({
        user:data.result,
      })
    });
  },

 
})