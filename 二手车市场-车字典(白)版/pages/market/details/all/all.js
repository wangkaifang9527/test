// pages/market/details/all/all.js
var app = getApp();
var url = require("../../../../utils/url.js");//服务列表
var util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    forwardUserList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    url.ajaxPost(false, url.forward_paidForwardList, {
      openId: app.globalData.openId,
      vehicleId: options.vehicleId,
    }, function (data) {
      console.log("服务器:", data);
      that.setData({
        forwardUserList:data.result.userInfos
      })
    });
  },

 
})