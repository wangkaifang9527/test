// pages/my/my-fans/my-fans.js
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
var count = 0;//加载页
var size = 20;//每页加载条数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: true,//第一次为空
    isloading: false,//
    isloadover: false,//
    fans_list:[
     
    ],
    openId:'',
    ziji:true,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()//隐藏转发按钮
    var that = this;
    var openId = app.globalData.openid;
    that.setData({
      orders: [],//渲染数据
      isEmpty: true,//第一次为空
      isloading: false,//
      isloadover: false,//
      openId : app.globalData.openid,
    });
    
    if (options.targetOpenId){
      that.setData({
        openId: options.targetOpenId,
        ziji:false,
      });
    }
    //ajax
    count = 0;
    wx.showLoading({ title: "提交中" });
    url.ajaxPost(false, url.fansList, {
      openId: that.data.openId,
      start: count,
    }, function (data) {
      console.log("粉丝列表:", data);
      that.callbackData(data);
      
    });
  },

 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    console.log('下拉刷新');
    wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
    this.setData({
      isloading: true,
      isloadover: false,
      isEmpty: true,
    });
    count = 0;//加载页
    url.ajaxPost(false, url.fansList, {
      openId: that.data.openId,
      start: count,
    }, function (data) {
      console.log("粉丝列表:", data);
      wx.stopPullDownRefresh() //停止当前页面的下拉刷新。
      that.callbackData(data);

    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('加载更多');
    var that = this;
    if (this.data.isloadover) {
      return false;
    }
    count++;
    url.ajaxPost(false, url.fansList, {
      openId: that.data.openId,
      start: count,
    }, function (data) {
      console.log("粉丝列表:", data);
      that.callbackData(data);

    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  //点击头像进入个人主页
  zhuye: function (e) {
    console.log(app.globalData.openid, e.currentTarget.dataset.openid, app.globalData.openid == e.currentTarget.dataset.openid);
    if (app.globalData.openid == e.currentTarget.dataset.openid) {
      wx.navigateTo({
        url: '/pages/my/my-homepage/my-homepage',
      })
    } else {
      wx.navigateTo({
        url: '/pages/my/his-homepage/his-homepage?targetOpenId=' + e.currentTarget.dataset.openid,
      })
    }
  },
  //回掉处理
  callbackData:function(data){
    var that =this;
    var orders_data = [];
    if (data.result.fansList.length == size) {
      // console.log('持续加载');
    } else {
      that.setData({
        isloadover: true
      });
      console.log('所有数据加载完毕');
    }
    if (!that.data.isEmpty) {
      // console.log('非第一次加载');
      orders_data = that.data.fans_list.concat(data.result.fansList);//连接多个数组
    } else {
      // console.log('初次加载');
      orders_data = data.result.fansList;
      that.setData({
        isEmpty: false
      });
    }
    console.log('列表数据:', orders_data);
    //更新数据
    that.setData({
      fans_list: orders_data,
      isloading: false
    });
    wx.hideLoading();
    wx.hideNavigationBarLoading() //隐藏导航条加载动画。
  },

  //关注
  guanzhu:function(e){
    console.log(e);
    var that = this;
    var fans_list = that.data.fans_list;
    if (e.currentTarget.dataset.relationship == 3){
      //取消关注
      url.ajaxPost(false, url.cancelFocus, {
        openId: app.globalData.openid,
        targetOpenId: fans_list[e.currentTarget.dataset.i].openId,
      }, function (data) {
        console.log("取消关注回掉:", data, app.globalData.userInfo);
        fans_list[e.currentTarget.dataset.i].relationship = 1;
        util.showToast('取消关注', 'success')
        that.setData({
          fans_list: fans_list
        });
      })
      
      
    }else{
      //关注
      url.ajaxPost(false, url.focus, {
        openId: app.globalData.openid,
        targetOpenId: fans_list[e.currentTarget.dataset.i].openId,
      }, function (data) {
        console.log("关注回掉:", data, app.globalData.userInfo);
        fans_list[e.currentTarget.dataset.i].relationship = 3;
        util.showToast('成功关注', 'success')
        that.setData({
          fans_list: fans_list
        });
      })
      
    }
  },
})