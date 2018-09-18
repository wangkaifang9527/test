//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");


Page({

    /**
     * 页面的初始数据
     */
    data: {
      id:'',
      src:'',
      share_title:'保险理赔报告详情',
      share_path: 'pages/order/order-detail-claim2/order-detail',
      share: { imageUrl: '/images/icon/red-p-share.png' },
      order_claim2:'',

      open: false,//红包开关
      chai_open: false,//拆红包开关
      red_open: false,//红包消息
      red_title_open: false,//红包栏是否打开
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      var red_title_open = false
      if (wx.getStorageSync("order-title-red")) {
        red_title_open = true
      }
      that.setData({
        userInfo: app.globalData.userInfo,
        red_title_open: red_title_open
      })
      if (options.id) {
        that.setData({
          id: options.id
        })
        console.log("是否有用户信息", app.globalData.isGetUserInfo);
        if (!app.globalData.isGetUserInfo) {
          //获取用户登陆身份
          wx.showLoading({ title: "初始化", mask: true });
          app.getUserId(function (data) {
            // that.callBackgetUserId(data)
            wx.hideLoading()
            console.log('身份获取完毕');
            // 请求订单数据
            wx.request({
              url: url.order_detail2,
              data: { orderNo: options.id },
              success: function (data) {
                console.log('分享claim2订单:', data);
                if (data.data.resultCode == 1) {
                  var json = data.data.result.content;
                  var redEnvelopeId = data.data.result.redEnvelopeId;//红包ID
                  if (redEnvelopeId != undefined) {
                    that.setData({
                      redEnvelopeId: redEnvelopeId
                    })
                  }
                  that.callback(json);
                } else {
                  util.showToast(data.data.resultMsg, 'error');
                }
              }
            })
          });
        } else {
          // 请求订单数据
          wx.request({
            url: url.order_detail2,
            data: { orderNo: options.id },
            success: function (data) {
              console.log('分享claim2订单:', data);
              if (data.data.resultCode == 1) {
                var json = data.data.result.content;
                var redEnvelopeId = data.data.result.redEnvelopeId;//红包ID
                if (redEnvelopeId != undefined) {
                  that.setData({
                    redEnvelopeId: redEnvelopeId
                  })
                }
                that.callback(json);
              } else {
                util.showToast(data.data.resultMsg, 'error');
              }
            }
          })
        }
        return;
      }
      if (wx.getStorageSync('order_detail')) {
        var car_data = wx.getStorageSync('order_detail')
        console.log('缓存数据', car_data);
        that.setData({
          id: car_data.orderNo
        })
        wx.request({
          url: url.order_detail2,
          data: { orderNo: car_data.orderNo },
          success: function (data) {
            console.log('claim2订单:', data);
            if (data.data.resultCode == 1) {
              var json = data.data.result.content;
              var redEnvelopeId = data.data.result.redEnvelopeId;//红包ID
              if (redEnvelopeId != undefined) {
                that.setData({
                  redEnvelopeId: redEnvelopeId
                })
              }
              that.callback(json);
            } else {
              util.showToast(data.data.resultMsg, 'error');
            }
          }
        })
        return;
      }
    },

    //处理数据
    callback: function (car_data) {
      car_data = JSON.parse(car_data)
      this.setData({
        order_claim2: car_data
      })
    },
  

    /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true,
    })
    var that = this;
    var title = that.data.share_title;
    var path = that.data.share_path + '?id=' + that.data.id;
    var imageUrl = '';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res);
      if (res.target.id == 'red_pag') {
        var nickName = app.globalData.userInfo.nickName;
        if (nickName.length > 6) {
          nickName = nickName.substring(0, 6)
        }
        title = '@"' + nickName + '" 送您了3个现金红包，确实是TMD真的！';
        path = 'pages/index/index' + '?id=' + that.data.id;
        imageUrl = that.data.share.imageUrl;
        //红包ID
        if (that.data.redEnvelopeId != undefined && that.data.redEnvelopeId != '') {
          path = path + '&redEnvelopeId=' + that.data.redEnvelopeId
        }
      }
    }
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function (res) {
        console.log(res);
        //判断是不是群
        if (that.data.redEnvelopeId == undefined || that.data.redEnvelopeId == '') {
          console.log("没有红包")
        } else if (res.shareTickets != null) {
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: function (res) {
              console.log('data', res, app.globalData.session_key);
              url.ajaxPost(false, url.redEnvelope_forward, {
                encryptedData: res.encryptedData,
                iv: res.iv,
                sessionKey: app.globalData.session_key,
                openId: app.globalData.openid,
                envelopeId: that.data.redEnvelopeId,
              }, function (data) {
                console.log("群ID 红包:", data);
                if (data.result.amount != undefined && data.result.amount != '') {
                  that.setData({
                    open: !that.data.open,
                    amount: data.result.amount
                  })
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
    //返回首页
  fanhui: function () {
    wx.navigateTo({
      url: '/pages/query/query',
    })
  },

  //生成报告
  bindReport: function () {
    var car_data = wx.getStorageSync('order_detail')
    var report = "http://www.levau.com/query-mould/claim/claim_clz.html?orderNo=" + car_data.orderNo
    wx.setClipboardData({
      data: report,
      success: function (res) {
        util.showToast("复制成功", "success", 500)
      }
    });
  },

  //拆红包
  onChai: function () {
    var that = this
    that.setData({
      chai_open: true
    })
    setTimeout(function () {
      that.setData({
        red_open: true
      })
    }, 2000)
  },
  //打开红包
  openRed: function () {
    this.setData({
      open: true
    })
  },
  closeRed: function () {
    this.setData({
      open: false
    })
  },
  //前往账户余额
  onGoBalance: function () {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  //点击红包栏 (打开)
  onOpenRedTitle: function () {
    this.setData({
      red_title_open: !this.data.red_title_open,
    })
  },
  //点击红包栏（关闭）
  onCloseRedTitle: function () {
    this.setData({
      red_title_open: !this.data.red_title_open,
    })
  },
})