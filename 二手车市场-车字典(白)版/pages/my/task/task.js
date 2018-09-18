// pages/my/task/task.js
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: 'pages/index/index',//分享的页面路径
    shareImageUrl: 'http://www.levau.com/share/share.png',
    share_title: '#朋友圈的车源都发在这儿#',
    modelCarCount: 0,
    modelCarAmount: '',

    isSignIn: true,//默认是未签到

    percent: 0,//进度条数值
    background1: '#999',
    background2: '#999',
    background3: '#999',
    background4: '#999',
    background5: '#999',
    background6: '#999',
    background7: '#999',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var modelCarAmount = wx.getStorageSync('modelCarAmount');
    var modelCarAmountTime = wx.getStorageSync('modelCarAmountTime');
    var date = util.toDate(new Date().getTime(), 'YMD');
    console.log(modelCarAmount, modelCarAmountTime, date, date > modelCarAmountTime);
    var percent = 0;
    var background1 = '#999';
    var background2 = '#999';
    var background3 = '#999';
    var background4 = '#999';
    var background5 = '#999';
    var background6 = '#999';
    var background7 = '#999';
    if (date == modelCarAmountTime) {//当天
      that.setData({
        isSignIn: false,//无需再签到
        modelCarAmount: modelCarAmount
      });
    }
    if (modelCarAmount == 1) {
      percent = 17;
      background1 = '#1C2B3C'

    } else if (modelCarAmount == 2) {
      percent = 34;
      background1 = '#1C2B3C'
      background2 = '#1C2B3C'
    } else if (modelCarAmount == 3) {
      percent = 51;
      background1 = '#1C2B3C'
      background2 = '#1C2B3C'
      background3 = '#1C2B3C'
    } else if (modelCarAmount == 4) {
      percent = 68;
      background1 = '#1C2B3C'
      background2 = '#1C2B3C'
      background3 = '#1C2B3C'
      background4 = '#1C2B3C'
    } else if (modelCarAmount == 5) {
      percent = 85;
      background1 = '#1C2B3C'
      background2 = '#1C2B3C'
      background3 = '#1C2B3C'
      background4 = '#1C2B3C'
      background5 = '#1C2B3C'
    } else if (modelCarAmount == 6) {
      percent = 100;
      background1 = '#1C2B3C'
      background2 = '#1C2B3C'
      background3 = '#1C2B3C'
      background4 = '#1C2B3C'
      background5 = '#1C2B3C'
      background6 = '#1C2B3C'
    } else if (modelCarAmount == 7) {
      percent = 100;
      background1 = '#1C2B3C'
      background2 = '#1C2B3C'
      background3 = '#1C2B3C'
      background4 = '#1C2B3C'
      background5 = '#1C2B3C'
      background6 = '#1C2B3C'
      background7 = '#1C2B3C';
    } else {
      percent = 0;
    }
    that.setData({
      percent: percent,
      background1: background1,
      background2: background2,
      background3: background3,
      background4: background4,
      background5: background5,
      background6: background6,
      background7: background7,
    });

    console.log(options);
    if (options.modelCarCount) {
      that.setData({
        modelCarCount: options.modelCarCount
      });
    } else {
      url.ajaxPost(false, url.agent_info, { 'openId': app.globalData.openid }, function (data) {
        console.log("服务器返回:", data);
        that.setData({
          modelCarCount: data.result.modelCarCount
        });
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true,
    })
    var that = this;
    console.log('res', res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('button', res.target)
    }
    return {
      title: that.data.share_title,
      path: that.data.path, //+ "?id_=" + that.data.id_,
      imageUrl: that.data.shareImageUrl,
      success: function (res) {
        console.log('转发回掉', res);
        if (res.shareTickets != null) {
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: function (res) {
              console.log('data', res, app.globalData.session_key);

              url.ajaxPost(false, url.shareToGroup, {
                encryptedData: res.encryptedData,
                iv: res.iv,
                sessionKey: app.globalData.session_key,
                openId: app.globalData.openid,
              }, function (data) {
                console.log("群对当前小程序的唯一 ID:", data);
                if (data.result.modelCarAmount == 0) {
                  // util.showToast('3次已用完', 'error');
                } else {
                  util.showToast('获取' + data.result.modelCarAmount + '个车模', 'error');
                }
              });
            }
          })
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //发布车（任务）
  onFache: function () {
    wx.switchTab({
      url: '/pages/market/fache/fache',
    })
  },
  //评论（任务）
  onPinglun: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //分享朋友圈
  onSharePYQ: function () {
    wx.navigateTo({
      url: '/pages/my/poster/poster',
    })
  },
  //关注
  onFollow: function () {
    wx.navigateTo({
      url: '/pages/my/follow/follow',
    })
  },
  //每日签到
  onSignIn: function () {

    var that = this;
    url.ajaxPost(false, url.signIn, { openId: app.globalData.openid }, function (data) {
      console.log("签到回掉:", data);
      if (data.result.modelCarAmount == 0) {
        util.showToast("已签到", 'success');
      } else {
        var count = parseInt(that.data.modelCarCount) + parseInt(data.result.modelCarAmount);
        var background1 = that.data.background1;
        var background2 = that.data.background2;
        var background3 = that.data.background3;
        var background4 = that.data.background4;
        var background5 = that.data.background5;
        var background6 = that.data.background6;
        var background7 = that.data.background7;
        var percent = that.data.percent;
        if (count == 1) {
          background1 = '#1C2B3C';
          percent = 17;
        } else if (count == 2) {
          background2 = '#1C2B3C';
          percent = 34
        } else if (count == 3) {
          background3 = '#1C2B3C';
          percent = 51
        } else if (count == 4) {
          background4 = '#1C2B3C';
          percent = 68
        } else if (count == 5) {
          background5 = '#1C2B3C';
          percent = 85
        } else if (count == 6) {
          background6 = '#1C2B3C';
          percent = 100
        } else if (count == 7) {
          background7 = '#1C2B3C';
          percent = 100
        }
        that.setData({
          isSignIn: false,
          modelCarCount: count,
          modelCarAmount: data.result.modelCarAmount,
          background1: background1,
          background2: background2,
          background3: background3,
          background4: background4,
          background5: background5,
          background6: background6,
          background7: background7,
          percent: percent
        });
        wx.setStorageSync('modelCarAmount', data.result.modelCarAmount);
        wx.setStorageSync('modelCarAmountTime', util.toDate(new Date().getTime(), 'YMD'));
        util.showToast("签到成功", 'success');
      }

    });
  },
  //转发分享车源
  onShareVehicleSource: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})