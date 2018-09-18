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
    share_path: 'pages/order/order-detail-cbstl/order-detail',
    share: { imageUrl: '/images/icon/red-p-share.png' },
    tl_old:true,//图灵老接口
    open: false,//红包开关
    chai_open: false,//拆红包开关
    red_open:false,//红包消息

    red_title_open: false,//红包栏是否打开
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
          console.log('图灵维保订单:', data);
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
    //car_data = JSON.parse(car_data);
    var car = car_data.taskData
    var tl_old = true
    var result_detail = ''
    var car_detail = ''
    if (car.itemData.length!=3){
      tl_old = false;
      for (var i = 0; i < car.itemData.length; i++){
        if (car.itemData[i].set && car.itemData[i].itemPropLabel == "结果详情"){
          result_detail = car.itemData[i]
          car.itemData.splice(i,1);
        }
        if (car.itemData[i].set && car.itemData[i].itemPropLabel == "车辆信息"){
          car_detail = car.itemData[i]
          car.itemData.splice(i, 1);
        }
      }
    }
    this.setData({
      car: car,
      tl_old: tl_old,
      car_detail: car_detail,
      result_detail: result_detail,
    })
    console.log(this.data.result_detail);
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // console.log('show', options.id);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    // wx.showShareMenu({
    //   withShareTicket: true,
    // })
    var that = this;
    var title = that.data.share_title;
    var path = that.data.share_path;
    var imageUrl = '';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res);
      if(res.target.id == 'red_pag'){
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
        console.log(res);

        // if (res.shareTickets != null) {
        //   wx.getShareInfo({
        //     shareTicket: res.shareTickets[0],
        //     success: function (res) {
        //       console.log('data', res, app.globalData.session_key);

        //       url.ajaxPost(false, url.shareToGroup, {
        //         encryptedData: res.encryptedData,
        //         iv: res.iv,
        //         sessionKey: app.globalData.session_key,
        //         openId: app.globalData.openid,
        //       }, function (data) {
        //         console.log("群对当前小程序的唯一 ID:", data);
        //         if (data.result.modelCarAmount == 0) {
        //           // util.showToast('3次已用完', 'error');
        //         } else {
        //           util.showToast('获取' + data.result.modelCarAmount + '个车模', 'error');
        //         }
        //       });
        //     }
        //   })
        // }

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
    var report = "http://www.levau.com/query-mould/maintain/4S_tl.html?orderNo=" + car_data.orderNo
    wx.setClipboardData({
      data: report,
      success: function (res) {
        util.showToast("复制成功", "success", 500)
      }
    });
  },
  bindReport_new: function () {
    var car_data = wx.getStorageSync('order_detail')
    var report = "http://www.levau.com/query-mould/maintain/4S_tl_new.html?orderNo=" + car_data.orderNo
    wx.setClipboardData({
      data: report,
      success: function (res) {
        util.showToast("复制成功", "success", 500)
      }
    });
  },

  //拆红包
  onChai: function(){
    var that = this
    that.setData({
      chai_open:true
    })
    setTimeout(function(){
      that.setData({
        red_open: true
      })
    },2000)
  },
  //打开红包
  openRed: function(){
    this.setData({
      open:!this.data.open
    })
  },
  closeRed: function(){
    this.setData({
      open: !this.data.open
    })
  },
  //前往账户余额
  onGoBalance:function(){
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  //点击红包栏 (打开)
  onOpenRedTitle: function(){
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