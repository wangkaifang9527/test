// pages/my/my-collection/my-collection.js
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
    list: [],
    isEmpty: true,//第一次为空
    isloading: false,//
    isloadover: false,//

    tuwen_url: '/images/chonggou/shichang/tuwenbai.png',
    change_flag:true,
    path: 'pages/market/details/details',//分享的页面路径
    focus: false,
    hidden: true,
    pinglun_value: '',
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //wx.hideShareMenu()//隐藏转发按钮
    that.setData({
      orders: [],//渲染数据
      isEmpty: true,//第一次为空
      isloading: false,//
      isloadover: false,//
    })
    count = 0;
    wx.showLoading({ title: "提交中" });
    url.ajaxGet(false, url.favorite_vehicleList, {
      openId: app.globalData.openid,
      location: app.globalData.location,
      start: count
    }, function (data) {
      console.log("个人的主页:", data);
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
    url.ajaxGet(false, url.favorite_vehicleList, {
      openId: app.globalData.openid,
      targetOpenId: that.data.targetOpenId,
      location: app.globalData.location,
      start: count
    }, function (data) {
      console.log("个人的主页:", data);
      wx.stopPullDownRefresh() //停止当前页面的下拉刷新。
      that.callbackData(data);
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (this.data.isloadover) {
      return false;
    }
    count++;
    url.ajaxGet(false, url.favorite_vehicleList, {
      openId: app.globalData.openid,
      targetOpenId: that.data.targetOpenId,
      location: app.globalData.location,
      start: count
    }, function (data) {
      console.log("个人的主页:", data);
      that.callbackData(data);
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    console.log('res', res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('button', res.target)
    }
    return {
      title: '车辆详细信息',
      path: that.data.path + "?id_=" + res.target.dataset.id,
      // imageUrl: that.data.share.imageUrl,
      success: function (res) {
        console.log(app.globalData.openid);
      },
      fail: function (res) {
        // 转发失败
      }
    }
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
    var vehicleList = data.result.vehicleList;
    console.log(vehicleList.length);
    for (var i = 0; i < vehicleList.length; i++) {
      vehicleList[i].createTime = util.toDate(vehicleList[i].createTime, 'hm');
      for (var j = 0; j < vehicleList[i].images.length; j++) {
        vehicleList[i].images[j] = url.qiniu + vehicleList[i].images[j] + url.qiniu_compress
      }
      vehicleList[i].adShow = true;// 插入广告
      vehicleList[i].location = vehicleList[i].location.split(',')[1];
      if (vehicleList[i].type != '' && vehicleList[i].type != null) {
        vehicleList[i].xz = [];
        var xx = vehicleList[i].type.split(',');
        for (var j = 0; j < xx.length; j++) {
          vehicleList[i].xz.push(xx[j]);
        }
        // vehicleList[i].xz.push(vehicleList[i].type.split(',')[0]);
        // vehicleList[i].xz.push(vehicleList[i].type.split(',')[1]);
      }
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
      isloading: false,
      //userInfo: data.result.userInfo,
    });

    wx.hideNavigationBarLoading() //隐藏导航条加载动画。
  },

  //图文列表
  tuwen: function () {
    var that = this;
    var change_flag = that.data.change_flag;
    if (change_flag) {
      that.setData({
        change_flag: false,
        tuwen_url: '/images/chonggou/shichang/jiugonggebai.png',
      });
    } else {
      that.setData({
        change_flag: true,
        tuwen_url: '/images/chonggou/shichang/tuwenbai.png',
      });
    }

  },
  //评论失焦事件
  bindblur: function () {
    var that = this;
    that.setData({
      focus: false,
      hidden: true,
      pinglun_value: '',
    });
  },
  //发送评论
  bindconfirm: function () {
    var that = this;
    that.setData({
      focus: false,
      hidden: true,
    });
    var content = that.data.pinglun_value;
    if (content == '') {
      util.showToast('评论不能为空', 'success');
      return;
    }
    //评论
    url.ajaxPost(false, url.comment_comment, {
      openId: app.globalData.openid,
      vehicleId: that.data.vehicleId,
      content: that.data.pinglun_value
    }, function (data) {
      console.log("评论回调:", data, app.globalData.userInfo);
      var userInfo = app.globalData.userInfo;
      var pin = {
        'avatarUrl': userInfo.avatarUrl,
        'nickName': userInfo.nickName,
        'content': content,
        'commentTime': util.toDate(new Date().getTime(), 'YMDhms'),
      };
      var contents = [];
      contents.push(pin);
      var list = that.data.list;
      var comments = list[that.data.i].comments;
      for (var i = 0; i < comments.length; i++) {
        contents.push(comments[i]);
      }
      list[that.data.i].comments = contents;
      list[that.data.i].commentCount = list[that.data.i].commentCount + 1;
      that.setData({
        list: list,
        pinglun_value: '',
      })

    });

  },
  bindinput: function (e) {
    console.log(e.detail.value);
    this.setData({
      pinglun_value: e.detail.value
    });
  },

  //评论
  pinglun: function (e) {
    var that = this;
    that.setData({
      focus: true,
      hidden: false,
      vehicleId: e.currentTarget.dataset.vehicleid,
      i: e.currentTarget.dataset.i,
    });

  },
  //评论区
  pinglunqu: function (e) {
    var that = this;
    that.setData({
      focus: true,
      hidden: false,
      vehicleId: e.currentTarget.dataset.vehicleid,
      i: e.currentTarget.dataset.i,
    });
  },

  //收藏
  shoucang: function (e) {
    console.log(e);
    var that = this;
    var list = that.data.list;
    console.log('车辆的ID', list[e.currentTarget.dataset.i].id);
    if (list[e.currentTarget.dataset.i].favorite) {
      //取消收藏
      url.ajaxPost(false, url.favorite_remove, {
        openId: app.globalData.openid,
        vehicleId: list[e.currentTarget.dataset.i].id,
      }, function (data) {
        console.log("取消收藏返回:", data);
        util.showToast('取消收藏', 'success');
        list[e.currentTarget.dataset.i].favorite = false;
        list[e.currentTarget.dataset.i].collectCount = list[e.currentTarget.dataset.i].collectCount - 1;
        that.setData({
          list: list
        });
      });

    } else {
      //收藏车辆
      url.ajaxPost(false, url.favorite_collect, {
        openId: app.globalData.openid,
        vehicleId: list[e.currentTarget.dataset.i].id,
      }, function (data) {
        console.log("收藏车辆返回:", data);
        util.showToast('已收藏', 'success');
        list[e.currentTarget.dataset.i].favorite = true;
        list[e.currentTarget.dataset.i].collectCount = list[e.currentTarget.dataset.i].collectCount + 1;
        that.setData({
          list: list
        });
      });
    }
  },

  //预览图片
  lookImg: function (e) {
    console.log('预览图片', e);
    //获取图片信息
    var that = this;
    var imgurl = e.currentTarget.dataset.images;
    console.log('预览图片', imgurl);
    wx.previewImage({
      current: imgurl[e.currentTarget.dataset.i], // 当前显示图片的http链接
      urls: imgurl// 需要预览的图片http链接列表
    })

  },
  //详情
  xiangqing: function (e) {
    console.log('详情', e);
    wx.navigateTo({
      url: '/pages/market/details/details?id=' + e.currentTarget.dataset.id,
    })
  },

  gonggongfangfa: function (that, type, excludeType, orderBy) {
    count = 0;
    url.ajaxGet(false, url.souche, {
      openId: app.globalData.openid,
      type: type,
      excludeType: excludeType,
      orderBy: orderBy,
      start: count
    }, function (data) {
      console.log("过户车:", data);
      that.callbackData(data);
    });
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
  //点击九宫格图片
  jiugonggetupian: function (e) {
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
  //详情
  onCarDetails: function (e) {
    console.log('详情', e);
    wx.navigateTo({
      url: '/pages/market/details/details?id=' + e.currentTarget.dataset.id,
    })
  },
})