//获取应用实例
var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},//渲染数据
    balance: '',
    agent: '',
    agent_apply: '',
    order: '',
    withdrawCount: '',

    withdrawAbleBalance: 0,
    frozenBalance: 0,
    promoterCountToAudit: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()//隐藏转发按钮
    console.log(options);
    var that = this;
    that.setData({
      balance: options.balance,
      withdrawAbleBalance: options.withdrawAbleBalance,
      frozenBalance: options.frozenBalance,
    })

  },

 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: url.admin_info,
      data: { openId: app.globalData.openid },
      success: function (data) {
        console.log("管理员信息", data);
        if (data.data.resultCode == 1) {
          that.setData({
            agent: data.data.result.summary.agentsCount,
            agent_apply: data.data.result.summary.agentsCountToAudit,
            order: data.data.result.summary.orderCount,
            withdrawCount: data.data.result.summary.withdrawCount,
            promoterCountToAudit: data.data.result.summary.promoterCountToAudit,
          })
        }
      }
    })
  },


  //提现
  onWithdraw: function () {
    wx.navigateTo({
      url: '/pages/withdraw/withdraw?balance=' + this.data.withdrawAbleBalance + '&id=admin',
    })
  },
  //资金明细
  onBill: function () {
    wx.navigateTo({
      url: '/pages/bill/bill?userstatus=admin&balance=' + this.data.balance + '&withdrawAbleBalance=' + this.data.withdrawAbleBalance + '&frozenBalance=' + this.data.frozenBalance,
    })
  },
  //提现审核
  onWithdrawAudit: function () {
    wx.navigateTo({
      url: 'withdraw-audit/withdraw-audit',
    })
  },
  //推广人审核
  onPromotersAudit: function () {
    wx.navigateTo({
      url: '/pages/admin/promoters-audit/promoters-audit',
    })
  },
  //推广人
  onPromoters: function () {
    wx.navigateTo({
      url: '/pages/admin/promoters/promoters',
    })
  },
  //代理商审核
  onAgentAudit: function () {
    wx.navigateTo({
      url: 'agent-audit/agent-audit',
    })
  },
  //代理商
  onAgent: function () {
    wx.navigateTo({
      url: 'agent-list/agent-list',
    })
  },
  //订单管理
  onHrefOrder: function () {
    wx.navigateTo({
      url: "../order/order-list-admin/order-list",
    })
  },
  //数据统计
  onHrefOrderDetails: function () {
    wx.navigateTo({
      url: "data-statistics/data-statistics",
    })
  },

})