// pages/my/my-rankings/my-rankings.js
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
var postUrl = url.rankings;
var count = 0;//加载页
var size = 50;//
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title_flag:false,
    path: 'pages/my/my-rankings/my-rankings',
    orders:[],
    isEmpty: true,//第一次为空
    isloading: false,//
    isloadover: false,//
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openid = app.globalData.openid;
    if (options.openid) {
      if (!app.globalData.isGetUserInfo) {
        app.getUserId(function (data) {
          wx.hideLoading()
          console.log('身份获取完毕');
        })
      }
      openid = options.openid
    }

    that.setData({
      orders: [],//渲染数据
      isEmpty: true,//第一次为空
      isloading: false,//
      isloadover: false,//
    })
    count = 0;
    wx.showLoading({ title: "提交中" });
    url.ajaxPost(false, postUrl, {
      openId: openid,
      start: count, 
    }, function (data) {
      console.log("服务器:", data);
      that.callbackData(data);
    });

  },

  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (this.data.isloadover) {
      return false;
    }
    count = count +1;
    url.ajaxPost(false, postUrl, {
      openId: app.globalData.openid,
      start: count,
    }, function (data) {
      console.log("服务器:", data);
      that.callbackData(data);
    });
  },

  //回调数据
  callbackData: function (data) {
    console.log('回掉data:', data)
    var that = this;
    var orders_data = [];
    data.orders = data.result.rankingList;
    wx.hideLoading();
    if (data.resultCode != 1) {
      that.setData({
        isloadover: true
      });
      console.log('未初始化完或者非法进入');
      return;
    }

    if (data.orders.length == size) {
      // console.log('持续加载');
    } else {
      that.setData({
        isloadover: true
      });
      console.log('所有数据加载完毕');
    }

    if (data.result.myRanking != 0) {
      var fu = data.result.myRanking.lastRanking - data.result.myRanking.currentRanking;
      data.result.myRanking.risefall = fu;
      data.result.myRanking.rise_fall = fu;
      if (fu < 0) {
        data.result.myRanking.rise_fall = data.result.myRanking.currentRanking - data.result.myRanking.lastRanking;
      }
    }

    for (var i = 0; i < data.orders.length; i++) {
      var fudong = data.orders[i].lastRanking - data.orders[i].currentRanking;
      data.orders[i].risefall = fudong;
      data.orders[i].rise_fall = fudong;
      if (data.orders[i].rise_fall < 0) {
        data.orders[i].rise_fall = data.orders[i].currentRanking - data.orders[i].lastRanking
      }

    }


    if (!that.data.isEmpty) {
      // console.log('非第一次加载');
      orders_data = that.data.orders.concat(data.orders);//连接多个数组;
      console.log('总个数', orders_data.length);
      if (orders_data.length >= 150) {
        that.setData({
          isloadover: true
        });
        console.log('所有数据加载完毕');
      }
    } else {
      // console.log('初次加载');
      orders_data = data.orders;
      that.setData({
        isEmpty: false
      });
    }
    console.log('列表数据:', orders_data);
    //更新数据
    that.setData({
      orders: orders_data,
      isloading: false,
      maxQueryUser: data.result.maxQueryUser,
      myRanking: data.result.myRanking,
    });

    wx.hideNavigationBarLoading() //隐藏导航条加载动画。
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    console.log('res', res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('button', res.target)
    }
    return {
      title: '排行榜',
      path: that.data.path + '?openid=' + that.data.openid,
      // imageUrl: that.data.share.imageUrl,
      success: function (res) {
        console.log(app.globalData.openid);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  
  //定损免费排行榜
  onDS: function(){
    util.showToast("开发中...", 'error');
  }

})