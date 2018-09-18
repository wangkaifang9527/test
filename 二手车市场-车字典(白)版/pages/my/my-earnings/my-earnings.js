//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

var count = 0;//加载页
var size = 20;//每页加载条数
var post_list_url = url.agent_earnings

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: [],//渲染数据
        user: {
            money_all: 0,
        },
        money_all: 0,//历史收益
        isEmpty: true,//第一次为空
        isloading: false,//
        isloadover: false,//
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()//隐藏转发按钮
        var that = this;
        // ajax
        count = 0;
        that.setData({
          money_all: options.money
        })
       
        wx.request({
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
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
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
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
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
            that.callbackData(data);
          }
        })

    },

    //回调数据
    callbackData: function (data) {
        var that = this;
        var orders_data = [];
        console.log('推广收益列表:', data)
        if (data.data.resultCode != 1){
          that.setData({
            orders:"",
            isloadover: true
          });
          return 
        }
        wx.hideLoading();
        data.orders = data.data.result;
        if (data.orders.length == size) {
            // console.log('持续加载');
        } else {
            that.setData({
                isloadover: true
            });
            console.log('所有数据加载完毕');
        }
        if (data.orders.length > 0) {
            for (var i = 0; i < data.orders.length; i++) {
              data.orders[i].time_long = util.toDate(data.orders[i].createTime, 'YMDhms');
              var type = data.orders[i].payType;
              if(type==1010){
                data.orders[i].type = '4S'
              } else if (type == 1011) {
                data.orders[i].type = '维保'
              }else if(type==1020){
                data.orders[i].type = '理赔'
              }else if(type==1030){
                data.orders[i].type = '理赔'
              } else if (type == 1040 || type==1041) {
                data.orders[i].type = '保单'
              } else if (type == 1050) {
                data.orders[i].type = '状态'
              }
            
               
            }
        }
        if (!that.data.isEmpty) {
            // console.log('非第一次加载');
            orders_data = that.data.orders.concat(data.orders);//连接多个数组
        } else {
            console.log('初次加载');
            orders_data = data.orders;
            that.setData({
                isEmpty: false
            });
        }
        console.log('列表数据:', orders_data);
        //更新数据
        that.setData({
            orders: orders_data,
            isloading: false
        });
        wx.hideNavigationBarLoading() //隐藏导航条加载动画。

    },

})