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
    change_flag: false,//图文与9宫格切换
    pinglun_flag: false,//点击评论出险
    tuwen_url: '/images/chonggou/shichang/jiugonggebai.png',
    jiugongge_url: '/images/chonggou/shichang/jiugonggehei.png',

    zuixinfabu: 0.3,
    chushouzhong: 0.3,
    yichengjiao: 0.3,
    userInfo: '',

    focus: false,
    hidden: true,
    pinglun_value: '',

    videoflag: true,
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
    url.ajaxGet(false, url.myVehicleList, {
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
    url.ajaxGet(false, url.myVehicleList, {
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
    url.ajaxGet(false, url.myVehicleList, {
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
      vehicleList[i].flag = false

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

  // //图文列表
  // tuwen: function () {
  //   this.setData({
  //     change_flag: true,
  //     tuwen_url: '/images/chonggou/shichang/tuwenbai.png',
  //     jiugongge_url: '/images/chonggou/shichang/jiugonggehei.png',
  //   });
  // },
  // //九宫格列表
  // jiugongge: function () {
  //   this.setData({
  //     change_flag: false,
  //     tuwen_url: '/images/chonggou/shichang/tuwenhei.png',
  //     jiugongge_url: '/images/chonggou/shichang/jiugonggebai.png',
  //   });
  // },

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
  zuixinfabu: function () {
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
  //粉丝
  fensi:function(){
    wx.navigateTo({
      url: '../my-fans/my-fans',
    })
  },
  //关注
  guanzhu: function (e) {
    wx.navigateTo({
      url: '../my-follow/my-follow',
    })
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
      util.showToast('评论不能为空', 'error');
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
    console.log(e);
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
    console.log(e);
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
  //点击九宫格图片
  jiugonggetupian: function (e) {
    wx.navigateTo({
      url: 'details/details?id=' + e.currentTarget.dataset.id,
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
  //打开编辑
  onEditCar:function(e){
    console.log(e);
    var that = this;
    var list = that.data.list;
    list[e.currentTarget.dataset.i].flag = true;
    that.setData({
      list: list
    });
  },
  onClose:function(e){
    var that = this;
    var list = that.data.list;
    list[e.currentTarget.dataset.i].flag = false;
    that.setData({
      list: list
    });
  },


  //删除(自己)
  shanchu: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: "提交中"
          });
          url.ajaxGet(false,
            url.vehicle_delete,
            {
              openId: app.globalData.openid,
              vehicleId: e.currentTarget.dataset.id
            },
            function (data) {
              console.log("删除车辆信息回掉:", data);
              wx.hideLoading();
              wx.showModal({
                title: '删除',
                content: data.resultMsg,
                success: function (res) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            }
          )
        } else {

        }
      }
    });
  },
  //编辑(自己)
  bianji: function (e) {
    wx.navigateTo({
      url: '/pages/market/details-audit/details-audit?id=' + e.currentTarget.dataset.id,
    })
  },
  //市场置顶
  shichangzhiding:function(e){
    wx.showLoading({
      title: "置顶中"
    });
    url.ajaxGet(false,
      url.refresh,
      {
        openId: app.globalData.openid,
        vehicleId: e.currentTarget.dataset.id
      },
      function (data) {
        console.log("市场置顶回掉:", data);
        wx.hideLoading();
        util.showToast('置顶成功', 'top');
      }
    )
  },

  //车辆状态为在售,用户点击变成已完成状态
  zaishou: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定车辆已经出售?',
      success: function (res) {
        if (res.confirm) {
          url.ajaxPost(false, url.vehicle_clinch, {
            openId: app.globalData.openid,
            vehicleId: e.currentTarget.dataset.id
          }, function (data) {
            console.log("修改成成交状态回调:", data);
            if (data.resultCode == 1) {
              var list = that.data.list;
              list[e.currentTarget.dataset.i].status = 2
              list[e.currentTarget.dataset.i].flag = false
              that.setData({
                list: list,
              })
              util.showToast('车辆已售', 'sale');
            } else {
              util.showToast(data.resultMsg, 'error');
            }
          });
        } else {

        }
      }
    })
  },
  chengjiao: function () {
    util.showToast('车辆已售', 'sale');
  },

  //打开编辑
  onEditCar: function (e) {
    console.log(e);
    var that = this;
    var list = that.data.list;
    list[e.currentTarget.dataset.i].flag = true;
    that.setData({
      list: list
    });
  },
})