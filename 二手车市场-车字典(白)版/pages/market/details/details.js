// pages/market/details/details.js
var app = getApp();
var url = require("../../../utils/url.js"); //服务列表
var util = require("../../../utils/util.js");
var count = 0; //加载页
var size = 20; //每页加载条数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vehicle: [],
    isEmpty: true, //第一次为空
    isloading: false, //
    isloadover: false, //

    id_: '',
    chekuang_array: [],
    path: 'pages/market/details/details', //分享的页面路径
    zhezhao: false,
    chekuang: false,
    peizhi: false,
    miaoshu: false,
    myavatarUrl: '',
    pinglun_value: '', //评论
    pinglun_value2: '', //回复
    focus: false,
    hidden: true,
    i: -1,
    userInfo: '',
    openid: '',

    forwardCount: 0, //转发的次数每天限时5次有车模
    open: false,
    help_sell_open: false,//帮卖提示
    help_GZ_open: false, //帮卖规则
    help_XS_open: false, //悬赏规则
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var open = false
    console.log('版本是否更新过:', wx.getStorageSync("guarantee-remind"))
    if (wx.getStorageSync("guarantee-remind")) {
      open = true
    }
    that.setData({
      open: open,
      isadmin: app.globalData.isadmin, //是否是管理员
    });
    var sv = wx.getStorageSync('ShareVehicleSourceAmount');
    var svTime = wx.getStorageSync('ShareVehicleSourceTime');
    var date = util.toDate(new Date().getTime(), 'YMD');
    if (svTime == date) {
      that.setData({
        forwardCount: sv,
      });
    }
    if (options.id) {
      that.callBackgetUserId(options, null);
    } else {
      app.getUserId(function(data) {
        wx.hideLoading();
        console.log('身份获取完毕之前', data);
        that.callBackgetUserId(options, data);
      });
      console.log('转发的ID', options.id_);
    }

  },


  //身份获取完毕后回调
  callBackgetUserId: function(options, data) {
    console.log('身份获取完毕后回调', options, data);
    var that = this;
    var vehicleId = options.id;
    var openId = app.globalData.openid
    that.setData({
      vehicle: [], //渲染数据
      isEmpty: true, //第一次为空
      isloading: false, //
      isloadover: true, //
    })
    // 通过别人的分享链接进入的
    if (options.id_) {
      console.log('通过别人的分享链接进入的:', options.id_);
      vehicleId = options.id_;
      openId = data.openId

      //如果是悬赏车辆的话 记录下当前的路线
      url.ajaxPost(false, url.forward_forward, {
        openId: app.globalData.openid,
        sourceOpenId: options.sourceOpenId,
        vehicleId: options.id_,
      }, function(data) {
        console.log("记录下当前的路线", data);
      });

    }
    // 通过扫描别人的二维码进入的
    if (typeof(options.scene) != 'undefined') {
      console.log('通过扫描别人的二维码进入的:', decodeURIComponent(options.scene));
      vehicleId = decodeURIComponent(options.scene);
      openId = data.openId
    }
    if (typeof(options.q) != 'undefined') {
      console.log('通过扫描别人的(普通)二维码进入的:', decodeURIComponent(options.q));
      var link = decodeURIComponent(options.q);
      console.log(link);
      var paramArr = link.split('=');
      if (paramArr.length == 2) {
        var params = paramArr[1].split('#');
        vehicleId = params[1]
        openId = params[0]
      }

    }
    that.setData({
      id_: vehicleId
    });
    url.ajaxPost(false, url.vehicle_detail, {
      openId: openId,
      vehicleId: vehicleId
    }, function(data1) {
      console.log("车辆详细:", data1);
      that.callbackData(data1);
      var promoterOpenId = data1.result.vehicle.openId;
      if (options.id_) {
        wx.request({
          url: url.agent_binding,
          data: {
            promoterOpenId: promoterOpenId,
            openId: data.openId
          },
          success: function(data) {
            console.log("分享绑定代理商:", data);
          }
        })
      }
      if (typeof(options.scene) != 'undefined') {
        wx.request({
          url: url.agent_binding,
          data: {
            promoterOpenId: promoterOpenId,
            openId: data.openId
          },
          success: function(data) {
            console.log("分享绑定代理商:", data);
          }
        })
      }
      if (typeof(options.q) != 'undefined') {
        console.log('通过扫描别人的(普通)二维码进入的:', decodeURIComponent(options.q));
        var link = decodeURIComponent(options.q);
        console.log(link);
        var paramArr = link.split('=');
        if (paramArr.length == 2) {
          var params = paramArr[1].split('#');
          wx.request({
            url: url.agent_binding,
            data: {
              promoterOpenId: params[0],
              openId: data.openId
            },
            success: function(data) {
              console.log("分享绑定代理商:", data);
            }
          })
        }
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh() //停止当前页面的下拉刷新。
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (this.data.isloadover) {
      return false;
    }
    count++;
    url.ajaxGet(false, url.comment_commentList, {
      openId: app.globalData.openid,
      vehicleId: that.data.vehicle.id,
      start: count
    }, function(data) {
      console.log("加载评论回掉:", data);
      var commentList = data.result.commentList
      if (commentList.length == size) {
        // console.log('持续加载');
      } else {
        that.setData({
          isloadover: true
        });
        console.log('所有数据加载完毕');
      }
      if (commentList.length > 0) {
        for (var i = 0; i < commentList.length; i++) {
          data.result.vehicle.commentList[i].commentTime = util.toDate(commentList[i].commentTime, 'YMDhms');
        }
      }
      var vehicle = that.data.vehicle;
      vehicle.comments = vehicle.comments.concat(commentList); //连接多个数组

      console.log('列表数据:', commentList);
      //更新数据
      that.setData({
        vehicle: vehicle,
        isloading: false
      });

      wx.hideNavigationBarLoading() //隐藏导航条加载动画。
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    wx.showShareMenu({
      withShareTicket: true,
    })
    var that = this;
    console.log('res', res);
    var id = ''
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('button', res.target)
      id = res.target.id;
    }
    return {
      title: that.data.vehicle.title + "," + that.data.vehicle.price + "万元" + "," + that.data.vehicle.mileage + "万公里" + "," + that.data.vehicle.location + "," + that.data.vehicle.licenseLocation,
      path: that.data.path + "?id_=" + that.data.id_ + '&sourceOpenId=' + app.globalData.openid,
      imageUrl: that.data.vehicle.images[0],
      success: function(res) {
        console.log(res)
        if (id != '') {
          if (id == 'forward_share') { //有偿转发
            wx.getShareInfo({
              shareTicket: res.shareTickets[0],
              success: function (res) {
                console.log('data', res, app.globalData.session_key);
                url.ajaxPost(false, url.forward_forwardWithReward, {
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  sessionKey: app.globalData.session_key,
                  openId: app.globalData.openid,
                  destId: '',
                  vehicleId: that.data.vehicle.id,
                }, function (data) {
                  console.log("群ID 红包:", data);
                  if (data.result.amount != undefined && data.result.amount != '') {
                    that.setData({
                      help_sell_open: true
                    })
                  }
                });
              }
            })
          }
        }

        // if (that.data.forwardCount >= 3) {
        //   //util.showToast('3次已用完', 'error');
        //   return;
        // }
        // url.ajaxPost(false, url.shareVehicle, {
        //   openId: app.globalData.openid,
        //   vehicleId: that.data.vehicle.id
        // }, function (data) {
        //   //util.showToast('获取1个车模', 'success');
        //   var count = that.data.forwardCount + 1
        //   that.setData({
        //     forwardCount: count
        //   });
        //   wx.setStorageSync('ShareVehicleSourceAmount', count);
        //   wx.setStorageSync('ShareVehicleSourceTime', util.toDate(new Date().getTime(), 'YMD'));
        // });

      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  //回掉
  callbackData: function(data) {
    var that = this;
    for (var i = 0; i < data.result.vehicle.images.length; i++) {
      data.result.vehicle.images[i] = url.qiniu + data.result.vehicle.images[i] + url.qiniu_compress;
    }

    data.result.vehicle.images.splice(1, 0, "http://www.levau.com/ad/ad-2.png")
    data.result.vehicle.openid_flag = false;
    if (data.result.vehicle.openId == app.globalData.openid) {
      data.result.vehicle.openid_flag = true;
    }
    var comments = data.result.vehicle.comments;
    if (comments.length > 0) {
      for (var i = 0; i < comments.length; i++) {
        comments[i].commentTime = util.toDate(comments[i].commentTime, 'YMDhms');
      }
    }
    //悬赏车
    if (data.result.vehicle.sellMode == 1) {
      that.countDown(data.result.vehicle.deadline);
    }
    //帮卖公示用户去重
    var arr = data.result.vehicle.forwardUserList
    if (arr != undefined && arr != '' && arr != 'undefined') {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].openId == arr[j].openId) {
            arr.splice(j, 1); //console.log(arr[j]);
            j--;
          }
        }
      }
      data.result.vehicle.forwardUserList = arr;
    }

    data.result.vehicle.location = data.result.vehicle.location.split(",")[1]
    data.result.vehicle.ratio_name = '维保记录和出险 油漆面 钣金 内饰 骨架 底盘 发动机 变速箱 疑似更换松动'
    that.setData({
      isloadover: false,
    });
    if (comments.length == size) {
      // console.log('持续加载');
    } else {
      that.setData({
        isloadover: true
      });
      console.log('所有数据加载完毕');
    }

    that.setData({
      vehicle: data.result.vehicle,
      userInfo: app.globalData.userInfo,
      openid: app.globalData.openid,
    });
  },



  //描述
  miaoshu: function(e) {
    console.log(e);
    var that = this;
    that.setData({
      zhezhao: true,
      chekuang: false,
      peizhi: false,
      miaoshu: true,
    });
  },
  //配置
  peizhi: function(e) {
    console.log(e);
    var that = this;
    that.setData({
      zhezhao: true,
      chekuang: false,
      peizhi: true,
      miaoshu: false,
    });

  },
  //车况
  chekuang: function(e) {
    console.log(e);
    var that = this;
    that.setData({
      zhezhao: true,
      chekuang: true,
      peizhi: false,
      miaoshu: false,
    });
    // var res = e.currentTarget.dataset.res;
    // var ress = res.split(',');
    // 
    // for(var i=0;i<ress.length-1;i++){
    //   chekuang.push(ress[i]);
    // }
    var chekuang = [];

    var brief = e.currentTarget.dataset.res;
    console.log(that.vehicle);
    if (brief != null && brief != '' && brief != undefined && brief != 'undefined') {
      var briefs = brief.split('#');
      if (briefs[0] != null && briefs[0] != '' && briefs[0].length > 0) {
        var briefs0 = JSON.parse(briefs[0]);
        for (var i = 0; i < briefs0.length; i++) {
          var name = briefs0[i].name;
          var self_list = briefs0[i].self_list;
          var ratio_name = '';
          for (var j = 0; j < self_list.length; j++) {
            if (self_list[j].self_list_flag) {
              ratio_name = ratio_name + self_list[j].name;
            }
          }
          chekuang.push(name + ' : ' + ratio_name);

        }
      }
      if (briefs[1] != null && briefs[1] != '' && briefs[1].length > 0) {
        var briefs0 = JSON.parse(briefs[1]);
        for (var i = 0; i < briefs0.length; i++) {
          var name = briefs0[i].name;
          var self_list = briefs0[i].self_list;
          var ratio_name = '';
          for (var j = 0; j < self_list.length; j++) {
            if (self_list[j].self_list_flag) {
              ratio_name = ratio_name + self_list[j].name;
            }
          }
          chekuang.push(name + ' : ' + ratio_name);

        }
      }
    }
    that.setData({
      chekuang_array: chekuang,
    });
  },


  zhezhao: function() {
    var that = this;
    that.setData({
      zhezhao: false,
      chekuang: false,
      peizhi: false,
      miaoshu: false,
    });
  },

  //删除(自己)
  shanchu: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除?',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: "提交中"
          });
          url.ajaxGet(false,
            url.vehicle_delete, {
              openId: that.data.vehicle.openId,
              vehicleId: that.data.vehicle.id
            },
            function(data) {
              console.log("删除车辆信息回掉:", data);
              wx.hideLoading();
              wx.showModal({
                title: '删除',
                content: data.resultMsg,
                success: function(res) {
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
  bianji: function() {
    wx.navigateTo({
      url: '../details-audit/details-audit?id=' + this.data.vehicle.id,
    })
  },
  //市场置顶
  shichangzhiding: function(e) {
    var that = this;
    wx.showLoading({
      title: "置顶中"
    });
    url.ajaxGet(false,
      url.refresh, {
        openId: that.data.vehicle.openId,
        vehicleId: that.data.vehicle.id
      },
      function(data) {
        console.log("市场置顶回掉:", data);
        wx.hideLoading();
        util.showToast('置顶成功', 'success');
      }
    )
  },

  //收藏(其他用户)
  shoucang: function(e) {
    console.log(e);
    var that = this;
    var vehicle = that.data.vehicle
    if (e.currentTarget.dataset.favorite) {
      //取消收藏
      url.ajaxPost(false, url.favorite_remove, {
        openId: app.globalData.openid,
        vehicleId: vehicle.id,
      }, function(data) {
        console.log("取消收藏返回:", data);
        vehicle.favorite = false;
        util.showToast('取消收藏', 'success');
        that.setData({
          vehicle: vehicle
        });
      });

    } else {
      //收藏车辆favorite_collect
      url.ajaxPost(false, url.favorite_collect, {
        openId: app.globalData.openid,
        vehicleId: vehicle.id,
      }, function(data) {
        console.log("收藏返回:", data);
        util.showToast('已收藏', 'success');
        vehicle.favorite = true;
        that.setData({
          vehicle: vehicle
        });
      });

    }
  },
  //预览图片
  lookImg: function(e) {
    console.log('预览图片', e);
    //获取图片信息
    var that = this;
    var imgurl = e.currentTarget.dataset.images;
    console.log('预览图片', imgurl);
    wx.previewImage({
      current: imgurl[e.currentTarget.dataset.i], // 当前显示图片的http链接
      urls: imgurl // 需要预览的图片http链接列表
    })

  },

  //input
  bindinput: function(e) {
    console.log(e.detail.value);
    this.setData({
      pinglun_value: e.detail.value
    });

  },
  //评论
  pinglun: function(e) {
    var that = this;
    console.log(e, that.data.pinglun_value);
    if (that.data.pinglun_value == '') {
      util.showToast('评论为空', 'success');
      return;
    }
    var content = that.data.pinglun_value;
    //评论
    url.ajaxPost(false, url.comment_comment, {
      openId: app.globalData.openid,
      vehicleId: that.data.vehicle.id,
      content: that.data.pinglun_value
    }, function(data) {
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
      var vehicle = that.data.vehicle;
      vehicle.comments = contents.concat(vehicle.comments);
      that.setData({
        vehicle: vehicle,
        pinglun_value: '',
      });

    })
  },


  //input 回复
  bindinput2: function(e) {
    console.log(e.detail.value);
    this.setData({
      pinglun_value2: e.detail.value
    });

  },
  //回复失焦事件
  bindblur: function() {
    var that = this;
    that.setData({
      focus: false,
      hidden: true,
      pinglun_value2: '',
      i: -1,
    });
  },
  //回复：
  reply: function(e) {
    console.log(e);
    var that = this;
    that.setData({
      focus: true,
      hidden: false,
      pinglun_value2: '',
      i: e.currentTarget.dataset.i,
    });


  },

  //发送回复
  bindconfirm: function() {
    var that = this;
    that.setData({
      focus: false,
      hidden: true,
    });
    var vehicle = that.data.vehicle;
    var pinglun_value2 = that.data.pinglun_value2
    var i = that.data.i;
    url.ajaxPost(false, url.comment_reply, {
      openId: app.globalData.openid,
      commentId: vehicle.comments[i].commentId,
      content: that.data.pinglun_value2,
    }, function(data) {
      console.log("回复回调:", data, app.globalData.userInfo);
      var userInfo = app.globalData.userInfo;
      var commentList = vehicle.comments[i].commentList;
      var comment = {
        'avatarUrl': userInfo.avatarUrl,
        'content': pinglun_value2,
        'nickName': userInfo.nickName,
        'commentTime': util.toDate(new Date().getTime(), 'YMDhms'),
      };
      vehicle.comments[i].commentList = vehicle.comments[i].commentList.concat(comment);
      that.setData({
        vehicle: vehicle,
        pinglun_value2: '',
      })
    });
  },
  //点赞
  dianzan: function(e) {
    console.log(e);
    var that = this;
    var vehicle = that.data.vehicle;
    if (e.currentTarget.dataset.hasthumbup) {
      //取消点赞
      url.ajaxPost(false, url.comment_cancelThumbUp, {
        openId: app.globalData.openid,
        commentId: e.currentTarget.dataset.commentid,
      }, function(data) {
        console.log("点赞回调:", data, app.globalData.userInfo);
        vehicle.comments[e.currentTarget.dataset.i].hasThumbUp = false;
        vehicle.comments[e.currentTarget.dataset.i].thumbUpCount = vehicle.comments[e.currentTarget.dataset.i].thumbUpCount - 1;
        that.setData({
          vehicle: vehicle,
        })
      })
    } else {
      //点赞
      url.ajaxPost(false, url.comment_thumbUp, {
        openId: app.globalData.openid,
        commentId: e.currentTarget.dataset.commentid,
      }, function(data) {
        console.log("点赞回调:", data, app.globalData.userInfo);
        vehicle.comments[e.currentTarget.dataset.i].hasThumbUp = true;
        vehicle.comments[e.currentTarget.dataset.i].thumbUpCount = vehicle.comments[e.currentTarget.dataset.i].thumbUpCount + 1;
        that.setData({
          vehicle: vehicle,
        })
      })
    }

  },
  //电话
  dianhua: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })

  },

  //点击头像进入个人主页
  zhuye: function(e) {
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
  //关注
  guanzhu: function(e) {
    console.log(e);
    var that = this;
    var vehicle = that.data.vehicle;
    var relationship = e.currentTarget.dataset.relationship;
    if (relationship == 2 || relationship == 3) {
      //取消关注
      url.ajaxPost(false, url.cancelFocus, {
        openId: app.globalData.openid,
        targetOpenId: e.currentTarget.dataset.targetopenid,
      }, function(data) {
        console.log("取消关注回掉:", data, app.globalData.userInfo);
        vehicle.relationship = 0;
        util.showToast('取消关注', 'success')
        that.setData({
          vehicle: vehicle
        });
      })
    } else {
      //关注
      url.ajaxPost(false, url.focus, {
        openId: app.globalData.openid,
        targetOpenId: e.currentTarget.dataset.targetopenid,
      }, function(data) {
        console.log("关注回掉:", data, app.globalData.userInfo);
        vehicle.relationship = 2;
        util.showToast('成功关注', 'success')
        that.setData({
          vehicle: vehicle
        });
      })
    }
  },

  //车辆状态为在售,用户点击变成已完成状态
  zaishou: function() {
    var that = this;
    var vehicle = that.data.vehicle;
    wx.showModal({
      title: '提示',
      content: '确定车辆已经出售?',
      success: function(res) {
        if (res.confirm) {
          url.ajaxPost(false, url.vehicle_clinch, {
            openId: app.globalData.openid,
            vehicleId: vehicle.id,
          }, function(data) {
            console.log("修改成成交状态回调:", data);
            if (data.resultCode == 1) {
              vehicle.status = 2;
              that.setData({
                vehicle: vehicle
              })
            } else {
              wx.showModal({
                title: '提示',
                content: data.resultMsg,
                success: function(res) {}
              })
            }
          });
        } else {

        }
      }
    })
  },
  chengjiao: function() {
    util.showToast('车辆已出售', 'success');
  },
  //返回首页
  fanhui: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //制作海报
  onZhiZuoHaiBao: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/market/canvas/canvas?vehicleid=' + that.data.id_,
    })
  },
  //交易担保
  jiaoyidanbao: function() {
    wx.navigateTo({
      url: '/pages/warrant/warrant?vehicleId=' + this.data.vehicle.id,
    })
  },
  //打赏车模
  onRewardModel: function() {
    var that = this;
    url.ajaxPost(false, url.present, {
      openId: app.globalData.openid,
      targetOpenId: that.data.vehicle.openId,
      amount: 1,
    }, function(data) {
      console.log("打赏车模回掉:", data);
      if (data.resultCode == 1) {
        util.showToast('谢谢老板打赏', 'success');
      } else if (data.resultCode == 110) {
        util.showToast('您没有车模了', 'error');
      } else {
        util.showToast('您没有车模了', 'error');
      }
    });
  },

  //设置有偿帮卖
  onForward: function() {
    wx.navigateTo({
      url: '/pages/market/paid-help/paid-help?vehicleId=' + this.data.vehicle.id,
    })
  },

  //倒计时
  countDown: function(deadline) {
    var totalSecond = (deadline - Date.parse(new Date())) / 1000;
    console.log(totalSecond, Date.parse(new Date()));
    var interval = setInterval(function() {
      // 秒数
      var second = totalSecond;

      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.showToast({
          title: '活动已结束',
        });
        this.setData({
          countDownDay: '00',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this), 1000);
  },
  //关闭提醒
  onCloseRemind: function() {
    wx.setStorageSync("guarantee-remind", false)
    this.setData({
      open: false,
    })
  },
  onCloseHelpSell: function() {
    this.setData({
      help_sell_open: false,
    })
  },

  //查看全部
  onAll: function() {
    wx.navigateTo({
      url: '/pages/market/details/all/all?vehicleId=' + this.data.vehicle.id,
    })
  },
  //帮卖规则
  onHelpGZopen: function(){
    this.setData({
      help_GZ_open:!this.data.help_GZ_open,
    })
  },
  //悬赏规则
  onHelpXSopen: function () {
    this.setData({
      help_XS_open: !this.data.help_XS_open,
    })
  },

})