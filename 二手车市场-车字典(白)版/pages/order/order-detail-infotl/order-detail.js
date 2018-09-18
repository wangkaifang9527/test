//获取应用实例
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");

var code = {
  "variety": {
    "01": "大型汽车",
    "02": "小型汽车",
    "03": "使馆汽车",
    "04": "领馆汽车",
    "05": "境外汽车",
    "06": "外籍汽车",
    "07": "普通摩托车",
    "08": "轻便摩托车",
    "09": "使馆摩托车",
    "10": "领馆摩托车",
    "11": "境外摩托车",
    "12": "外籍摩托车",
    "13": "低速车",
    "14": "拖拉机",
    "15": "挂车",
    "16": "教练汽车",
    "17": "教练摩托车",
    "20": "临时入境汽车",
    "21": "临时入境摩托车",
    "22": "临时行驶车",
    "23": "警用汽车",
    "24": "警用摩托"
  },
  "vehicletype": {
    "B11": "重型普通半挂车",
    "B12": "重型厢式半挂车",
    "B13": "重型罐式半挂车",
    "B14": "重型平板半挂车",
    "B15": "重型集装箱半挂车",
    "B16": "重型自卸半挂车",
    "B17": "重型特殊结构半挂车",
    "B18": "重型仓栅式半挂车",
    "B19": "重型旅居半挂车",
    "B1A": "重型专项作业半挂车",
    "B1B": "重型低平板半挂车",
    "B21": "中型普通半挂车",
    "B22": "中型厢式半挂车",
    "B23": "中型罐式半挂车",
    "B24": "中型平板半挂车",
    "B25": "中型集装箱半挂车",
    "B26": "中型自卸半挂车",
    "B27": "中型特殊结构半挂车",
    "B28": "中型仓栅式半挂车",
    "B29": "中型旅居半挂车",
    "B2A": "中型专项作业半挂车",
    "B2B": "中型低平板半挂车",
    "B31": "轻型普通半挂车",
    "B32": "轻型厢式半挂车",
    "B33": "轻型罐式半挂车",
    "B34": "轻型平板半挂车",
    "B35": "轻型自卸半挂车",
    "B36": "轻型仓栅式半挂车",
    "B37": "轻型旅居半挂车",
    "B38": "轻型专项作业半挂车",
    "B39": "轻型低平板半挂车",
    "D11": "无轨电车",
    "D12": "有轨电车",
    "G11": "重型普通全挂车",
    "G12": "重型厢式全挂车",
    "G13": "重型罐式全挂车",
    "G14": "重型平板全挂车",
    "G15": "重型集装箱全挂车",
    "G16": "重型自卸全挂车",
    "G17": "重型仓栅式全挂车",
    "G18": "重型旅居全挂车",
    "G19": "重型专项作业全挂车",
    "G21": "中型普通全挂车",
    "G22": "中型厢式全挂车",
    "G23": "中型罐式全挂车",
    "G24": "中型平板全挂车",
    "G25": "中型集装箱全挂车",
    "G26": "中型自卸全挂车",
    "G27": "中型仓栅式全挂车",
    "G28": "中型旅居全挂车",
    "G29": "中型专项作业全挂车",
    "G31": "轻型普通全挂车",
    "G32": "轻型厢式全挂车",
    "G33": "轻型罐式全挂车",
    "G34": "轻型平板全挂车",
    "G35": "轻型自卸全挂车",
    "G36": "轻型仓栅式全挂车",
    "G37": "轻型旅居全挂车",
    "G38": "轻型专项作业全挂车",
    "H11": "重型普通货车",
    "H12": "重型厢式货车",
    "H13": "重型封闭货车",
    "H14": "重型罐式货车",
    "H15": "重型平板货车",
    "H16": "重型集装厢车",
    "H17": "重型自卸货车",
    "H18": "重型特殊结构货车",
    "H19": "重型仓栅式货车",
    "H21": "中型普通货车",
    "H22": "中型厢式货车",
    "H23": "中型封闭货车",
    "H24": "中型罐式货车",
    "H25": "中型平板货车",
    "H26": "中型集装厢车",
    "H27": "中型自卸货车",
    "H28": "中型特殊结构货车",
    "H29": "中型仓栅式货车",
    "H31": "轻型普通货车",
    "H32": "轻型厢式货车",
    "H33": "轻型封闭货车",
    "H34": "轻型罐式货车",
    "H35": "轻型平板货车",
    "H37": "轻型自卸货车",
    "H38": "轻型特殊结构货车",
    "H39": "轻型仓栅式货车",
    "H41": "微型普通货车",
    "H42": "微型厢式货车",
    "H43": "微型封闭货车",
    "H44": "微型罐式货车",
    "H45": "微型自卸货车",
    "H46": "微型特殊结构货车",
    "H47": "微型仓栅式货车",
    "H51": "普通低速货车",
    "H52": "厢式低速货车",
    "H53": "罐式低速货车",
    "H54": "自卸低速货车",
    "H55": "仓栅式低速货车",
    "J11": "轮式装载机械",
    "J12": "轮式挖掘机械",
    "J13": "轮式平地机械",
    "K11": "大型普通客车",
    "K12": "大型双层客车",
    "K13": "大型卧铺客车",
    "K14": "大型铰接客车",
    "K15": "大型越野客车",
    "K16": "大型轿车",
    "K17": "大型专用客车",
    "K18": "大型专用校车",
    "K21": "中型普通客车",
    "K22": "中型双层客车",
    "K23": "中型卧铺客车",
    "K24": "中型铰接客车",
    "K25": "中型越野客车",
    "K26": "中型轿车",
    "K27": "中型专用客车",
    "K28": "中型专用校车",
    "K31": "小型普通客车",
    "K32": "小型越野客车",
    "K33": "小型轿车",
    "K34": "小型专用客车",
    "K38": "小型专用校车",
    "K41": "微型普通客车",
    "K42": "微型越野客车",
    "K43": "微型轿车",
    "M11": "普通正三轮摩托车",
    "M12": "轻便正三轮摩托车",
    "M13": "正三轮载客摩托车",
    "M14": "正三轮载货摩托车",
    "M15": "侧三轮摩托车",
    "M21": "普通二轮摩托车",
    "M22": "轻便二轮摩托车",
    "N11": "三轮汽车",
    "Q11": "重型半挂牵引车",
    "Q12": "重型全挂牵引车",
    "Q21": "中型半挂牵引车",
    "Q22": "中型全挂牵引车",
    "Q31": "轻型半挂牵引车",
    "Q32": "轻型全挂牵引车",
    "T11": "大型轮式拖拉机",
    "T21": "小型轮式拖拉机",
    "T22": "手扶拖拉机",
    "T23": "手扶变形运输机",
    "X99": "其它",
    "Z11": "大型专项作业车",
    "Z21": "中型专项作业车",
    "Z31": "小型专项作业车",
    "Z41": "微型专项作业车",
    "Z51": "重型专项作业车",
    "Z71": "轻型专项作业车"
  },
  "color": {
    "A": "白",
    "B": "灰",
    "C": "黄",
    "D": "粉",
    "E": "红",
    "F": "紫",
    "G": "绿",
    "H": "蓝",
    "I": "棕",
    "J": "黑"
  },
  "properties": {
    "A": "非营运",
    "B": "公路客运",
    "C": "公交客运",
    "D": "出租客运",
    "E": "旅游客运",
    "F": "货运",
    "G": "租赁",
    "H": "警用",
    "I": "消防",
    "J": "救护",
    "K": "工程救险",
    "L": "营转非",
    "M": "出租转非",
    "N": "教练",
    "O": "幼儿校车",
    "P": "小学生校车",
    "Q": "初中生校车",
    "R": "危化品运输",
    "S": "中小学生校车"
  },
  "state": {
    "A": "正常",
    "B": "转出",
    "C": "被盗抢",
    "D": "停驶",
    "E": "注销",
    "G": "违法未处理",
    "H": "海关监管",
    "I": "事故未处理",
    "J": "嫌疑车",
    "K": "查封",
    "L": "暂扣",
    "M": "强制注销",
    "N": "事故逃逸",
    "O": "锁定",
    "P": "机动车达到报废标准，公告牌作废",
    "Q": "逾期未检验"
  },
  "fuel": {
    "A": "汽油",
    "B": "柴油",
    "C": "电驱动",
    "D": "混合油",
    "E": "天然气",
    "F": "液化石油气",
    "L": "甲醇",
    "M": "乙醇",
    "N": "太阳能",
    "O": "混合动力",
    "Y": "无",
    "Z": "其他"
  }
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    car: {},
    share_title: '车辆状态报告详情',
    share_path: 'pages/order/order-detail-infotl/order-detail',
    share: { imageUrl: '/images/icon/red-p-share.png' },

    open: false,//红包开关
    chai_open: false,//拆红包开关
    red_open: false,//红包消息
    red_title_open: false,//红包栏是否打开

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var red_title_open = false
    if (wx.getStorageSync("order-title-red")){
      red_title_open = true
    }
    that.setData({
      userInfo: app.globalData.userInfo,
      red_title_open: red_title_open
    })
    if (options.id) {
      that.setData({
        id: options.id
      })
      console.log("是否有用户信息", app.globalData.isGetUserInfo);
      if (!app.globalData.isGetUserInfo) {
        //获取用户登陆身份
        wx.showLoading({ title: "初始化", mask: true });
        app.getUserId(function (data) {
          wx.hideLoading()
          console.log('身份获取完毕');
          // 请求订单数据
          wx.request({
            url: url.order_detail2,
            data: { orderNo: options.id },
            success: function (data) {
              console.log('分享订单:', data);
              if (data.data.resultCode == 1) {
                var json = data.data.result.content;
                var redEnvelopeId = data.data.result.redEnvelopeId;//红包ID
                if (redEnvelopeId != undefined) {
                  that.setData({
                    redEnvelopeId: redEnvelopeId
                  })
                }
                that.callback(json);
              } else {
                util.showToast(data.data.resultMsg, 'error');
              }
            }
          })
        });
      } else {
        // 请求订单数据
        wx.request({
          url: url.order_detail2,
          data: { orderNo: options.id },
          success: function (data) {
            console.log('分享订单:', data);
            if (data.data.resultCode == 1) {
              var json = data.data.result.content;
              var redEnvelopeId = data.data.result.redEnvelopeId;//红包ID
              if (redEnvelopeId != undefined) {
                that.setData({
                  redEnvelopeId: redEnvelopeId
                })
              }
              that.callback(json);
            } else {
              util.showToast(data.data.resultMsg, 'error');
            }
          }
        })
      }
      return;
    }
    if (wx.getStorageSync('order_detail')) {
      var car_data = wx.getStorageSync('order_detail')
      console.log('缓存数据', car_data);
      that.setData({
        id: car_data.orderNo
      })
      wx.request({
        url: url.order_detail2,
        data: { orderNo: car_data.orderNo },
        success: function (data) {
          console.log('订单:', data);
          if (data.data.resultCode == 1) {
            var json = data.data.result.content;
            var redEnvelopeId = data.data.result.redEnvelopeId;//红包ID
            if (redEnvelopeId != undefined) {
              that.setData({
                redEnvelopeId: redEnvelopeId
              })
            }
            that.callback(json);
          } else {
            util.showToast(data.data.resultMsg, 'error');
          }
        }
      })
      return;
    }
  },

  //处理数据
  callback: function (car_data) {
    car_data = JSON.parse(car_data)
    var that = this;
    // 隐藏用户信息
    //car_data.data.itemData[11].itemPropValue = util.encryptionStr(car_data.data.itemData[11].itemPropValue, 1);
    that.setData({
      car: car_data.data.itemData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true,
    })
    var that = this;
    var title = that.data.share_title;
    var path = that.data.share_path + '?id=' + that.data.id;
    var imageUrl = '';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res);
      if (res.target.id == 'red_pag') {
        var nickName = app.globalData.userInfo.nickName;
        if (nickName.length > 6) {
          nickName = nickName.substring(0, 6)
        }
        title = '@"' + nickName + '" 送您了3个现金红包，确实是TMD真的！';
        path = 'pages/index/index';
        imageUrl = that.data.share.imageUrl;
        //红包ID
        if (that.data.redEnvelopeId != undefined && that.data.redEnvelopeId != ''){
          path = path + '?redEnvelopeId=' + that.data.redEnvelopeId
        }
      }
    }
    return {
      title: title,
      path: path ,
      imageUrl: imageUrl,
      success: function (res) {
        console.log(res);
        //判断是不是群
        if (that.data.redEnvelopeId == undefined || that.data.redEnvelopeId == ''){
          console.log("没有红包")
        }else if (res.shareTickets != null) {
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: function (res) {
              console.log('data', res, app.globalData.session_key);
              url.ajaxPost(false, url.redEnvelope_forward, {
                encryptedData: res.encryptedData,
                iv: res.iv,
                sessionKey: app.globalData.session_key,
                openId: app.globalData.openid,
                envelopeId: that.data.redEnvelopeId,
              }, function (data) {
                console.log("群ID 红包:", data);
                if(data.result.amount != undefined && data.result.amount != ''){
                  that.setData({
                    open: !that.data.open,
                    amount: data.result.amount
                  })
                }
                
              });
            }
          })
        }

      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //返回首页
  fanhui: function () {
    wx.navigateTo({
      url: '/pages/query/query',
    })
  },

  //生成报告
  bindReport: function(){
    var car_data = wx.getStorageSync('order_detail')
    var report = "http://www.levau.com/query-mould/info/info_tl.html?orderNo=" + car_data.orderNo
    wx.setClipboardData({
      data: report,
      success: function (res) {
        util.showToast("复制成功", "success", 500)
      }
    });
  },

  //拆红包
  onChai: function () {
    var that = this
    that.setData({
      chai_open: true
    })
    setTimeout(function () {
      that.setData({
        red_open: true
      })
    }, 2000)
  },
  //打开红包
  openRed: function () {
    this.setData({
      open: true
    })
  },
  closeRed: function () {
    this.setData({
      open: false
    })
  },
  //前往账户余额
  onGoBalance: function () {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  //点击红包栏 (打开)
  onOpenRedTitle: function () {
    this.setData({
      red_title_open: !this.data.red_title_open,
    })
  },
  //点击红包栏（关闭）
  onCloseRedTitle: function () {
    this.setData({
      red_title_open: !this.data.red_title_open,
    })
  },
})