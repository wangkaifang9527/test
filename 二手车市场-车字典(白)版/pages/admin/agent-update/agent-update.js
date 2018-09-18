//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

var area = require('../../../data/area.js');
var p = 0, c = 0, d = 0

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        name: "",
        phone: "",
        id:'',
        // 地址选择器 - - - - - - 
        provinceSelStr: "",
        provinceName: [],
        provinceCode: [],
        provinceSelIndex: '',

        citySelStr: "",
        cityName: [],
        cityCode: [],
        citySelIndex: '',

        districtSelStr: "",
        districtName: [],
        districtCode: [],
        districtSelIndex: '',
        showMessage: false,
        messageContent: '',
        showDistpicker: false
        // 地址选择器 - - - - - - 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()//隐藏转发按钮

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function (e) {
        var that = this;
        // 载入时要显示再隐藏一下才能显示数据，如果有解决方法可以在issue提一下，不胜感激:-)
        // 初始化数据
        this.setAreaData()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        var agent_detail = wx.getStorageSync('agent_detail');
        console.log("代理商详情缓存：", agent_detail);
        that.setData({
            id: agent_detail.id,
            name: agent_detail.name,
            phone: agent_detail.cellphoneNumber,
            provinceSelStr: agent_detail.province,
            citySelStr: agent_detail.city
        })
    },


    //提交表单
    formSubmit: function (e) {
        var that = this;
        var post_data = e.detail.value;
        var post_url = '';
        var tip_text = '';
        switch (e.detail.target.id) {//判断是哪个id的按钮
            case 'onEdit':
                post_url = url.admin_agent_edit_modify
                tip_text = '修改'
                break;
            case 'onDelete':
                post_url = url.admin_agent_reply_cancel
                tip_text = '删除'
                break;
        }
        var citys = post_data.city.split(" ");
        console.log(tip_text, 'form数据:', post_data, citys[0], citys[1], that.data.id);
        wx.showModal({
            title: '提示',
            content: '确认' + tip_text + '该代理商？',
            success: function (res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: "提交中"
                    });
                    //ajax
                    wx.request({
                      url: post_url,
                      data: { 
                        openId: app.globalData.openid,
                        id:that.data.id,
                        province: citys[0],
                        city: citys[1],
                        cellphoneNumber: post_data.phone
                       },
                      success: function (data) {
                        console.log("修改或者删除代理商回掉",data);
                        if (data.data.resultCode == 1){
                          util.showToast(tip_text + '成功', 'success', 800)
                          setTimeout(function () {
                            wx.navigateBack({
                              delta: 1
                            })
                          }, 800)
                        }else{
                          wx.hideLoading();
                          wx.showModal({
                            title: '提示',
                            content: data.data.resultMsg,
                          });
                        }
                       
                      }
                    })
                   
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                    return false;
                }
            }
        })
    },

    // 地址选择器 - - - - - - 
    // 设置area数据
    setAreaData: function (p, c, d) {
        var p = p || 0 // provinceSelIndex
        var c = c || 0 // citySelIndex
        var d = d || 0 // districtSelIndex
        // 设置省的数据
        var province = area['100000']
        var provinceName = [];
        var provinceCode = [];
        for (var item in province) {
            provinceName.push(province[item])
            provinceCode.push(item)
        }
        this.setData({
            // provinceSelStr: provinceName[p],
            provinceName: provinceName,
            provinceCode: provinceCode
        })
        // 设置市的数据
        var city = area[provinceCode[p]]
        var cityName = [];
        var cityCode = [];
        for (var item in city) {
            cityName.push(city[item])
            cityCode.push(item)
        }
        this.setData({
            // citySelStr: cityName[c],
            cityName: cityName,
            cityCode: cityCode
        })
        // 设置区的数据
        var district = area[cityCode[c]]
        var districtName = [];
        var districtCode = [];
        for (var item in district) {
            districtName.push(district[item])
            districtCode.push(item)
        }
        this.setData({
            // districtSelStr: districtName[d],
            districtName: districtName,
            districtCode: districtCode
        })
        console.log(provinceName[p], cityName[c], districtName[d])
    },
    // 选择地址
    changeArea: function (e) {
        p = e.detail.value[0]
        c = e.detail.value[1]
        d = e.detail.value[2]
        this.setAreaData(p, c, d)
    },
    // 显示
    showDistpicker: function () {
        this.setData({
            showDistpicker: true
        })
    },
    // 取消
    distpickerCancel: function () {
        this.setData({
            showDistpicker: false
        })
    },
    // 确定
    distpickerSure: function () {
        this.setData({
            provinceSelIndex: p,
            citySelIndex: c,
            districtSelIndex: d,
            provinceSelStr: this.data.provinceName[p],
            citySelStr: this.data.cityName[c],
            districtSelStr: this.data.provinceName[d],

        })
        this.distpickerCancel()
    },
    showMessage: function (text) {
        var that = this
        that.setData({
            showMessage: true,
            messageContent: text
        })
        setTimeout(function () {
            that.setData({
                showMessage: false,
                messageContent: ''
            })
        }, 3000)
    },

})