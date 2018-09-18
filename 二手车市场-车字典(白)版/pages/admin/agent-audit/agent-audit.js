//获取应用实例 代理商审核
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

var count = 0;//加载页
var size = 20;//每页加载条数
var post_list_url = url.admin_agent_apply

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],//渲染数据
        isEmpty: true,//第一次为空
        isloading: false,//
        isloadover: false,//
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()//隐藏转发按钮
        var that = this;
        count = 0;
        wx.showLoading({ title: "提交中" });
        wx.request({
          //url: 'http://localhost:8080/guohubao/v1/chewu/admin/agent/apply',
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success:function(data){
            that.callbackData(data);
          }
        })
    },

 

 

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //审核
    onAudit: function (e) {
        
        var that=this
        var url_str = ''
        var status_str = ''
        var status = ''
        wx.showActionSheet({
            itemList: ['通过', '拒绝'],
            success: function (res) {
                if (res.tapIndex == 0) {
                    url_str = url.admin_agent_reply_audit
                    status_str = '已通过'
                    status = 1
                } else if (res.tapIndex == 1) {
                    url_str = url.admin_agent_reply_cancel
                    status_str = '已拒绝'
                    status = 2
                }else{
                    return;
                }
                console.log(e.currentTarget.dataset.id, e.currentTarget.dataset.i);
                wx.request({
                  //url: 'http://localhost:8080/guohubao/v1/chewu/admin/agent/reply',
                  url: url_str,
                  data: { openId: app.globalData.openid, 'id': e.currentTarget.dataset.id },
                  success: function (data) {
                    console.log("管理员审核代理商回掉",data);
                    util.showToast(status_str, 'success')
                    var datas = that.data.list;
                    datas[e.currentTarget.dataset.i].status = status;
                    datas[e.currentTarget.dataset.i].status_str = status_str;
                    that.setData({
                        list: datas
                    })
                  }
                })
            
            },
            fail: function (res) {
                // console.log(res.errMsg)
            }
        })
    },

    // 下拉刷新
    onPullDownRefresh: function () {
        console.log('下拉刷新');
        wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
        var that = this;
        this.setData({
            isloading: true,
            isloadover: false,
            isEmpty: true,
        });
        count = 0;//加载页
     
        wx.request({
          //url: 'http://localhost:8080/guohubao/v1/chewu/admin/agent/apply',
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
            wx.stopPullDownRefresh() //停止当前页面的下拉刷新。
            that.callbackData(data);
          }
        })
    },

    // 加载更多
    onReachBottom: function () {
        console.log('加载更多');

        var that = this;
        if (this.data.isloadover) {
            return false;
        }
     
        wx.request({
          //url: 'http://localhost:8080/guohubao/v1/chewu/admin/agent/apply',
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
            that.callbackData(data);
          }
        })

    },

    //回调数据
    callbackData: function (data) {
        var that = this;
        var datas = [];
        console.log('管理员获取所有代理商列表:', data)
        wx.hideLoading();
        if (data.data.resultCode != 1) {
          that.setData({
            isloadover: true
          });
          console.log('未初始化完或者非法进入');
          return;
        }
        data.list = data.data.result.agentList;
        if (data.list.length == size) {
            // console.log('持续加载');
        } else {
            that.setData({
                isloadover: true
            });
            console.log('所有数据加载完毕');
        }
        if (data.list.length > 0) {
            for (var i = 0; i < data.list.length; i++) {
              data.list[i].time_long = util.toDate(data.list[i].applyTime, 'YMDhms');
            }
        }
        if (!that.data.isEmpty) {
            // console.log('非第一次加载');
            datas = that.data.list.concat(data.list);//连接多个数组
        } else {
            console.log('初次加载');
            datas = data.list;
            that.setData({
                isEmpty: false
            });
        }
        console.log('列表数据:', datas);
        //更新数据
        that.setData({
            list: datas,
            isloading: false
        });
        wx.hideNavigationBarLoading() //隐藏导航条加载动画。

    },
})