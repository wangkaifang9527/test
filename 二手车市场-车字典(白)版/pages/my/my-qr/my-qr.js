//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    qrCode: '',
    avatarUrl:'',
    nickName:'',
    totalIncome:'',
    share_path: 'pages/my/my-qr/my-qr',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //wx.hideShareMenu()//隐藏转发按钮
    console.log('options', options);
    console.log('options-user', options.openid != null);
    var that = this;
    if (options.openid) {
      console.log('转发成功', options.openid);
      
      console.log("是否有用户信息", app.globalData.isGetUserInfo);
      if (!app.globalData.isGetUserInfo) {
        //获取用户登陆身份
        wx.showLoading({ title: "初始化", mask: true });
        app.getUserId(function (data) {
          wx.hideLoading()
          console.log('身份获取完毕');
          wx.request({
            url: url.agent_info,
            data: { 'openId': options.openid },
            success: function (data) {
              console.log('个人主页', data);
              var user = data.data.result;
              that.setData({
                nickName: user.nickName,
                avatarUrl: user.avatarUrl,
                qrCode: user.qrCode,
                totalIncome: user.totalIncome
              });
            }
          });

        });
      } else {
        wx.request({
          url: url.agent_info,
          data: { 'openId': options.openid },
          success: function (data) {
           
            console.log('个人主页', data);
            var user = data.data.result;
            that.setData({
              nickName: user.nickName,
              avatarUrl: user.avatarUrl,
              qrCode: user.qrCode,
              totalIncome: user.totalIncome
            });
          }
        });
      }
      return;

    } else {
      
      console.log('user缓存', wx.getStorageSync('user'));
      var user = wx.getStorageSync('user')
      this.setData({
        qrCode: user.qrCode,
        avatarUrl: user.avatarUrl,
        nickName: user.nickName,
        totalIncome: user.totalIncome
      })
      return;
    }
  },

  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    var user = wx.getStorageSync('user');
    console.log('res', res);
    console.log('user', user);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('来自页面内转发按钮', res.target)
    }
    return {
      title: '我的二维码',
      path: that.data.share_path + '?openid=' + app.globalData.openid,
      // imageUrl: that.data.share.imageUrl,
      success: function (res) {
        console.log(app.globalData.openid);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //预览图片
  lookImg: function (e) {
    console.log('预览图片');
    //获取图片信息
    var that = this;
    var imgurl = that.data.qrCode;
    wx.previewImage({
      current: imgurl, // 当前显示图片的http链接
      urls: [imgurl] // 需要预览的图片http链接列表
    })

  },
  //长按保存图片
  saveImg: function (event) {
    console.log('长按保存图片', event);
    this.downloadImg();
    var imgurl = that.data.qrCode;
    //保存图片
    wx.saveImageToPhotosAlbum({
      filePath: imgurl,
      success(res) {
        console.log(res);
        wx.showToast({
          title: '成功保存到相册',
          icon: 'success',
          duration: 1000
        });
      }
    })

    console.log(2);
  },
  //下载图片
  downloadImg: function () {
    if (wx.getSetting) {
      console.log('最新微信版本');
      // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
      wx.getSetting({
        success(res) {
          if (!res['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                console.log('同意保存到相册功能');
                // 用户已经同意小程序使用**功能，后续调用 wx.saveImageToPhotosAlbum 接口不会弹窗询问
                // wx.saveImageToPhotosAlbum();
              }
            })
          }
        }
      });
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },


  //推广收益
  onPromotionRevenue: function (e) {
    wx.navigateTo({
      url: '../my-earnings/my-earnings?money=' + e.currentTarget.dataset.money,
    })
  },
})