// page/component/hello/hello.js
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beijing: 'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com/poster1',
    createQRCode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ title: "图片生成中", mask: true });
    this.drawCanvas();
  },

  drawCanvas: function () {
    var that = this;
    var userInfo = app.globalData.userInfo //用户信息（头像和昵称）
    var openid = 'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com/' + app.globalData.openid     //用户的openid 二维码推广
    var beijing = that.data.beijing        //背景图片
    const ctx = wx.createCanvasContext('myCanvas')
    // var bgImg, vImg;
    var avatarurl_width = 40;    //绘制的头像宽度
    var avatarurl_heigth = 40;   //绘制的头像高度
    var avatarurl_x = 168;   //绘制的头像在画布上的位置
    var avatarurl_y = 23;   //绘制的头像在画布上的位置
    var qrPath;

    //绘制背景
    wx.downloadFile({
      url: beijing, //仅为示例，并非真实的资源
      success: function (res) {
        ctx.drawImage(res.tempFilePath, 0, 0, 375, 603)
        ctx.draw(true)

        //用户的二维码
        wx.downloadFile({
          url: openid, //仅为示例，并非真实的资源
          success: function (res) {
            ctx.drawImage(res.tempFilePath, 260, 520, 77, 77)
            ctx.draw(true)
          }
        })
      }
    })

    wx.hideLoading();
  },

  //保存图片
  baocun: function () {
    wx.showLoading({ title: "图片保存中", mask: true });
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 1206,
      destWidth: 3000,
      destHeight: 4800,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res)

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.hideLoading();
            console.log(res);
            wx.showToast({
              title: '成功保存到相册',
              icon: 'success',
              duration: 1000
            });
          }
        })
        wx.hideLoading();
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading();
      }
    })
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
  bindlongtap: function () {

    wx.showModal({
      title: '提示',
      content: '确定保存图片?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({ title: "图片保存中", mask: true });
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 750,
            height: 1206,
            destWidth: 3000,
            destHeight: 4800,
            canvasId: 'myCanvas',
            success: function (res) {
              console.log(res)
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) {
                  wx.hideLoading();
                  console.log(res);
                  wx.showToast({
                    title: '成功保存到相册',
                    icon: 'success',
                    duration: 1000
                  });
                }
              })
              wx.hideLoading();
            },
            fail: function (res) {
              console.log(res)
              wx.hideLoading();
            }
          })
        }
      }
    })

  },


})