// pages/market/search/search.js
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lishi_list: ['路虎', '奔驰', '奥迪', '宝马', '保时捷', '大众'],
    remen_list: ['奥迪', '宝马', '奔驰', '本田', 'Jeep', '沪C', '鲁B', '浙B', '抵押车', '过户车'],
    inputValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var lishi_list = wx.getStorageSync("lishi");
    var sort = [];
    for (var i = 0; i < lishi_list.length; i++) {
      sort.push(lishi_list[lishi_list.length - 1 - i]);
    }
    console.log(sort);
    this.setData({
      lishi_list: sort
    });
  },

 
  bindconfirm: function(){
    this.search()
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //搜索按钮
  search: function () {
    var inputValue = this.data.inputValue;
    if (inputValue == '') {
      util.showToast('请输入关键字', 'error');
      return
    }

    var lishi_list = wx.getStorageSync("lishi");
    if (lishi_list.length == 0) {
      lishi_list = [];
      lishi_list.push(inputValue);
    } else if (lishi_list.length > 8) {
      lishi_list.splice(0, 1)
      lishi_list.push(inputValue);
    } else {
      lishi_list.push(inputValue);
    }
    console.log(lishi_list);
    wx.setStorageSync("lishi", lishi_list);
    var sort = [];
    for (var i = 0; i < lishi_list.length; i++) {
      sort.push(lishi_list[lishi_list.length - 1 - i]);
    }
    console.log(sort);
    this.setData({
      lishi_list: sort
    });
    wx.setStorageSync('vehicleSearch', inputValue);
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  //历史搜索
  lishi: function (e) {
    console.log(e);
    wx.setStorageSync('vehicleSearch', e.currentTarget.dataset.name);
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //热门搜索
  remen: function (e) {
    console.log(e.currentTarget.dataset.name);
    wx.setStorageSync('vehicleSearch', e.currentTarget.dataset.name);
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})