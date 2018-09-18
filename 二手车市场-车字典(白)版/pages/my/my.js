//获取应用实例
var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ismember: 0, //0 开通会员 ，1我的会员
    flag: false,//不显示
    expiretime: '',//到期时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()//隐藏转发按钮
    var that = this
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    url.ajaxPost(false, url.agent_info, {
      openId: app.globalData.openid,
    }, function (data) {
      console.log("个人主页:", data);
      var user = data.result;
      var ismember = 0;
      if (user.cardId) {
        ismember = user.cardId
      }
      var expiretime = 0;
      if (user.expiredTime) {
        expiretime = util.toDate(user.expiredTime, 'YMDhms');
      }
      user.totalIncome = user.totalIncome.toFixed(2)
      that.setData({
        isadmin: app.globalData.isadmin,
        ismember: ismember,
        user: user,
        expiretime: expiretime,
      });
      wx.setStorageSync("user", user)
    });
  },

  
  //提现记录
  onWithdrawLog: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/bill/bill?userstatus=agent&balance=' + that.data.user.balance + '&withdrawAbleBalance=' + that.data.user.withdrawAbleBalance + '&frozenBalance=' + that.data.user.frozenBalance,
    })
  },
  //我的会员
  wodehuiyuan: function () {
    var that = this;
    if (that.data.ismember == 0) {
      wx.navigateTo({
        url: '/pages/my/memberopening/memberopening',
      })
    } else {
      wx.navigateTo({
        url: '/pages/my/mymember/mymember?ismember=' + that.data.ismember + '&expiretime=' + that.data.expiretime,
      })
    }
  },
  //我的订单
  wodedingdan: function () {
    wx.navigateTo({
      url: '/pages/order/order-list/order-list',
    })
  },
  //我的发布
  wodefabu: function () {
    wx.navigateTo({
      url: '/pages/my/my-homepage/my-homepage',
    })
  },
  //市场收藏
  shichangshoucang: function () {
    wx.navigateTo({
      url: '/pages/my/my-collection/my-collection',
    })
  },
  //我的车模
  onGirls: function () {
    wx.navigateTo({
      url: '/pages/my/task/task?modelCarCount=' + this.data.user.modelCarCount,
    })
  },
  //交易订单
  onDealOrder: function(){
    wx.navigateTo({
      url: '/pages/warrant/deal-order/deal-order',
    })
  },
  //前往发车
  onFache: function () {
    wx.switchTab({
      url: '/pages/market/fache/fache',
    })
  },
  //我要推广
  onMyPromotion: function () {
    var that = this;
    console.log(wx.getStorageSync('isphone'), that.data.user.promoteStatus);
    if (wx.getStorageSync('isphone')) {//数据库里有手机号 则不显示
      that.setData({
        flag: false,
      });

      if (that.data.user.promoteStatus == 0) {
        wx.navigateTo({
          url: 'apply-tg/apply-tg',
        })
      } else if (that.data.user.promoteStatus == 1) {
        util.showToast('推广申请中', 'loading');
      } else if (that.data.user.promoteStatus == 2) {
        wx.navigateTo({
          url: '/pages/my/my-qr/my-qr',
        })
      } else if (that.data.user.promoteStatus == 3) {
        wx.navigateTo({
          url: 'apply-tg/apply-tg',
        })
      }

    } else {
      that.setData({//数据库里没有手机号 则显示
        flag: true,
      })
    }

  },
  //联系客服
  onPhoneCall: function (e) {
    wx.navigateTo({
      url: "/pages/my/kefu/kefu",
    })
  },
  //合作招商
  onCooperation: function(){
    wx.navigateTo({
      url: "/pages/my/cooperation/cooperation",
    })
  },

  //二级代理
  erjidaili: function () {
    var that = this;
    if (wx.getStorageSync('isphone')) {//数据库里有手机号 则不显示
      that.setData({
        flag: false,
      });

      if (that.data.user.promoteStatus == 0) {
        wx.navigateTo({
          url: 'apply-tg/apply-tg',
        })
      } else if (that.data.user.promoteStatus == 1) {
        util.showToast('推广申请中', 'loading');
      } else if (that.data.user.promoteStatus == 2) {
        wx.navigateTo({
          url: "my-er/my-er",
        })
      } else if (that.data.user.promoteStatus == 3) {
        wx.navigateTo({
          url: 'apply-tg/apply-tg',
        })
      }

    } else {
      that.setData({//数据库里没有手机号 则显示
        flag: true,
      })
    }
  },

  //一级代理
  yijidaili: function () {
    wx.navigateTo({
      url: "/pages/my/my-yi/my-yi",
    })
  },
  //后台管理
  onHrefMGR: function (e) {
    wx.navigateTo({
      url: '/pages/admin/admin?balance=' + this.data.user.balance + '&withdrawAbleBalance=' + this.data.user.withdrawAbleBalance  + '&frozenBalance=' + this.data.user.frozenBalance,
    })
  },

  getPhoneNumber: function (e) {
    var that = this;
    that.setData({ flag: false })
    console.log(e.detail.errMsg)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:fail:cancel to confirm login') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {

        }
      })
    } else {

      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) {
        
          wx.setStorageSync('isphone', true)//本地存是否有手机号信息
          wx.request({
            url: url.phone,
            data: {
              'encryptedData': e.detail.encryptedData,
              'iv': e.detail.iv,
              'sessionKey': app.globalData.session_key,
              'openId': app.globalData.openid,
              //'location': app.globalData.location
            },
            success: function (data) {
              console.log('获取手机号', data);
            }
          })
        }
      })
    }
  },
})