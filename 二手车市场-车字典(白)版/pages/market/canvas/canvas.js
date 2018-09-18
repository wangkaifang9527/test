// page/component/hello/hello.js
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
var QR = require("../../../utils/qrcode.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectArray: [
      { id: 5, unique: 'unique_5' },
      { id: 4, unique: 'unique_4' },
      { id: 3, unique: 'unique_3' },
      { id: 2, unique: 'unique_2' },
      { id: 1, unique: 'unique_1' },
      { id: 0, unique: 'unique_0' },
    ],
    numberArray: [1, 2, 3, 4],
    beijing: 'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com/haibao1',

    createQRCode: '',
    flag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ title: "图片生成中", mask: true });
    var that = this;
    if (options.id_) {

      url.ajaxPost(false, url.vehicle_createQRCode, {
        vehicleId: options.id_
      }, function (data) {
        console.log("车辆详情的二维码:", data);
        that.setData({
          createQRCode: data.result,
        });
        url.ajaxPost(false, url.vehicle_detail, {
          openId: app.globalData.openid,
          vehicleId: options.id_
        }, function (data) {
          console.log("车辆详细:", data);
          that.drawCanvas(data.result.vehicle)
        });

      });

    } else if (options.vehicleid) {//从详情进入 不需要获取二维码 要自己生成
      url.ajaxPost(false, url.vehicle_detail, {
        openId: app.globalData.openid,
        vehicleId: options.vehicleid
      }, function (data) {
        console.log("车辆详细:", data);
        that.setData({
          flag: true
        })
        that.drawCanvas(data.result.vehicle)

      });
    } else {

      url.ajaxPost(false, url.vehicle_createQRCode, {
        vehicleId: '5f4daeea934b4451bf01d05405be6551'
      }, function (data) {
        console.log("车辆详情的二维码:", data);
        that.setData({
          createQRCode: data.result,
        });
        url.ajaxPost(false, url.vehicle_detail, {
          openId: app.globalData.openid,
          vehicleId: '5f4daeea934b4451bf01d05405be6551'
          //vehicleId: "e29ed495b0cf4acca8557f1981503c1d"
        }, function (data) {
          console.log("车辆详细:", data);
          that.drawCanvas(data.result.vehicle)
        });
      });
    }
  },


  drawCanvas: function (vehicle) {
    wx.hideLoading();
    var that = this;
    var userInfo = app.globalData.userInfo //用户信息（头像和昵称）
    var openid = app.globalData.openid     //用户的openid 二维码推广
    var beijing = that.data.beijing        //背景图片
    var title = vehicle.title              //车辆标题
    var image = vehicle.images[0]          //车辆信息的第一张图片
    image = 'https://pic.chejiwei.com/' + image //+'?imageMogr2/auto-orient/crop/!1080x600a0a700'
    const ctx = wx.createCanvasContext('myCanvas')
    // var bgImg, vImg;
    var avatarurl_width = 40;    //绘制的头像宽度
    var avatarurl_heigth = 40;   //绘制的头像高度
    var avatarurl_x = 168;   //绘制的头像在画布上的位置
    var avatarurl_y = 23;   //绘制的头像在画布上的位置
    var qrPath;

    //绘制背景
    // wx.downloadFile({
    //   url: beijing, //仅为示例，并非真实的资源
    //   success: function (res) {
    //     ctx.drawImage(res.tempFilePath, 0, 0, 375, 603)
    //     ctx.draw(true)



    //用户头像
    // wx.downloadFile({
    //   url: userInfo.avatarUrl, //仅为示例，并非真实的资源
    //   success: function (res) {
    //     ctx.save()
    //     ctx.beginPath()
    //     ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, true);
    //     ctx.clip()
    //     ctx.drawImage(res.tempFilePath, avatarurl_x, avatarurl_y, 41, 41)
    //     ctx.restore()
    //     ctx.draw(true)
    //   }
    // })


    //车辆信息
    wx.downloadFile({
      url: image, //仅为示例，并非真实的资源
      success: function (res) {
        console.log('res', res);
        wx.getImageInfo({
          src: res.tempFilePath,
          success: function (res1) {
            var sHeight = res1.height;//源图像的矩形选择框的高度
            var sWidth = res1.width;//源图像的矩形选择框的宽度
            console.log(res1, sHeight < sHeight, sHeight > sHeight)

            var dWidth = 375;
            var dHeigt = 211;//在目标画布上绘制图像的高度允许对绘制的图像缩放
            sHeight = sWidth / (dWidth / 211);//560
            var sy = (res1.height - sHeight) / 2
            ctx.drawImage(res.tempFilePath, 0, sy, sWidth, sHeight, 0, 0, dWidth, dHeigt)
            ctx.draw(true)

            // if (sHeight > sWidth) {//长图处理
            //   var dWidth = 375;
            //   var dHeigt = 250;
            //   sHeight = sWidth / (dWidth / 250);
            //   var sy = (res1.height - sHeight)/2
            //   console.log('长图处理');
            //   ctx.drawImage(res.tempFilePath, 0, sy, sWidth, sHeight, 0, 180, dWidth, dHeigt)
            //   ctx.draw(true)
            // }

          }
        })
      }
    })

    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, 375, 667)
    ctx.draw()
    ctx.setTextAlign('left')
    ctx.setFillStyle('#111111')
    // ctx.setFontSize(14)
    // ctx.fillText(userInfo.nickName, 0, 88)//昵称

    ctx.setFontSize(21)
    if (title.length > 25) {
      title = title.substring(0, 25) + '...';
    }
    ctx.fillText(title, 12.5, 235)//车辆标题
    ctx.fillText(vehicle.price + '万元', 140, 260)
    ctx.setFontSize(15)
    ctx.fillText('一口价/车主要价:', 10, 258)
    ctx.fillText('【上牌日期】', 5, 288)
    ctx.fillText('【牌照辖区】', 5, 318)
    ctx.fillText('【真实公里】', 5, 348)
    ctx.fillText('【车况信息】', 5, 378)
    ctx.fillText('【车辆所在地】', 5, 408)
    ctx.fillText('【联系方式】', 5, 438)
    ctx.fillText('【车源详情】请识别二维码', 5, 478)

    ctx.fillText(vehicle.licenseDate, 120, 288)
    ctx.fillText(vehicle.licenseLocation, 120, 318)
    ctx.fillText(vehicle.mileage + '万', 120, 348)
    vehicle.briefs = vehicle.brief.split("#");
    
    ctx.fillText('', 120, 378)
    ctx.fillText(vehicle.location, 120, 408)
    ctx.fillText(vehicle.cellphoneNumber, 120, 438)
  
    ctx.setFontSize(12)
    ctx.setFillStyle('#999999')
    ctx.fillText('认真阅读群规，有序开展业务。', 110, 545)
    ctx.fillText('模版技术支持“二手车市场”小程序',110, 565)

    if (that.data.flag) {
      var str = 'https://www.chejiwei.com?openId=' + app.globalData.openid + '#' + vehicle.id;
      QR.api.draw(str, 'myCanvas', 5, 500, 100, 100)
    } else {
      //用户的二维码
      wx.downloadFile({
        url: that.data.createQRCode, //仅为示例，并非真实的资源
        success: function (res) {
          ctx.drawImage(res.tempFilePath, 5, 550, 48, 48)
          ctx.draw(true)
        }
      })
    }




    //}
    //})

    wx.hideLoading();
  },

  //预览图片
  lookImg: function (e) {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 375,
      height: 667,
      destWidth: 1500,
      destHeight: 2668,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res);
        var urls = [];
        urls.push(res.tempFilePath);
        wx.previewImage({
          current: res.tempFilePath, // 当前显示图片的http链接
          urls: urls// 需要预览的图片http链接列表
        })

        wx.hideLoading();
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading();
      }
    })
  },
  //保存图片
  baocun: function () {
    wx.showLoading({ title: "图片保存中", mask: true });
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 375,
      height: 603,
      destWidth: 3000,
      destHeight: 4800,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res);
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
            width: 375,
            height: 603,
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