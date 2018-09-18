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
        name: "",
        phone: "",
        state: "确定",

        share_title: '查 一千次,送 一辈子',
        share_path: 'pages/my/agents-area/agents-area', 

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
        var that = this;
        // 载入时要显示再隐藏一下才能显示数据，如果有解决方法可以在issue提一下，不胜感激:-)
        // 初始化数据
        this.setAreaData()
        console.log("是否有用户信息", app.globalData.isGetUserInfo);
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
        wx.request({
          url: url.agent_myinfo,
          data: { openId: app.globalData.openid},
          success:function(data){
            console.log("服务器返回代理信息：", data);
            if (data.data.resultCode == 1){
              that.setData({
                phone: data.data.result.agent.cellphoneNumber,
                name: data.data.result.agent.name,
                provinceSelStr: data.data.result.agent.province,
                citySelStr: data.data.result.agent.city,
                state: data.data.result.agent.status
              })
            }
          }
        })
    },

   
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        var that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: that.data.share_title,
            path: that.data.share_path,
            // imageUrl: that.data.share.imageUrl,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },

    //提交表单
    formSubmit: function (e) {
        var that = this;
        if (that.data.state == '0') {
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
        var citys = post_data.city.split(" ");
        //提交表单，申请代理商
        wx.request({
          //url: 'http://localhost:8080/guohubao/v1/chewu/agent/apply',
          url: url.agent_apply,
          data:{
            openId: app.globalData.openid,
            name: post_data.name,
            cellphoneNumber: post_data.phone,
            province: citys[0],
            city: citys[1]
            
          },
          header: { 'charset':'utf-8'},
          method:'GET',
          success:function(data){
            console.log("代理商已提交申请",data);
            
            wx.showModal({
                title: '提示',
                content: data.data.resultMsg,
            })
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
        //console.log(e);
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

    //rule 默认同意
    onRuleUser: function () {
        wx.navigateTo({
            url: '../../rule/partner/partner'
        })
    }

})