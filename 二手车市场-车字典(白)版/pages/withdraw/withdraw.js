//获取应用实例
var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");
var post_withdraw_url = url.withdrawal;
var type = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {},
        money:'',
        chongfudianji:false,
        balance:0,
        flag:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if (options.balance){
        this.setData({
          balance: options.balance,
        })
      }
        console.log('options', options);
        wx.hideShareMenu()//隐藏转发按钮
        type = (options.id == "admin") ? 'admin' : 'agent';
        var user = wx.getStorageSync("user");
        this.setData({
          user: user,
        })
    },

  
    //提现
    submitWithdraw: function (e) {
        var that = this;
        var chongfudianji = that.data.chongfudianji;
        if (chongfudianji){
          util.showToast('重复提交', 'error')
          wx.showLoading({
            title: "提交中"
          });
          return ;
        }
        if (wx.getStorageSync('isphone')) {//数据库里有手机号 则不显示
          that.setData({
            flag: false,
          });
        } else {
          that.setData({//数据库里没有手机号 则显示
            flag: true,
          })
          return;
        }

        
        var post_data = e.detail.value;
        post_data.money = parseFloat(post_data.money);
        console.log('post_data.money:', post_data.money, 'this.', that.data.balance);

        if (isNaN(post_data.money)) {
            util.showToast('金额有误', 'error')
            return;
        }
        if (post_data.money > that.data.balance) {
            util.showToast('超过提现额度', 'error')
            return;
        }
        if (post_data.money < 1.1) {
            util.showToast('至少提现1.1元', 'error')
            return;
        }
        if (type == 'admin') {
            post_data.type = 'admin'
        }
        console.log(post_data)
        wx.showModal({
            title: '提示',
            content: '提现微信将收取提现金额的1%为手续费，是否继续提现',
            success: function (res) {
                if (res.confirm) {
                    that.setData({
                      chongfudianji: true
                    })
                    wx.showLoading({
                      title: "提交中",
                      mask:true
                    });
                    url.ajaxPost(false, post_withdraw_url, {
                      'amount': post_data.money,
                      'openId': app.globalData.openid,
                      'nickname': that.data.user.nickName,
                    }, function (data) {
                      console.log("服务器回掉:", data);
                      wx.hideLoading()
                      if (data.resultCode==1) {
                        wx.showModal({
                            title: '提示',
                            content: '提现申请中，等待管理员审核',
                            success: function (res) {
                                wx.navigateBack({
                                    delta: 2
                                })
                            }
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: data.resultMsg,
                          success: function (res) {
                            wx.navigateBack({
                              delta: 2
                            })
                          }
                        })
                      }

                    });
                    // wx.request({
                    //   url: post_withdraw_url,
                    //   data: { 
                    //     'amount': post_data.money, 
                    //     'openId': app.globalData.openid,
                    //     'nickname': that.data.user.nickName,
                    //     },
                    //   success:function(data){
                    //     console.log(data);
                    //     wx.hideLoading()
                    //     if (data.data.resultCode==1) {
                    //         wx.showModal({
                    //             title: '提示',
                    //             content: '提现成功',
                    //             success: function (res) {
                    //                 wx.navigateBack({
                    //                     delta: 2
                    //                 })
                    //             }
                    //         })
                    //     } else {
                    //       //util.showToast(data.data.resultMsg, 'error')
                    //       wx.showModal({
                    //         title: '提示',
                    //         content: data.data.resultMsg,
                    //         success: function (res) {
                    //           wx.navigateBack({
                    //             delta: 2
                    //           })
                    //         }
                    //       })
                    //     }
                    //   }
                    // })
                  
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
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
            wx.navigateTo({
              url: "../my/my-rankings/my-rankings",
            });
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