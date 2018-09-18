// pages/warrant/deal-order/deal-order.js
const app = getApp()
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
var count = 0;//加载页
var size = 20;//每页加载条数
var postUrl = url.vehicleTrade_tradeListOfBuyers
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],//渲染数据
    isEmpty: true,//第一次为空
    isloading: false,//
    isloadover: false,//
    title_show: false, // false:买家 true 卖家
    tab_show:0, //0.等待中 1.进行中 2.已完成 3.已关闭
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    console.log('下拉刷新');
    that.setData({
      isEmpty: true,//第一次为空
    })
    wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
    if (that.data.title_show) {
      postUrl = url.vehicleTrade_tradeListOfSellers
    }else {
      postUrl = url.vehicleTrade_tradeListOfBuyers
    }
    count = 0;//加载页
    that.getMMPostUrl(postUrl, count)
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
    if (that.data.title_show) {
      postUrl = url.vehicleTrade_tradeListOfSellers
    }
    that.getMMPostUrl(postUrl, count)
  },
  //回调数据
  callbackData: function (data) {
    wx.hideLoading();
    var that = this;
    var orders_data = [];
    if (data.resultCode != 1) {
      that.setData({
        isloadover: true
      });
      console.log('未初始化完或者非法进入');
      return;
    }
    var vehicleList = data.result.vehicleTradeList
    for (var i = 0; i < vehicleList.length; i++){
      vehicleList[i].createTime = util.toDate(vehicleList[i].createTime,'YMDhms');
    }
    if (vehicleList.length == size) {
      // console.log('持续加载');
    } else {
      that.setData({
        isloadover: true
      });
      console.log('所有数据加载完毕');
    }
    if (!that.data.isEmpty) {
      console.log('非第一次加载');
      orders_data = that.data.list.concat(vehicleList);//连接多个数组
    } else {
      console.log('初次加载');
      orders_data = vehicleList;
      that.setData({
        isEmpty: false
      });
    }
    console.log('列表数据:', vehicleList);
    //更新数据
    that.setData({
      list: orders_data,
      isloading: false
    });

    wx.hideNavigationBarLoading() //隐藏导航条加载动画。
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },


  //tab 切换
  onTab: function(e){
    var that = this
    that.setData({
      tab_show: e.currentTarget.dataset.i,
      isEmpty: true // 第一次加载
    })
    if (that.data.title_show) {
      postUrl = url.vehicleTrade_tradeListOfSellers
    }else{
      postUrl = url.vehicleTrade_tradeListOfBuyers
    }
    that.getMMPostUrl(postUrl, 0)

  },

  //买方
  onBuyer: function(){
    this.setData({
      title_show: false,
      isEmpty: true // 第一次加载
    });

    this.getMMPostUrl(url.vehicleTrade_tradeListOfBuyers,0)
  },
  //卖方
  onSeller: function () {
    this.setData({
      title_show: true,
      isEmpty: true // 第一次加载
    });
    this.getMMPostUrl(url.vehicleTrade_tradeListOfSellers, 0)
  },

  //拨打客服
  onTel: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认拨打客服电话:' + e.currentTarget.dataset.tel,
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel //仅为示例，并非真实的电话号码
          })
        }
      }
    })
  },

  //取消担保 (买家)
  onS1: function(e){
    var that = this
    var i = e.currentTarget.dataset.i
    var list = that.data.list
    wx.showModal({
      title: '提示',
      content: '确定取消担保?',
      success: function (res) {
       if(res.confirm){
         url.ajaxPost(false, url.vehicleTrade_cancel, {
           openId: app.globalData.openid,
           orderNo: list[i].orderNo
         }, function (data) {
           console.log("取消担保 (买家):", data);
           list.splice(i, 1)
           that.setData({
             list: list
           })
         });
       }
      }
    })
    
  },
  //申请退款 (买家)
  onS2: function (e) {

  },
  //确定完成 (买家)
  onS3: function (e) {
    var that = this
    var i = e.currentTarget.dataset.i
    var list = that.data.list
    wx.showModal({
      title: '提示',
      content: '确定完成?',
      success: function (res) {
        if (res.confirm) {
          url.ajaxPost(false, url.vehicleTrade_confirm, {
            openId: app.globalData.openid,
            orderNo: list[i].orderNo
          }, function (data) {
            console.log("确定完成 (买家):", data);
            list.splice(i, 1)
            that.setData({
              list: list
            })
          });
        }
      }
    })
  },
  //拒绝订单 (卖家)
  onS4: function (e) {
    var that = this
    var i = e.currentTarget.dataset.i
    var list = that.data.list
    wx.showModal({
      title: '提示',
      content: '确定拒绝订单吗?',
      success: function (res) {
        if (res.confirm) {
          url.ajaxPost(false, url.vehicleTrade_refuse, {
            openId: app.globalData.openid,
            orderNo: list[i].orderNo
          }, function (data) {
            console.log("拒绝订单 (卖家):", data);
            list.splice(i, 1)
            that.setData({
              list: list
            })
          });
        }
      }
    })
  },
  //付担保金 (卖家)
  onS5: function (e) {
    var that = this
    var i = e.currentTarget.dataset.i
    var list = that.data.list
    if (list[i].earnestMoney > app.globalData.balance){
      wx.showModal({
        title: '提示',
        content: '余额不足,是否去充值',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/memberopening/memberopening',
            })
          }
        }
      })
      return
    }else{
      wx.showModal({
        title: '提示',
        content: '确定支付担保金?',
        success: function (res) {
          if (res.confirm) {
            url.ajaxPost(false, url.vehicleTrade_payResponse, {
              openId: app.globalData.openid,
              orderNo: list[i].orderNo
            }, function (data) {
              console.log("付担保金 (卖家):", data);
              list.splice(i, 1)
              that.setData({
                list: list
              })
            });
          }
        }
      })
    }
    
  },




  getMMPostUrl: function (postUrl, count){
    var that = this
    url.ajaxPost(false, postUrl, {
      openId: app.globalData.openid,
      status: that.data.tab_show,
      start: count,
    }, function (data) {
      console.log("订单列表:", data);
      wx.stopPullDownRefresh() //停止当前页面的下拉刷新。
      that.callbackData(data);
    });
  }
  
})