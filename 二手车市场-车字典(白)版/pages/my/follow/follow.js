// pages/my/kefu/kefu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageurl: 'http://www.levau.com/kefu/follow.png'
  },

 
  //预览图片
  lookImg: function (e) {
    console.log('预览图片');
    //获取图片信息
    var that = this;
    var imgurl = that.data.imageurl;
    wx.previewImage({
      current: imgurl, // 当前显示图片的http链接
      urls: [imgurl] // 需要预览的图片http链接列表
    })

  },
  //长按保存图片
  saveImg: function (event) {
    console.log('长按保存图片', event);
    this.downloadImg();
    var imgurl = that.data.imageurl;
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
  //拨打客服
  bodakefu: function (e) {
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