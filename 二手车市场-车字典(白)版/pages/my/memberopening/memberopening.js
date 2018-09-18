// pages/my/memberopening/memberopening.js
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList:'',
    huiyuanka:'http://www.levau.com/member/putongka.png',
    putong:true,
    huangjin:false,
    zhuanshiyue:false,
    zhuanshinian:false,
    heika:false,
    chongzhi198:false,
    chongzhi298:false,
    chongzhi98: false,
    chongzhi388: false,
    jinge:288,

    src1:'/images/icon/putong.png',
    src2: '/images/icon/huangjin.png',
    src3: '/images/icon/zhuanshi.png',
    src4: '/images/icon/zhuanshi.png',
    src5: '/images/icon/heikahuiyuan.png',
    src6: '/images/icon/chongzhi.png',
    src7: '/images/icon/chongzhi.png',

    cardId:'',
    title:'',
    cardtype: 1,//  1新  3换

    list_jinqian:[
      '6.6', '15', '21.8', '50', '100','150'
    ],
    jinqian_input_value:'',//任意金额输入框

    vehicleId:'',//车辆设置有偿转发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.getStorageSync('isphone')) {//数据库里有手机号 则不显示
      that.setData({
        flag: false,
      });
    } else {
      that.setData({//数据库里没有手机号 则显示
        flag: true,
      })
      
    }
    if (options.type){
      that.setData({
        cardtype: options.type
      })
    }
    if (options.vehicleId){
      that.setData({
        vehicleId: options.vehicleId
      })
    }
    url.ajaxPost(false, url.member_cardList, {}, function (data) {
      console.log("会员卡列表:", data);
      for (var i = 0; i < data.result.cardList.length; i++) {
        var sp = data.result.cardList[i].description.split('，');
        data.result.cardList[i].description0 = sp[0];
        data.result.cardList[i].description1 = sp[1];
      }
      if (data.result.cardList[0].id == 1){
        that.setData({
          putong: true,
          huiyuanka: 'http://www.levau.com/member/putongka.png',
        })
      } else if (data.result.cardList[0].id == 2){
        that.setData({
          huangjin: true,
          huiyuanka: 'http://www.levau.com/member/huangjinka.png',
        })
      } else if (data.result.cardList[0].id == 3) {
        that.setData({
          zhuanshiyue: true,
          huiyuanka: 'http://www.levau.com/member/zhuanshiyueka.png',
        })
      } else if (data.result.cardList[0].id == 4) {
        that.setData({
          zhuanshinian: true,
          huiyuanka: 'http://www.levau.com/member/zhuanshinianka.png',
        })
      } else if (data.result.cardList[0].id == 5) {
        that.setData({
          heika: true,
          huiyuanka: 'http://www.levau.com/member/heika.png',
        })
      } else if (data.result.cardList[0].id == 6) {
        that.setData({
          chongzhi198: true,
          huiyuanka: 'http://www.levau.com/member/198.png',
        })
      } else if (data.result.cardList[0].id == 7) {
        that.setData({
          chongzhi298: true,
          huiyuanka: 'http://www.levau.com/member/298.png',
        })
      }
      
      that.setData({
        cardList: data.result.cardList,
        cardId: data.result.cardList[0].id,
        title: data.result.cardList[0].title
      })
      console.log(that.data.cardList);
    });
  },

  

  //普通会员
  putong:function(e){
    console.log(e);
    var that = this;
    if (e.currentTarget.dataset.cardid==1){
      that.setData({
        huiyuanka: 'http://www.levau.com/member/putongka.png',
        putong: true,
        huangjin: false,
        zhuanshiyue: false,
        zhuanshinian: false,
        heika: false,
        chongzhi198: false,
        chongzhi298: false,
        chongzhi198:false,
        chongzhi298:false,
        chongzhi98: false,
        chongzhi388: false,
        cardId: e.currentTarget.dataset.cardid,
        title: e.currentTarget.dataset.title
      })
    } else if (e.currentTarget.dataset.cardid == 2) {
      that.setData({
        huiyuanka: 'http://www.levau.com/member/huangjinka.png',
        putong: false,
        huangjin: true,
        zhuanshiyue: false,
        zhuanshinian: false,
        heika: false,
        chongzhi198: false,
        chongzhi298: false,
        chongzhi98: false,
        chongzhi388: false,
        cardId: e.currentTarget.dataset.cardid,
        title: e.currentTarget.dataset.title
      })
    } else if (e.currentTarget.dataset.cardid == 3) {
      that.setData({
        huiyuanka: 'http://www.levau.com/member/zhuanshiyueka.png',
        putong: false,
        huangjin: false,
        zhuanshiyue: true,
        zhuanshinian: false,
        heika: false,
        chongzhi198: false,
        chongzhi298: false,
        chongzhi98: false,
        chongzhi388: false,
        cardId: e.currentTarget.dataset.cardid,
        title: e.currentTarget.dataset.title
      })
    } else if (e.currentTarget.dataset.cardid == 4) {
      that.setData({
        huiyuanka: 'http://www.levau.com/member/zhuanshinianka.png',
        putong: false,
        huangjin: false,
        zhuanshiyue: false,
        zhuanshinian: true,
        heika: false,
        chongzhi198: false,
        chongzhi298: false,
        chongzhi98: false,
        chongzhi388: false,
        cardId: e.currentTarget.dataset.cardid,
        title: e.currentTarget.dataset.title
      })
    } else if (e.currentTarget.dataset.cardid == 5) {
      that.setData({
        huiyuanka: 'http://www.levau.com/member/heika.png',
        putong: false,
        huangjin: false,
        zhuanshiyue: false,
        zhuanshinian: false,
        heika: true,
        chongzhi198: false,
        chongzhi298: false,
        chongzhi98: false,
        chongzhi388: false,
        cardId: e.currentTarget.dataset.cardid,
        title: e.currentTarget.dataset.title
      })
    } else if (e.currentTarget.dataset.cardid == 6) {
      that.setData({
        huiyuanka: 'http://www.levau.com/member/198.png',
        putong: false,
        huangjin: false,
        zhuanshiyue: false,
        zhuanshinian: false,
        heika: false,
        chongzhi198: true,
        chongzhi298: false,
        chongzhi98: false,
        chongzhi388: false,
        cardId: e.currentTarget.dataset.cardid,
        title: e.currentTarget.dataset.title
      })
    } else if (e.currentTarget.dataset.cardid == 7) {
      that.setData({
        huiyuanka: 'http://www.levau.com/member/298.png',
        putong: false,
        huangjin: false,
        zhuanshiyue: false,
        zhuanshinian: false,
        heika: false,
        chongzhi198: false,
        chongzhi298: true,
        chongzhi98: false,
        chongzhi388: false,
        cardId: e.currentTarget.dataset.cardid,
        title: e.currentTarget.dataset.title
      })
    } else if (e.currentTarget.dataset.cardid == 8) {
      that.setData({
        huiyuanka: 'http://www.levau.com/member/98.png',
        putong: false,
        huangjin: false,
        zhuanshiyue: false,
        zhuanshinian: false,
        heika: false,
        chongzhi198: false,
        chongzhi298: false,
        chongzhi98: true,
        chongzhi388: false,
        cardId: e.currentTarget.dataset.cardid,
        title: e.currentTarget.dataset.title
      })
    } else if (e.currentTarget.dataset.cardid == 9) {
      that.setData({
        huiyuanka: 'http://www.levau.com/member/388.png',
        putong: false,
        huangjin: false,
        zhuanshiyue: false,
        zhuanshinian: false,
        heika: false,
        chongzhi198: false,
        chongzhi298: false,
        chongzhi98: false,
        chongzhi388: true,
        cardId: e.currentTarget.dataset.cardid,
        title: e.currentTarget.dataset.title
      })
    }

    
  },

  //确定开通
  quedingkaitong:function(){
    // util.showToast('敬请期待', 'error');
    var that = this;
    if (that.data.jinqian_input_value == ''){
      console.log('输入金额为空');
      
    }else{
      console.log('你当前输入金额为:' + that.data.jinqian_input_value);
      that.gongzhong(that.data.jinqian_input_value);
      return;
    }

    console.log('开通1，更换3',that.data.cardtype);
    var prompt = '确认开通' + that.data.title + '?';
    // if (that.data.cardtype == 3){
    //   prompt = '确认覆盖(取消)原有的会员,更换成' + that.data.title+'吗?覆盖原有的会员将不存在'
    // }
    wx.showModal({
      title: '提示',
      content: prompt,
      success: function (res) {
        if (res.confirm) {

          wx.showLoading({
            title: "提交中"
          });

          url.ajaxGet(false, url.member_buy,
            {
              openId: app.globalData.openid,
              cardId: that.data.cardId,
              'type': that.data.cardtype,
            }, function (data) {
              console.log("新购会员:", data);
              wx.hideLoading();
              if (data.resultCode == 1) {
                var ss = data.result;
                //发起微信支付
                wx.requestPayment({
                  'timeStamp': ss.timeStamp,
                  'nonceStr': ss.nonceStr,
                  'package': ss.package_,
                  'signType': 'MD5',
                  'paySign': ss.sign,
                  'success': function (res) {
                    console.log("支付成功回掉：", res);
                    //wx.setStorageSync('package', data.data.package);
                    wx.showModal({
                      title: '提示',
                      content: '充值成功',
                      success: function (res) {
                        wx.switchTab({
                          url: '/pages/my/my',
                        })
                      }
                    })
                  }, 'fail': function (res) {
                    console.log(res);
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: data.resultMsg,
                  success: function (res) {
                  }
                })
              }
            });
      }
      }
    })
  },

  getPhoneNumber: function (e) {
    var that = this;
    that.setData({ flag: false })
    console.log(e.detail.errMsg)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == 'getPhoneNumber:fail:cancel to confirm login') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
         
        }
      })
    } else {

      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) {
          wx.navigateTo({
            url: "../my/my-rankings/my-rankings",
          });
          wx.setStorageSync('isphone', true)//本地存是否有手机号信息
          wx.request({
            url: url.phone,
            data: {
              'encryptedData': e.detail.encryptedData,
              'iv': e.detail.iv,
              'sessionKey': app.globalData.session_key,
              'openId': app.globalData.openid,
              //'location': app.globalData.location
            },
            success: function (data) {
              console.log('获取手机号', data);
            }
          })
        }
      })
    }
  },

  jinqian:function(e){
    this.gongzhong(e.currentTarget.dataset.jinqian);
  },

  bindinput:function(e){
    this.setData({
      jinqian_input_value:e.detail.value
    });
  },

  gongzhong: function (price){
    wx.showModal({
      title: '提示',
      content: '充值' + price + '?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: "提交中"
          });
          url.ajaxGet(false, url.recharge,
            {
              openId: app.globalData.openid,
              price: price
            }, function (data) {
              console.log("充值回掉:", data);
              wx.hideLoading();
              if (data.resultCode == 1) {
                var ss = data.result;
                //发起微信支付
                wx.requestPayment({
                  'timeStamp': ss.timeStamp,
                  'nonceStr': ss.nonceStr,
                  'package': ss.package_,
                  'signType': 'MD5',
                  'paySign': ss.sign,
                  'success': function (res) {
                    console.log("支付成功回掉：", res);
                    //wx.setStorageSync('package', data.data.package);
                    wx.showModal({
                      title: '提示',
                      content: '充值成功',
                      success: function (res) {
                        //充值成功后重置余额
                        app.globalData.balance = app.globalData.balance + price
                        if (vehicleId != ''){
                          wx.navigateBack({
                            delta:1
                          })
                        }else {
                          wx.switchTab({
                            url: '/pages/my/my',
                          })
                        }
                        
                      }
                    })
                  }, 'fail': function (res) {
                    console.log(res);
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: data.resultMsg,
                  success: function (res) {
                  }
                })
              }
            });
        }
      }
    })
  },

  
})