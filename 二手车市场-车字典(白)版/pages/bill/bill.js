//获取应用实例
var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");

var count = 0;//加载页
var size = 20;//每页加载条数
var post_list_url = '';
var userstatus='';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        isEmpty: true,//第一次为空
        isloading: false,//
        isloadover: false,//
        balance:0,
        withdrawAbleBalance: 0,
        frozenBalance:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
          balance: options.balance,
          withdrawAbleBalance: options.withdrawAbleBalance,
          frozenBalance: options.frozenBalance,
        });
        wx.hideShareMenu()//隐藏转发按钮
        console.log("提现记录type:",options.userstatus);
        switch (options.userstatus) {
            
            case 'agent':
                post_list_url = url.agent_bill
                userstatus ='agent'
                break;
            case 'admin':
                post_list_url = url.admin_bill
                userstatus = 'admin'
                break;
        }
        var that = this;
        //ajax
        count = 0;
        wx.showLoading({ title: "提交中" });
      
        wx.request({
          //url: "http://localhost:8080/guohubao/v1/chewu/pay/atm/list",
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
            console.log("list", data);
            that.callbackData(data);
          }
        })
    },

    // 下拉刷新
    onPullDownRefresh: function () {
        console.log('下拉刷新');
        wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
        var that = this;
        this.setData({
            isloading: true,
            isloadover: false,
            isEmpty: true,
        });
        count = 0;//加载页
       
        wx.request({
          //url: "http://localhost:8080/guohubao/v1/chewu/pay/atm/list",
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
            console.log("list", data);
            wx.stopPullDownRefresh() //停止当前页面的下拉刷新。
            that.callbackData(data);
          }
        })
    },

    // 加载更多
    onReachBottom: function () {
        console.log('加载更多');

        var that = this;
        if (this.data.isloadover) {
            return false;
        }
        count++;
      
        wx.request({
          //url: "http://localhost:8080/guohubao/v1/chewu/pay/atm/list",
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
            console.log("list", data);
            that.callbackData(data);
          }
        })

    },

    //回调数据
    callbackData: function (data) {
        var that = this;
        var datas = [];
        console.log('data:', data)
        wx.hideLoading();
        data.list = data.data.result.withdrawList;
        if (data.list.length == size) {
            // console.log('持续加载');
        } else {
            that.setData({
                isloadover: true
            });
            console.log('所有数据加载完毕');
        }
        if (data.list.length > 0) {
            for (var i = 0; i < data.list.length; i++) {
              data.list[i].time_long = util.toDate(data.list[i].applyTime, 'YMDhms');
              
              if(data.list[i].status == 1){
                data.list[i].status_str = '提现成功'
              } else if (data.list[i].status == -1){
                data.list[i].status_str = '提现失败'
              } else if (data.list[i].status == 0) {
                data.list[i].status_str = ''
              }
              
            }
        }
        if (!that.data.isEmpty) {
            // console.log('非第一次加载');
            datas = that.data.list.concat(data.list);//连接多个数组
        } else {
            // console.log('初次加载');
            datas = data.list;
            that.setData({
                isEmpty: false
            });
        }
        console.log('列表数据:', datas);
        //更新数据
        that.setData({
            list: datas,
            isloading: false
        });
        wx.hideNavigationBarLoading() //隐藏导航条加载动画。

    },
    //提现
    onWithdraw: function (e) {
      var that = this;
      wx.navigateTo({
        url: '/pages/withdraw/withdraw?balance=' + that.data.withdrawAbleBalance,
      })
    },
    //充值
    onChongZhi:function(){
      wx.navigateTo({
        url: '/pages/my/memberopening/memberopening',
      })
    }
})