//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

var count = 0;//加载页
var size = 20;//每页加载条数
var post_list_url = url.agent_order_list

Page({
    /**
     * 页面的初始数据
     */
    data: {
        orders: [],//渲染数据
        isEmpty: true,//第一次为空
        isloading: false,//
        isloadover: false,//
        prepay:'',
        src:'',
    },
   
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
      wx.hideShareMenu()//隐藏转发按钮
      var that = this;
      that.setData({
        orders: [],//渲染数据
        isEmpty: true,//第一次为空
        isloading: false,//
        isloadover: false,//
      })
      //ajax
      count = 0;
      wx.showLoading({ title: "提交中" });
      wx.request({
        url: post_list_url,
        data: { start: count, openId: app.globalData.openid },
        //data:{openId:'opUEC0VQPMo7DTPyiZ2uBdKEaovQ',start: count,},
        success: function (data) {
          console.log("list", data);
          that.callbackData(data);
        }
      })
    },

   
    // 下拉刷新
    onPullDownRefresh: function () {
        var that = this;
        console.log('下拉刷新');
        wx.showNavigationBarLoading();//在当前页面显示导航条加载动画。
        this.setData({
            isloading: true,
            isloadover: false,
            isEmpty: true,
        });
        count = 0;//加载页
        wx.request({
          //url: "http://localhost:8080/guohubao/v1/chewu/order/get",
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
            console.log("list", data);
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
        count++;
        wx.request({
          url: post_list_url,
          data: { start: count, openId: app.globalData.openid },
          success: function (data) {
            console.log("list", data);
            that.callbackData(data);
          }
        })
    },

    //回调数据
    callbackData: function (data) {
        console.log('回掉data:', data)
        var that = this;
        var orders_data = [];
        wx.hideLoading();
        if (data.data.resultCode!=1){
          that.setData({
            isloadover: true
          });
          console.log('未初始化完或者非法进入');
          return;
        }
        data.orders = data.data.result.orderList;
        if (data.orders.length == size) {
            // console.log('持续加载');
        } else {
            that.setData({
                isloadover: true
            });
            console.log('所有数据加载完毕');
        }
        if (data.orders.length > 0) {
            for (var i = 0; i < data.orders.length; i++) {
              var o = data.orders[i];
              o.time_long = util.toDate(o.queryTime, 'YMDhms');
              o.License = (o.licenseNo == '' || o.licenseNo == null) ? '无车牌号' : o.licenseNo;
              o.vin = (o.vin == '' || o.vin == null) ? '无车架号' : o.vin;
              o.brandimage = '';//车辆图标
              o.manufacturer = '';//车辆信息
              if (o.brand != null && o.brand != "") {
                o.brandimage = 'http://www.levau.com/LGO/' + o.brand + '.png'
                o.manufacturer = o.cartype
              }

              if (o.queryStatus == '待支付'){
                o.data_state_str = '待支付';
                o.state_code = 0;
              } else if (o.queryStatus == '查询中'){
                o.data_state_str = '查询中';
                o.state_code = 1;
              } else if (o.queryStatus == '查询成功') {
                o.data_state_str = '查询成功';
                o.state_code = 2;
              } else if (o.queryStatus == '退款中') {
                o.data_state_str = '退款中';
                o.state_code = 3;
              } else if (o.queryStatus == '退款成功') {
                o.data_state_str = '查询失败';
                o.state_code = 4;
              } else if (o.queryStatus == '无记录') {
                o.data_state_str = '无记录';
                o.state_code = 5;
              } else {
                o.data_state_str = '查询失败';
                o.state_code = 6;
              }

              switch (o.type) {
                    case 1010:
                  o.type_str = "维保查询";
                  o.type = "cbs";
                        break;
                    case 1011:
                  o.type_str = "维保查询";
                  o.type = "cbs2";
                      break;
                    case 1012:
                  o.type_str = "维保查询";
                  o.type = "cbstl";
                      break;
                    case 1013:
                  o.type_str = "维保查询";
                  o.type = "4s";
                    break;
                    case 1020:
                  o.type_str = "理赔查询";
                  o.type = "claim";
                        break;
                    case 1021:
                  o.type_str = "理赔查询";
                  o.type = "claimtl";
                        break;
                    case 1030:
                  o.type_str = "理赔查询";
                  o.type = "claim2";
                        break;
                    case 1040:
                  o.type_str = "保单查询";
                  o.type = "baodan";
                        break;
                    case 1041:
                  o.type_str = "保单查询";
                  o.type = "baodan2";
                        break;
                    case 1042:
                  o.type_str = "保单查询";
                  o.type = "baodantl";
                        break;
                    case 1050:
                  o.type_str = "车辆查询";
                  o.type = "info";
                        break;
                    case 1051:
                  o.type_str = "车辆查询";
                  o.type = "infotl";
                        break;
                    case 1060:
                  o.type_str = "状态在保";
                  o.type = "infobaodan";
                      break;
                   
                }
            }

            
        }
        if (!that.data.isEmpty) {
            // console.log('非第一次加载');
            orders_data = that.data.orders.concat(data.orders);//连接多个数组
        } else {
            // console.log('初次加载');
            orders_data = data.orders;
            that.setData({
                isEmpty: false
            });
        }
        console.log('列表数据:', orders_data);
        //更新数据
        that.setData({
            orders: orders_data,
            isloading: false
        });
        
        wx.hideNavigationBarLoading() //隐藏导航条加载动画。
    },

    //打开订单详情
    onHrefOrderDetail: function (e) {
        console.log("是否可以查看详情：", e.currentTarget.dataset.state);
        console.log("是否可以查看详情type：", e);
        if (e.currentTarget.dataset.state == 2) {
            wx.setStorageSync('order_detail', this.data.orders[e.currentTarget.dataset.i]);
            wx.navigateTo({
                url: '../order-detail-' + e.currentTarget.dataset.type + '/order-detail',
            })
        } else if (e.currentTarget.dataset.state == 0) {
          util.showToast("待支付", "error", 500)


        } else if (e.currentTarget.dataset.state == 1) {
            util.showToast("查询中", "error", 500)
            

        } else if (e.currentTarget.dataset.state == 3) {
          util.showToast("退款中", "error", 500)


        } else if (e.currentTarget.dataset.state == 5) {
          util.showToast("无记录", "error", 500)


        }else {
            //util.showToast("数据维护中", "error", 500)
          if (e.currentTarget.dataset.type == 'cbs2' ||e.currentTarget.dataset.type == 'cbs' || e.currentTarget.dataset.type=='4s'){
            wx.showModal({
              title: '数据维护中',
              content: '查询失败数据维护说明：由于近期部分品牌不稳定，如果失败可以找人工客服查询！咨询电话:15900902231',
              success: function (res) {
                if (res.confirm) {
                  wx.showModal({
                    title: '提示',
                    content: '确认拨打客服电话:' + '15900902231',
                    success: function (res) {
                      if (res.confirm) {
                        wx.makePhoneCall({
                          phoneNumber: '15900902231' //仅为示例，并非真实的电话号码
                        })
                      }
                    }
                  })
                }
              }
            })
          } else if (e.currentTarget.dataset.type == 'claim' || e.currentTarget.dataset.type == 'claim2'){
            wx.showModal({
              title: '数据维护中',
              content: '查询失败说明：出险记录没有的情况下有两种可能:1、该车没有出过任何险，2、保险公司没有上传数据，所以就没有给您调取到。请您认真核实车辆实际情况，咨询电话:15900902231',
              success: function (res) {
                if (res.confirm) {
                  wx.showModal({
                    title: '提示',
                    content: '确认拨打客服电话:' + '15900902231',
                    success: function (res) {
                      if (res.confirm) {
                        wx.makePhoneCall({
                          phoneNumber: '15900902231' //仅为示例，并非真实的电话号码
                        })
                      }
                    }
                  })
                }
              }
            })
          }else{
            wx.showModal({
              title: '数据维护中',
              content: '您可以咨询客服人员进行人工查询，咨询电话:15900902231',
              success: function (res) {
                if (res.confirm) {
                  wx.showModal({
                    title: '提示',
                    content: '确认拨打客服电话:' + '15900902231',
                    success: function (res) {
                      if (res.confirm) {
                        wx.makePhoneCall({
                          phoneNumber: '15900902231' //仅为示例，并非真实的电话号码
                        })
                      }
                    }
                  })
                }
              }
            })
          }
            
        }

    },
    //点击vin 并复制
    onvin: function (e) {
      console.log("vin", e);
      var self = this;
      wx.setClipboardData({
        data: e.currentTarget.dataset.vin,
        success: function (res) {
          util.showToast("vin复制成功", "success", 500)
        }
      });
    },

  //
  onRedP: function(){
    util.showToast("转发红包，即将上线", "success", 1000)
  },
    
    test1: function () {
        wx.navigateTo({
            url: "../order-detail-4s/order-detail?id=59dee6d782847c7138dd915a"
        })
    },
    test2: function () {
        wx.navigateTo({
            url: "../order-detail-claim/order-detail?id=59deea3a82847c0647e6775d"
        })
    }
    
})