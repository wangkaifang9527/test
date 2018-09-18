//index.js
//获取应用实例
const app = getApp()
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");
var count = 0;//加载页
var size = 20;//每页加载条数
Page({

  /**
   * 页面的初始数据
   */
  data: {

    share_title: '微信里的二手车市场 ，朋友圈的车源都发这！',
    share_path: 'pages/index/index',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userflag: true,// 用户是否授权
    array: ['筛选', '车龄最短', '里程最少', '价格最低', '离我最近', '图文切换'],
    index: 0,
    cheliangxingzhi: 0,
    //0.全部,1.过户车 2抵押车 3离我最近, 4.车龄最短 5.里程最少 6.价格最低 7.事故车，8.收藏车
    city: '全国',
    vehicleSearch:'输入关键词搜索',
    list: [],//渲染数据
    isEmpty: true,//第一次为空
    isloading: false,//
    isloadover: false,//
    videoflag: true,//播放视频的遮罩层
    focus: false, // input 是否聚焦
    hidden: true, // input 是否隐藏
    pinglun_value: '', // input vlaue
    vehicleId: -1,//车辆id 
    i: -1,
    change_flag: true,//图文 ，还是9宫格
    zhiding_flag:true,//
    selected_flag:true,

    open: false,//红包开关
    chai_open: false,//拆红包开关
    red_open: false,//红包消息
    robbed: false,//红包是否已抢完
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({ title: "初始化", mask: true });
    app.getUserId(function (data) {
      wx.hideLoading();
      that.callBackgetUserId(options, data);
    });
    var sv = wx.getStorageSync('ShareVehicleSourceAmount');
    var svTime = wx.getStorageSync('ShareVehicleSourceTime');
    var date = util.toDate(new Date().getTime(), 'YMD');
    if (svTime == date) {
      that.setData({
        forwardCount: sv,
      });
    }
  },

 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var city = wx.getStorageSync('city');
    if (city) {
      that.setData({
        city: city,
        list: [],//渲染数据
        isEmpty: true,//第一次为空
        isloading: false,//
        isloadover: false,//
      });
      count = 0;
      url.ajaxGet(false, url.souche, {
        openId: app.globalData.openid,
        keyword: city,
        start: count,
      }, function (data) {
        console.log("城市:", data);
        wx.setStorageSync('city', '');
        that.callbackData(data);
      });
    }
    var vehicleSearch = wx.getStorageSync('vehicleSearch');
    if (vehicleSearch) {
      that.setData({
        vehicleSearch: vehicleSearch,
        list: [],//渲染数据
        isEmpty: true,//第一次为空
        isloading: false,//
        isloadover: false,//
      });
      count = 0;
      url.ajaxGet(false, url.souche, {
        openId: app.globalData.openid,
        keyword: vehicleSearch,
        start: count,
      }, function (data) {
        console.log("关键词:", data);
        wx.setStorageSync('vehicleSearch', '');
        that.callbackData(data);
      });
    }

  },

  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    console.log('下拉刷新');
    wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
    that.setData({
      isEmpty: true,//第一次为空
      isloading: true,
      isloadover: false,
      city:'全国',//城市初始化
      list:[],
      index:0, //赛选初始化
      vehicleSearch: '输入关键字搜索',//初始化
    });
    count = 0;//加载页
    url.ajaxGet(false, url.souche, {
      openId: app.globalData.openid,
      location: app.globalData.location,
      start: count
    }, function (data) {
      console.log("车辆列表:", data);
      wx.stopPullDownRefresh() //停止当前页面的下拉刷新。
      that.callbackData(data);
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    console.log('加载更多');
    var that = this;
    var cheliangxingzhi = that.data.cheliangxingzhi;
    var targetOpenId = ''    //对方的openId
    var type1 = ''         // 1 抵押车  2收藏车  3 事故车 可多选，用,隔开  可空
    var excludeType = ''   // 空：查包含type   非空：查不含type  可空
    var property = ''      // 	1 非营运 2营运  可空
    var keyword = ''       // 关键词搜索 可空 ，包含 城市，模糊搜索
    var status = ''        // 1 在售 2已成交  3删除 可空
    var orderBy = ''       //1 按时间排序  2 按车龄  3按公里数  4按价格  5按距离    可空
    var sort = ''          //  0：正序  空时默认倒序   可空
    if (that.data.city != '全国') {
      keyword = that.data.city;
    }
    switch (cheliangxingzhi) {
      case 1:
        type1 = 1;
        excludeType = 1;
      case 2:
        type1 = 1;
      case 3:
        orderBy = 5
      case 4:
        orderBy = 2
      case 5:
        orderBy = 3
      case 6:
        orderBy = 4
      case 7:
        type1 = 3
      case 8:
        type1 = 2
    }
    if (this.data.isloadover) {
      return false;
    }
    count++;
    url.ajaxGet(false, url.souche, {
      openId: app.globalData.openid,
      type: type1,
      excludeType: excludeType,
      keyword: keyword,
      orderBy: orderBy,
      location: app.globalData.location,
      start: count,
    }, function (data) {
      console.log("车辆列表:", data);
      that.callbackData(data);
    });
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
    for (var i = 0; i < vehicleList.length; i++) {
      vehicleList[i].createTime = util.timeBefore(vehicleList[i].createTime);
      vehicleList[i].distance = util.divide1000(vehicleList[i].distance);
      if (vehicleList[i].price != null && vehicleList[i].price != '' && vehicleList[i].price != undefined && vehicleList[i].price != 'undefined') {
        if (vehicleList[i].price.toString().length > 6) {
          vehicleList[i].price = vehicleList[i].price.toString().substring(0, 6);
        }
      }
      for (var j = 0; j < vehicleList[i].images.length; j++) {
        vehicleList[i].images[j] = vehicleList[i].images[j].replace('.mp4', '.jpg');
        vehicleList[i].images[j] = url.qiniu + vehicleList[i].images[j] + url.qiniu_compress;
      }

      vehicleList[i].location = vehicleList[i].location.split(',')[1];
      if (vehicleList[i].type != '' && vehicleList[i].type != null) {
        vehicleList[i].xz = [];
        var xx = vehicleList[i].type.split(',');
        for (var j = 0; j < xx.length; j++) {
          vehicleList[i].xz.push(xx[j]);
        }
      }

      vehicleList[i].adShow = true;// 插入广告
      vehicleList[i].clinchShow = false;
      if (vehicleList[i].status == 2){
        var date = new Date();
        //console.log(date.getTime() , vehicleList[i].clinchTime , date.getTime() - vehicleList[i].clinchTime > 6 * 60 * 60 * 1000);
        if (date.getTime() - vehicleList[i].clinchTime > 6 * 60 * 60 * 1000){
          vehicleList[i].clinchShow = true;
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
    wx.hideNavigationBarLoading() //隐藏导航条加载动画。
    var num = Math.floor(Math.random() * 5 + 5);
    var ad = {}
    ad.adShow = false;
    ad.avatarUrl = 'http://www.levau.com/ad/ad-xs.png'
    orders_data.splice(num, 0, ad)

    var num1 = Math.floor(Math.random() * 5 + 10);
    var ad1 = {}
    ad1.adShow = false;
    ad1.avatarUrl = 'http://www.levau.com/ad/ad-bm.png'
    orders_data.splice(num1, 0, ad1)
    console.log('列表数据:', vehicleList);
    //更新数据
    that.setData({
      list: orders_data,
      isloading: false
    });
    
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log('res', res);
    var that = this;
    var title = that.data.share_title;
    var path = that.data.share_path + '?openid=' + app.globalData.openid;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('来自页面内转发按钮', res.target);
      title = '车辆详细信息'
      path = "pages/market/details/details?id_=" + res.target.dataset.id
    }
    return {
      title: title,
      path: path,
      // imageUrl: that.data.share.imageUrl,
      success: function (res1) {
        if(res.target == undefined){
          util.showToast('成功转发', 'success');
          return;
        }
        if (that.data.forwardCount >= 3) {
          util.showToast('3次已用完', 'error');
          return;
        }
        url.ajaxPost(false, url.shareVehicle, {
          openId: app.globalData.openid,
          vehicleId: res.target.dataset.id
        }, function (data) {
          console.log("分享车源回掉:", data);
          util.showToast('获取一个车模', 'success');
          var count = that.data.forwardCount + 1
          that.setData({
            forwardCount: count
          });
          wx.setStorageSync('ShareVehicleSourceAmount', count);
          wx.setStorageSync('ShareVehicleSourceTime', util.toDate(new Date().getTime(), 'YMD'));
        });

      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  
  //首页长按事件
  onLongTap: function(e){
    console.log(e);
    util.showToast('切换成功','success')
    this.setData({
      change_flag: !this.data.change_flag,
    })
  },
 
  //点击任意地方都关闭筛选按钮
  onCloseSelectedFlag: function(){
    var that = this;
    that.setData({
      selected_flag: true,
    })
  },
  //筛选开关
  onSelectedFlag: function(){
    var that = this;
    var selected_flag = that.data.selected_flag;
    if (selected_flag) {
      that.setData({
        selected_flag: false,
      })
    } else {
      that.setData({
        selected_flag: true,
      })
    }
   
  },

  onPageScroll: function (event){
    if (event.scrollTop > 600) {
      this.setData({
        zhiding_flag: false,
        selected_flag: true
      })
    }else{
      this.setData({
        zhiding_flag: true,
        selected_flag: true
      })
    }
  },

  //输入关键字搜索
  search: function () {
    wx.navigateTo({
      url: '/pages/market/search/search',
    })
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  //点击九宫格图片
  jiugonggetupian: function (e) {
    wx.navigateTo({
      url: '/pages/market/details/details?id=' + e.currentTarget.dataset.id,
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
  
  //车辆收藏
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
  //预览图片
  lookImg: function (e) {
    console.log('预览图片', e);
    //获取图片信息
    var that = this;
    var imgurl = e.currentTarget.dataset.images;
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
  //查询跳转
  onQuery: function(){
    wx.navigateTo({
      url: '/pages/query/query',
    })
  },

  //选择城市
  xuanzechengshi: function () {
    wx.navigateTo({
      url: '/pages/market/area/area',
    })
  },

  //筛选
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e);
    var that = this;
    var cheliangxingzhi = '';//车辆性质
    var type = '';
    var excludeType = '';
    var orderBy = ''
    var sort = '';
    e.detail.value = e.currentTarget.dataset.index;
    setTimeout(function(){
      that.setData({
        selected_flag: true,
      })
    },1000)
    
    if (e.detail.value != 0) {
      if (e.detail.value == 1) {
        orderBy = '2'
        cheliangxingzhi = 4
      } else if (e.detail.value == 2) {
        orderBy = '3'
        cheliangxingzhi = 5
        sort = 0;
      } else if (e.detail.value == 3) {
        orderBy = '4'
        cheliangxingzhi = 6
        sort = 0;
      } else if (e.detail.value == 4){
        orderBy = '5'
        cheliangxingzhi = 3
      } else if (e.detail.value == 5) {
        var change_flag = that.data.change_flag;
        if (change_flag){
          that.setData({
            change_flag: false,
          })
        }else {
          that.setData({
            change_flag: true,
          })
        }
        return;
      }

      that.setData({
        list: '',
        isEmpty: true,
        index: e.detail.value,
        cheliangxingzhi: cheliangxingzhi,
      });
      that.gonggongfangfa(that, type, excludeType, orderBy, sort);
    }else{

      that.setData({
        index: e.detail.value,
        isEmpty: true,
      });
      that.gonggongfangfa(that, '', '', '', '');
    }
    
  },

  gonggongfangfa: function (that, type, excludeType, orderBy, sort) {
    count = 0;
    url.ajaxGet(false, url.souche, {
      openId: app.globalData.openid,
      type: type,
      excludeType: excludeType,
      orderBy: orderBy,
      start: count,
      sort: sort,
    }, function (data) {
      console.log("赛选:", data);
      that.callbackData(data);
    });
  },

  //身份获取完毕后回调
  callBackgetUserId: function (options, data) {
    var that = this;
    // 通过别人的分享链接进入的
    if (options.openid) {
      console.log('通过别人的分享链接进入的:', options.openid);
      wx.request({
        url: url.agent_binding,
        data: { promoterOpenId: options.openid, openId: app.globalData.openid },
        success: function (data) {
          console.log("分享绑定代理商:", data);
        }
      })
    }
    // 通过扫描别人的二维码进入的
    if (typeof (options.scene) != 'undefined') {
      console.log('通过扫描别人的二维码进入的:', decodeURIComponent(options.scene));
      wx.request({
        url: url.agent_binding,
        data: { promoterOpenId: decodeURIComponent(options.scene), openId: app.globalData.openid },
        success: function (data) {
          console.log("二维码绑定代理商:", data);
        },
        fail: function (data) {
          console.log("二维码绑定失败", data);
        }
      })

    }
    // 通过别人的转发 看看有红包
    if (options.redEnvelopeId){
      url.ajaxPost(false, url.redEnvelope_unpack, {
        openId: app.globalData.openid,
        envelopeId: options.redEnvelopeId
      }, function (data) {
        console.log("看看是否有红包:", data);
        if (data.result.amount != undefined && data.result.amount != '') {
          that.setData({
            open: !that.data.open,
            amount: data.result.amount,
            robbed: false, //红包是否抢完
          })
        }else {
          that.setData({
            open: !that.data.open,
            amount: '红包抢完啦',
            robbed: true
          })
        }
      });
    }

    that.setData({
      list: [],//渲染数据
      isEmpty: true,//第一次为空
      isloading: false,//
      isloadover: false,//
    })
    count = 0;
    wx.showLoading({ title: "提交中" });
    url.ajaxGet(false, url.souche, {
      openId: app.globalData.openid,
      location: app.globalData.location,
      start: count
    }, function (data) {
      console.log("车辆列表:", data);
      that.callbackData(data);
    });

    //获取当前定位
    util.getLocation(function (data) {
      app.globalData.location = data;
    });

    //检查用户是否授权
    wx.getSetting({
      success(res) {
        console.log('检查授权情况', res);
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: false,
            success: function (res) {
              console.log('用户信息', res);
              app.globalData.userInfo = res.userInfo;
              that.setData({
                userInfo: app.globalData.userInfo
              })
              if (res.userInfo.nickName == data.nickName && res.userInfo.avatarUrl == data.avatarUrl) {
              } else {
                wx.request({
                  url: url.user,
                  data: {
                    'openId': data.openId,
                    'userInfo': res.userInfo,
                  },
                  success: function (data3) {
                    console.log('头像和昵称入库', data3);
                    wx.setStorageSync('newUser', false)
                  }
                })
              }
            }
          })
        } else {
          console.log('未授权');
          that.setData({
            userflag: false,
          })
        }
      }
    });

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('请求完新版本信息的回调', res.hasUpdate)
      if (res.hasUpdate) {
        wx.setStorageSync("guarantee-remind", true);
        wx.setStorageSync("order-title-red", true);
        updateManager.onUpdateReady(function (res) {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            showCancel: false,
            success: function (res) {
              console.log(res);
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          wx.showModal({
            title: '下载失败',
            content: '可能是网络原因等',
            success: function (res) {
            }
          })
          // 新的版本下载失败
        })
      }else{
        console.log('查看更新后缓存的情况:', wx.getStorageSync("guarantee-remind"))
        console.log('查看更新后缓存的情况:', wx.getStorageSync("order-title-red"))
        //wx.setStorageSync("guarantee-remind", false);
      }
    })




  },

  //微信获取用户信息
  bindGetUserInfo: function (e) {
    var that = this;
    that.setData({
      userflag: true,
    });
    console.log(e);
    if (e.detail.errMsg == 'getUserInfo:ok') {
      that.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName,
      });
      wx.request({
        url: url.user,
        data: {
          'openId': app.globalData.openid,
          'userInfo': e.detail.userInfo,
        },
        success: function (data3) {
          console.log('头像和昵称入库', data3);
          wx.setStorageSync('newUser', false)
        }
      })
    }
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
      open: false,
    })
  },
  //前往账户余额
  onGoBalance: function () {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },

  //评论图标 
  // pinglun: function (e) {
  //   console.log(e);
  //   var that = this;
  //   that.setData({
  //     focus: true,
  //     hidden: false,
  //     vehicleId: e.currentTarget.dataset.vehicleid,
  //     i: e.currentTarget.dataset.i,
  //   });
  // },

  
})
