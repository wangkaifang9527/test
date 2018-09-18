// pages/my/his-homepage/his-homepage.js
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
    list: [],//渲染数据
    isEmpty: true,//第一次为空
    isloading: false,//
    isloadover: false,//
    path: 'pages/market/details/details',//分享的页面路径
    change_flag: true,//图文与9宫格切换
    pinglun_flag: false,//点击评论出险
    tuwen_url: '/images/chonggou/shichang/tuwenbai.png',
    jiugongge_url: '/images/chonggou/shichang/jiugonggehei.png',

    zuixinfabu:0.3,
    chushouzhong:0.3,
    yichengjiao:0.3,
    userInfo:'',
    targetOpenId:'',

    focus: false,
    hidden: true,
    pinglun_value: '',

    videoflag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('targetOpenId',options.targetOpenId);
    var that = this;
    //wx.hideShareMenu()//隐藏转发按钮
    that.setData({
      list: [],//渲染数据
      isEmpty: true,//第一次为空
      isloading: false,//
      isloadover: false,//
      targetOpenId: options.targetOpenId,
    })
    count = 0;
    wx.showLoading({ title: "提交中" });
    url.ajaxGet(false, url.vehicleList, {
      openId: app.globalData.openid,
      targetOpenId: options.targetOpenId,
      location: app.globalData.location,
      start: count
    }, function (data) {
      console.log("看别人的主页:", data);
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
    url.ajaxGet(false, url.vehicleList, {
      openId: app.globalData.openid,
      targetOpenId: that.data.targetOpenId,
      location: app.globalData.location,
      start: count
    }, function (data) {
      console.log("看别人的主页:", data);
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
    url.ajaxGet(false, url.vehicleList, {
      openId: app.globalData.openid,
      targetOpenId: that.data.targetOpenId,
      location: app.globalData.location,
      start: count
    }, function (data) {
      console.log("看别人的主页:", data);
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
      vehicleList[i].createTime = util.timeBefore(vehicleList[i].createTime);
      vehicleList[i].distance = util.divide1000(vehicleList[i].distance);
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
      userInfo: data.result.userInfo,
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

  //最新发布
  zuixinfabu:function(){
    var that = this;
    that.setData({
      zuixinfabu: 1,
      chushouzhong: 0.3,
      yichengjiao: 0.3,
    });
  },
  //出售中
  chushouzhong: function () {
    var that = this;
    that.setData({
      zuixinfabu: 0.3,
      chushouzhong: 1,
      yichengjiao: 0.3,
    });
  },
  //已成交
  yichengjiao: function () {
    var that = this;
    that.setData({
      zuixinfabu: 0.3,
      chushouzhong: 0.3,
      yichengjiao: 1,
    });
  },

  //关注
  jiaguanzhu: function (e) {
    var that = this;
    var userInfo = that.data.userInfo;
    console.log(e, that.data.userInfo);
    var relationship = e.currentTarget.dataset.relationship;
    if (relationship == 2 || relationship == 3) {
      //取消关注
      url.ajaxPost(false, url.cancelFocus, {
        openId: app.globalData.openid,
        targetOpenId: e.currentTarget.dataset.targetopenid,
      }, function (data) {
        console.log("取消关注回掉:", data, app.globalData.userInfo);
        userInfo.relationship = 0;
        util.showToast('取消关注', 'success')
        that.setData({
          userInfo: userInfo
        });
      })
    } else {
      //关注
      url.ajaxPost(false, url.focus, {
        openId: app.globalData.openid,
        targetOpenId: e.currentTarget.dataset.targetopenid,
      }, function (data) {
        console.log("关注回掉:", data, app.globalData.userInfo);
        userInfo.relationship = 2;
        util.showToast('成功关注', 'success')
        that.setData({
          userInfo: userInfo
        });
      })
    }
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
  onCarDetails: function (e) {
    console.log('详情', e);
    wx.navigateTo({
      url: '/pages/market/details/details?id=' + e.currentTarget.dataset.id,
    })
  },

  //播放视频
  bofangshipin: function (e) {
    console.log('播放视频', e);
    var name = e.currentTarget.dataset.name;
    name = name.replace('.jpg', '.mp4');
    this.setData({
      videoflag: false,
      mp4: name,
    });
  },
  //关闭遮罩
  guanbizhezhao: function () {
    this.setData({
      videoflag: true,
    });
  },

  //粉丝
  fensi: function () {
    wx.navigateTo({
      url: '../my-fans/my-fans?targetOpenId=' + this.data.targetOpenId,
    })
  },
  //关注
  guanzhu: function (e) {
    wx.navigateTo({
      url: '../my-follow/my-follow?targetOpenId=' + this.data.targetOpenId,
    })
  },

  //用户电话
  dianhua: function (e) {
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
  }
})