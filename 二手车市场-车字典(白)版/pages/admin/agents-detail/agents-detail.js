//获取应用实例

//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
var model = require('../../../model/city/city.js')

var show = false;
var cityData = {};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {
            state: "确定",
        },
        cityData: {
            show: show,
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()//隐藏转发按钮
        var that = this;
        url.ajaxPost('needtoken', url.agent_myinfo, {}, function (data) {
            console.log("服务器返回代理信息：", data);
            var city_arr = data.info.city.split(" ");
            data.info.province = city_arr[0];
            data.info.city = city_arr[1];
            that.setData({
                info: data.info
            })
        }, function (data) {
            console.log(data);
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var that = this;
        //请求数据
        model.updateAreaData(that, 0, e);
    },

    //提交表单
    formSubmit: function (e) {
        var that = this;
        if (that.data.info.state == '申请中') {
            wx.showModal({
                title: '提示',
                content: '申请审核中，请耐心等待～',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
            return;
        }
        var post_data = e.detail.value;
        console.log('form发生了submit事件，携带数据为：', post_data)
        if (post_data.name == '') {
            util.showToast("请输入姓名", "error");
            return;
        }
        if (post_data.phone == '') {
            util.showToast("请输入电话", "error");
            return;
        }
        if (post_data.city.length < 2) {
            util.showToast("请选择地区", "error");
            return;
        }
        url.ajaxPost('needtoken', url.agent_apply, post_data, function (data) {
            console.log(data);
            wx.showModal({
                title: '提示',
                content: '已提交申请，请耐心等待审核～',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }, function (data) {

        })
    },


    //---------- 三级联动 ----------
    //点击选择城市按钮显示picker-view
    translate: function (e) {
        model.animationEvents(this, 0, true, 400);
    },
    //隐藏picker-view
    hiddenFloatView: function (e) {
        model.animationEvents(this, 200, false, 400);
    },
    //滑动事件
    bindChange: function (e) {
        model.updateAreaData(this, 1, e);
        cityData = this.data.cityData;
        this.setData({
            province: cityData.provinces[cityData.value[0]].name,
            city: cityData.citys[cityData.value[1]].name,
            county: cityData.countys[cityData.value[2]].name
        });
    },

})