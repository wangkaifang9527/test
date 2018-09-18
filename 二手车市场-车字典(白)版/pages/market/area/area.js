// pages/market/area/area.js
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
var city = require('../../../data/city.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    city: '',
    remen: [
      '北京市',
      '上海市',
      '天津市',
      '广州市',
      '深圳市',
      '杭州市',
      '苏州市',
      '南京市',
    ],
    location: '上海',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city: city,
    });
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取当前位置经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //console.log("获取当前经纬度：" + JSON.stringify(res));
        //发送请求通过经纬度反查地址信息
        var getAddressUrl = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key=33SBZ-PE3WU-YUEVI-2NUGJ-QTWV6-DNFIN&get_poi=1";
        url.ajaxGet(false, getAddressUrl, {}, function (res) {
          console.log("发送请求通过经纬度反查地址信息:", res);
          that.setData({
            location: res.result.ad_info.city
          });
        });
      }
    })

  },

 
 

 
 


  //选择城市
  xuanzechengshi: function (e) {
    var that = this;
    var city = that.data.city;
    var i = e.target.dataset.i;
    if (i == 0 || i == 1 || i == 8 || i == 21 || i == 31 || i == 32) {
      var area = city[100000][e.target.dataset.i].name;
      wx.setStorageSync("city", area)
      wx.switchTab({
        url: '/pages/index/index',
      })
      return;
    }
    if (e.target.dataset.flag) {
      city[100000][e.target.dataset.i].flag = false;
      that.setData({
        city: city,
      })
    } else {
      city[100000][e.target.dataset.i].flag = true;
      that.setData({
        city: city,
      })
    }

  },

  chengshi: function (e) {
    console.log(e);
    var city = e.currentTarget.dataset.city;
    wx.setStorageSync("city", city)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //热门城市点击
  remen: function (e) {
    var city = e.currentTarget.dataset.city;
    wx.setStorageSync("city", city)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //定位城市点击
  dingwei: function (e) {
    console.log(e);
    var city = e.currentTarget.dataset.city;
    wx.setStorageSync("city", city)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})