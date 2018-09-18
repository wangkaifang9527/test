//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    car: {},
    share_title: '4S保养报告详情',
    share_path: 'pages/order/order-detail-cbs2/order-detail',
    share:{imageUrl:'/images/icon/red-p-share.png'}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
          wx.request({
            url: url.order_detail,
            data: { orderNo: options.id },
            success: function (data) {
              console.log('分享订单:', data);
              if (data.data.resultCode == 1) {
                var json = data.data.result;
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
          url: url.order_detail,
          data: { orderNo: options.id },
          success: function (data) {
            console.log('分享订单:', data);
            if (data.data.resultCode == 1) {
              var json = data.data.result;
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
        url: url.order_detail,
        data: { orderNo: car_data.orderNo },
        success: function (data) {
          console.log('芜湖维保订单:', data);
          if (data.data.resultCode == 1) {
            var json = data.data.result;
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
    console.log(car_data);
    if (car_data.normalrepairrecords) {
      for (var i = 0; i < car_data.normalrepairrecords.length; i++) {
        if (car_data.normalrepairrecords[i].cailiao == null || car_data.normalrepairrecords[i].cailiao == "" ) {
          car_data.normalrepairrecords[i].cailiao = "-"
        }
        if (car_data.normalrepairrecords[i].other == null || car_data.normalrepairrecords[i].other == "") {
          car_data.normalrepairrecords[i].other = "-"
        }
        if (car_data.normalrepairrecords[i].remark == null) {
          car_data.normalrepairrecords[i].remark = "-"
        }
      }
    }
    this.setData({
      car: car_data
    })
  },

 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    var title = that.data.share_title;
    var path = that.data.share_path;
    var imageUrl = '';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
      console.log(res);
      if (res.target.id == 'red_pag') {
        var nickName = app.globalData.userInfo.nickName;
        if (nickName.length > 6) {
          nickName = nickName.substring(0, 6)
        }
        title = '@"' + nickName + '" 送您了3个现金红包，确实是TMD真的！';
        path = 'pages/index/index';
        imageUrl = that.data.share.imageUrl
      }
    }
    return {
      title: title,
      path: path + '?id=' + that.data.id,
      imageUrl: imageUrl,
      success: function (res) {
        console.log(app.globalData.openid);
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

  bindReport: function () {
    var car_data = wx.getStorageSync('order_detail')
    var report = "http://www.levau.com/query-mould/maintain/4S_wh.html?orderNo=" + car_data.orderNo
    wx.setClipboardData({
      data: report,
      success: function (res) {
        util.showToast("复制成功", "success", 500)
      }
    });
  },
})