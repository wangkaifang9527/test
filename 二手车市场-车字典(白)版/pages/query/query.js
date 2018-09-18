// pages/query/query.js
var app = getApp();
var url = require("../../utils/url.js");//服务列表
var util = require("../../utils/util.js");
// var brand = require("../../data/brand.js");
// var factory = require("../../data/factory.js");

var olddistance = 0;  //这个是上一次两个手指的距离
var newdistance;      //本次两手指之间的距离，两个一减咱们就知道了滑动了多少，以及放大还是缩小（正负嘛）
var oldscale = 1;     //这个是上一次动作留下的比例
var diffdistance;     //这个是新的比例，新的比例一定是建立在旧的比例上面的，给人一种连续的假象
var baseHeight;       //上一次触摸完之后的高
var baseWidth;        //上一次触摸完之后的宽
var windowWidth = 0;  //咱们屏幕的宽
var windowHeight = 0; //咱们屏幕的高


Page({

  /**
   * 页面的初始数据
   */
  data: {
    shanchutupian:[],
    picker_cartype_arr: [],//picker中range属性值
    picker_cartype_index: 0,//picker中value属性值
    cartypeData: [{
      id: "02",
      name: "小型汽车"
    }, {
      id: "01",
      name: "大型汽车"
    }, {
      id: "03",
      name: "使馆汽车"
    }, {
      id: "04",
      name: "领馆汽车"
    }, {
      id: "05",
      name: "境外汽车"
    }, {
      id: "06",
      name: "外籍汽车"
    }, {
      id: "07",
      name: "普通摩托车"
    }, {
      id: "08",
      name: "轻便摩托车"
    }, {
      id: "09",
      name: "使馆摩托车"
    }, {
      id: "10",
      name: "领馆摩托车"
    }, {
      id: "11",
      name: "境外摩托车"
    }, {
      id: "12",
      name: "外籍摩托车"
    }, {
      id: "13",
      name: "低速车"
    }, {
      id: "14",
      name: "拖拉机"
    }, {
      id: "15",
      name: "挂车"
    }, {
      id: "16",
      name: "教练汽车"
    }, {
      id: "17",
      name: "教练摩托车"
    }, {
      id: "20",
      name: "临时入境汽车"
    }, {
      id: "21",
      name: "临时入境摩托车"
    }, {
      id: "22",
      name: "临时行驶车"
    }, {
      id: "23",
      name: "警用汽车"
    }, {
      id: "24",
      name: "警用摩托"
    }],

    priceType: true,//默认支付类型
    modelType: false,//默认车模支付
    payType: 1, //1.余额支付，2.车模支付
    payflag: true,//支付的遮罩，开关
    flag: false,//不显示 获取手机号

    open:false,//是否打开选择品牌
    factory_flag:false, //

    brand: {
      "brandName": "选择车型(仅4S查询需选择车型)",
    },
    factory: {
      "brandFactoryName": "",
    },

    toView:'#',
    letter_list: [
      { 'name': 'A', '': false },
      { 'name': 'B', '': false },
      { 'name': 'C', '': false },
      { 'name': 'D', '': false },
      { 'name': 'E', '': false },
      { 'name': 'F', '': false },
      { 'name': 'G', '': false },
      { 'name': 'H', '': false },
      { 'name': 'R', '': false },
      { 'name': 'J', '': false },
      { 'name': 'K', '': false },
      { 'name': 'L', '': false },
      { 'name': 'M', '': false },
      { 'name': 'N', '': false },
      { 'name': 'O', '': false },
      { 'name': 'P', '': false },
      { 'name': 'Q', '': false },
      { 'name': 'R', '': false },
      { 'name': 'S', '': false },
      { 'name': 'U', '': false },
      { 'name': 'V', '': false },
      { 'name': 'W', '': false },
      { 'name': 'X', '': false },
      { 'name': 'Y', '': false },
      { 'name': 'Z', '': false },
    ],

    share_title: '微信里的二手车市场 ，朋友圈的车源都发这！',
    share_path: 'pages/query/query',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //1.获取系统信息的同步方法，我用了异步里面提示我this.setData错了
    var res = wx.getSystemInfoSync();  
    windowWidth = res.windowWidth;
    windowHeight = res.windowHeight;
    //2.获取汽车品牌brand 和 生产工厂factory
    //this.getBrandAndFactory();
    
    // 3.请求banner
    url.ajaxPost(false, url.banner2, {}, function (data) {
      console.log("服务器返回banner:", data);
      that.setData({
        banners: data.result.bannerList,
      })
    });
    //请求品牌
    url.ajaxPost(false, url.query_getBrandList, {}, function (data) {
      console.log("车辆品牌:", data);
      that.getBrandAndFactory(data);
    });
    url.ajaxPost(false, url.query_getFactoryList, {}, function (data) {
      console.log("车辆生产工厂:", data);
      that.setData({
        factory_list: data.result.factoryList.data
      })

    });

    if(options.openid){
      //获取用户登陆身份
      wx.showLoading({ title: "初始化", mask: true });
      app.getUserId(function (data) {
        wx.hideLoading();
        //that.callBackgetUserId(options, data);
      });
    }

    var picker_cartype_arr = [],
      cartype_id_arr = [];
    that.data.cartypeData.forEach(function (e) {
      picker_cartype_arr.push(e.name);
      cartype_id_arr.push(e.id);
    })
    that.setData({
      picker_cartype_arr: picker_cartype_arr,
      cartype_id_arr: cartype_id_arr
    });

    //如果用户是用分享页面过来的时候 需要登陆
    if(app.globalData.openid == null){
      app.getUserId(function (data) {
        wx.hideLoading();
      });
    }
  },

  onShareAppMessage: function (res) {
    var that = this;
    console.log('res', res);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log('来自页面内转发按钮', res.target)
    }
    return {
      title: that.data.share_title,
      path: that.data.share_path + '?openid=' + app.globalData.openid,
      // imageUrl: that.data.share.imageUrl,
      success: function (res) {
        console.log(app.globalData.openid);
      },
      fail: function (res) {
        // 转发失败
      }
    }

  },

  scrollTopFun:function(e){
    // console.log(e)
    // console.log(this.data.toView)
  },
  //选择字母
  onLetter: function(e){
    var that = this
    var letter_list = that.data.letter_list
    var index = e.currentTarget.dataset.i
    for (var i = 0; i < letter_list.length; i++ ){
      if (index == i){
        letter_list[i].flag = true
      }else{
        letter_list[i].flag = false
      }
    }
    console.log(letter_list[index].name);
    that.setData({
      letter_list: letter_list,
      toView: letter_list[index].name
    })
  },
  //获取汽车品牌brand 和 生产工厂factory
  getBrandAndFactory(data){
    var that = this;
    var brand_list = data.result.brandList.data;
    var brand_A = [{ id: 'A', "brandName": "A", "brandId": '', 'show': false }]
    var brand_B = [{ id: 'B', "brandName": "B", "brandId": '', 'show': false }]
    var brand_C = [{ id: 'C', "brandName": "C", "brandId": '', 'show': false }]
    var brand_D = [{ id: 'D', "brandName": "D", "brandId": '', 'show': false }]
    var brand_F = [{ id: 'F', "brandName": "F", "brandId": '', 'show': false }]
    var brand_G = [{ id: 'G', "brandName": "G", "brandId": '', 'show': false }]
    var brand_H = [{ id: 'H', "brandName": "H", "brandId": '', 'show': false }]
    var brand_J = [{ id: 'J', "brandName": "J", "brandId": '', 'show': false }]
    var brand_K = [{ id: 'K', "brandName": "K", "brandId": '', 'show': false }]
    var brand_L = [{ id: 'L', "brandName": "L", "brandId": '', 'show': false }]
    var brand_M = [{ id: 'M', "brandName": "M", "brandId": '', 'show': false }]
    var brand_N = [{ id: 'N', "brandName": "N", "brandId": '', 'show': false }]
    var brand_O = [{ id: 'O', "brandName": "O", "brandId": '', 'show': false }]
    var brand_Q = [{ id: 'Q', "brandName": "Q", "brandId": '', 'show': false }]
    var brand_R = [{ id: 'R', "brandName": "R", "brandId": '', 'show': false }]
    var brand_S = [{ id: 'S', "brandName": "S", "brandId": '', 'show': false }]
    var brand_T = [{ id: 'T', "brandName": "T", "brandId": '', 'show': false }]
    var brand_W = [{ id: 'W', "brandName": "W", "brandId": '', 'show': false }]
    var brand_X = [{ id: 'X', "brandName": "X", "brandId": '', 'show': false }]
    var brand_Y = [{ id: 'Y', "brandName": "Y", "brandId": '', 'show': false }]
    var brand_Z = [{ id: 'Z', "brandName": "Z", "brandId": '', 'show': false }]
    var brand_other = [{ "brandName": "其他", "brandId": '', 'show': false }]
    for(var i=0;i<brand_list.length;i++){
      brand_list[i].flag = false;
      var bid = brand_list[i].brandId
      if (bid == 33 || bid == 35){
        brand_A.push(brand_list[i])
      } else if (bid == 13 || bid == 14 || bid == 15 || bid == 27 || bid == 32 || bid == 36 || bid == 37 || bid == 38 || bid == 39 || bid == 40 || bid == 75 || bid == 95 || bid == 120 || bid == 140 || bid == 143 || bid == 154 || bid == 173 || bid == 203 || bid == 208){
        brand_B.push(brand_list[i])
      } else if (bid == 76 || bid == 77 || bid == 79){
        brand_C.push(brand_list[i])
      } else if (bid == 1 || bid == 41 || bid == 81 || bid == 92 || bid == 113 || bid == 165 || bid == 169 || bid == 187 || bid == 202) {
        brand_D.push(brand_list[i])
      } else if (bid == 3 || bid == 8 || bid == 11 || bid == 42 || bid == 96 || bid == 141) {
        brand_F.push(brand_list[i])
      } else if (bid == 82 || bid == 108 || bid == 112 || bid == 116 || bid == 152) {
        brand_G.push(brand_list[i])
      } else if (bid == 24 || bid == 43 || bid == 85 || bid == 86 || bid == 87 || bid == 91 || bid == 97 || bid == 150 || bid == 181 || bid == 220) {
        brand_H.push(brand_list[i])
      } else if (bid == 9 || bid == 25 || bid == 44 || bid == 46 || bid == 83 || bid == 84 || bid == 119 || bid == 145) {
        brand_J.push(brand_list[i])
      } else if (bid == 47 || bid == 100 || bid == 101 || bid == 109 || bid == 156 || bid == 199 || bid == 214) {
        brand_K.push(brand_list[i])
      } else if (bid == 10 || bid == 48 || bid == 49 || bid == 50 || bid == 51 || bid == 52 || bid == 53 || bid == 54 || bid == 78 || bid == 80 || bid == 88 || bid == 89 || bid == 118 || bid == 124) {
        brand_L.push(brand_list[i])
      } else if (bid == 20 ||  bid == 55 || bid == 56 || bid == 57 || bid == 58 || bid == 129 || bid == 168) {
        brand_M.push(brand_list[i])
      } else if (bid == 130) {
        brand_N.push(brand_list[i])
      } else if (bid == 59 || bid == 60 || bid == 146) {
        brand_O.push(brand_list[i])
      } else if (bid == 26 || bid == 62 || bid == 122 || bid == 8001) {
        brand_Q.push(brand_list[i])
      } else if (bid == 19 || bid == 63 || bid == 103 || bid == 174) {
        brand_R.push(brand_list[i])
      } else if (bid == 45 || bid == 64 || bid == 65 || bid == 66 || bid == 67 || bid == 68 || bid == 69 || bid == 90||bid == 155 || bid == 162 || bid == 238) {
        brand_S.push(brand_list[i])
      } else if (bid == 161) {
        brand_T.push(brand_list[i])
      } else if (bid == 70 || bid == 99 || bid == 102 || bid == 114 || bid == 167) {
        brand_W.push(brand_list[i])
      } else if (bid == 12 || bid == 71 || bid == 72 || bid == 98 || bid == 149) {
        brand_X.push(brand_list[i])
      } else if (bid == 73 || bid == 93 || bid == 110 || bid == 111 || bid == 144 || bid == 192) {
        brand_Y.push(brand_list[i])
      } else if (bid == 22 || bid == 74 || bid == 94) {
        brand_Z.push(brand_list[i])
      } else{
        brand_other.push(brand_list[i])
      }
    }
    brand_list = brand_A.concat(brand_B).concat(brand_C).concat(brand_D).concat(brand_F).concat(brand_G).concat(brand_H).concat(brand_J).concat(brand_K).concat(brand_L).concat(brand_M).concat(brand_N).concat(brand_O).concat(brand_Q).concat(brand_R).concat(brand_S).concat(brand_T).concat(brand_W).concat(brand_X).concat(brand_Y).concat(brand_Z).concat(brand_other)
   
    that.setData({
      brand_list: brand_list,
    })
  },
  //选择品牌
  onBrand: function(e){
    
    var that = this;
    var brand = '' //当前选择的品牌
    var brand_list = that.data.brand_list
    var index = e.currentTarget.dataset.i
    for (var i = 0; i < brand_list.length; i++) {
      if (index == i){
        brand_list[i].flag = true
        brand = brand_list[i]
      }else{
        brand_list[i].flag = false
      }
    }
    console.log(that.data.factory_list)
    var factory_list = that.data.factory_list
    var factory_list_new = []
    for (var i = 0; i < factory_list.length;i++){
      if (factory_list[i].brandId == brand_list[index].brandId){
        factory_list[i].flag = false
        factory_list_new.push(factory_list[i])
      }
    }
    that.setData({
      brand: brand,
      brand_list: brand_list,
      factory_list_new: factory_list_new,
      factory_flag: true,
    })
  },
  //选择生产工厂 
  onFactory: function(e){
    var that = this
    var factory = '';//当前选择的工厂
    var factory_list = that.data.factory_list_new
    var index = e.currentTarget.dataset.i
    for (var i = 0; i < factory_list.length; i++) {
      if (index == i) {
        factory_list[i].flag = true
        factory=factory_list[i]
      } else {
        factory_list[i].flag = false
      }
    }
    that.setData({
      factory: factory,
      factory_list_new: factory_list,
      open: !this.data.open,
    })
  },
  //选择车辆类型
  bindCarTypeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value, )
    this.setData({
      picker_cartype_index: e.detail.value
    })
  },
  //车牌校验
  verification: function (e) {
    console.log('时时', e.detail.value);
    var num = e.detail.value;
    num = e.detail.value.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g, '');
    this.setData({
      'plate_num': num
    })
  },

  //车牌
  binput: function (e) {
    console.log('e', e);
    var num = e.detail.value.toUpperCase();
    this.setData({
      plate_num: num
    })
  },
  //查看案例
  claim: function () {
    wx.navigateTo({
      url: '/pages/anli/claim/claim',
    })
  },
  //rule 用户协力
  onRuleUser: function () {
    wx.navigateTo({
      url: '../rule/user/user'
    })
  },
  //vin 变大写
  binput2: function (e) {
    console.log('eeeeeeeee', e);
    var num = e.detail.value.toUpperCase();
    this.setData({
      vin: num
    })
  },
  //vin 只能是数字和字母
  verification2: function (e) {
    console.log('时时', e.detail.value);
    var num = e.detail.value;
    num = e.detail.value.replace(/[^0-9a-zA-Z]/g, '');
    this.setData({
      vin: num
    })
  },
  //图片显示完后执行 
  imgload: function (e) {
    console.log('e1', e);
    var originalWidth = e.detail.width;//图片原始宽
    var originalHeight = e.detail.height;//图片原始高
    var originalScale = originalHeight / originalWidth;//图片高宽比
    var windowscale = windowHeight / windowWidth;//屏幕高宽比
    if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比
      //图片缩放后的宽为屏幕宽
      baseWidth = windowWidth;

      baseHeight = (windowWidth * originalHeight) / originalWidth;
    } else {//图片高宽比大于屏幕高宽比
      //图片缩放后的高为屏幕高
      baseHeight = windowHeight;
      baseWidth = (windowHeight * originalWidth) / originalHeight;
    }
    console.log(originalWidth, originalHeight);
    this.setData({
      scaleWidth: 750,
      scaleHeight: originalHeight,
    });
  },
  //放大图片
  movetap: function (e) {
    console.log('e2', e);
    if (e.touches.length == 2) {
      var xMove = e.touches[1].clientX - e.touches[0].clientX;
      var yMove = e.touches[1].clientY - e.touches[0].clientY;
      var distance = Math.sqrt(xMove * xMove + yMove * yMove);//两手指之间的距离 
      console.log(xMove, yMove, distance);
      if (olddistance == 0) {
        olddistance = distance; //要是第一次就给他弄上值，什么都不操作
        console.log('要是第一次就给他弄上值，什么都不操作', olddistance);
      }
      else {
        newdistance = distance; //第二次就可以计算它们的差值了
        diffdistance = newdistance - olddistance;
        olddistance = newdistance; //计算之后更新
        console.log('第二次就可以计算它们的差值了1', diffdistance);
        var newScale = oldscale + 0.005 * diffdistance;  //比例
        console.log('第二次就可以计算它们的差值了2', newScale);
        //刷新.wxml
        console.log(newScale * baseWidth);
        if (newScale * baseWidth > 750) {
          this.setData({
            scaleHeight: newScale * baseHeight,
            scaleWidth: newScale * baseWidth
          })
        }
        oldscale = newScale;
        //更新比例

      }
    }
  },
  endtap: function (e) {
    console.log('e3', e);
    olddistance = 0;
  },
  //点击图片
  dianjitupian: function (e) {
    var that = this;
    if (e.currentTarget.dataset.index == '1') {
      wx.navigateToMiniProgram({
        appId: 'wx57e028a7a8386b30',
        path: 'pages/index/index',
        extraData: {
          foo: 'bar'
        },
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    } else if (e.currentTarget.dataset.index == '2') {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else if (e.currentTarget.dataset.index == '3') {
      wx.navigateTo({
        url: '/pages/my/memberopening/memberopening',
      })
    }
  },

  //拍照
  onPhotograph: function () {
    var that = this;
    //从本地相册选择图片或使用相机拍照。
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log("选择图片:", tempFilePaths)
        that.qiniuyunPic(tempFilePaths[0]);//保存图片到七牛云
        wx.showLoading({
          title: '上传中',
          success: function () {
            //将本地资源上传到开发者服务器
            //其中 content-type 为 multipart/form-data 。

            wx.uploadFile({
              //url:'https://www.levau.com/carzidian/v1/chewu/ocr/input',
              url: url.photo_ocr,
              filePath: tempFilePaths[0],
              name: 'file',
              header: {// 设置请求的 header
                'content-type': 'multipart/form-data',
                //'Token': wx.getStorageSync('token')
              },
              formData: {
                'upload': tempFilePaths[0],
              },

              success: function (res) {
                wx.hideLoading();
                console.log('图片匹配返回：', res);
                if (res.statusCode != 200) {
                  console.log('图片上传识别失败');
                  wx.showModal({
                    title: '提示',
                    content: '图片上传识别失败',
                  });
                  return;
                }

                res.data = JSON.parse(res.data);
                if (res.data.resultCode != 1) {
                  wx.showModal({
                    title: '提示',
                    content: res.data.resultMsg,
                  });
                  return;
                } else {
                  that.setData({
                    vin: res.data.result.vin,
                  })
                }

                util.showToast("上传成功", "success", 800)
              },
              fail: function (res) {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '图片上传识别失败，请重试',
                })
              }
            })
          }
        })

      }
    })
  },
  qiniuyunPic: function (tempFilePath) {
    var that = this;
    url.ajaxGet(false, url.vehicle_gettoken, {
      openId: app.globalData.openid,
      'type': 1,
      count: 1,
      requestId: that.data.requestId
    }, function (data) {
      console.log("获取上传图片的token:", data);
      wx.showLoading({
        title: "上传中",
        mask: false
      });
      that.setData({
        requestId: data.result.requestId,
      });

      wx.uploadFile({
        url: 'https://up.qbox.me',
        filePath: tempFilePath,
        name: 'file',
        formData: {
          'key': data.result.tokens[0].fileName,
          'token': data.result.tokens[0].token
        },
        header: {// 设置请求的 header
          'content-type': 'multipart/form-data',
        },
        success: function (res) {
          console.log('res', res);
          wx.hideLoading();
          var data = JSON.parse(res.data);
          var vin_image = url.qiniu + data.key + '?imageView2/0/w/1440';
          var shanchutupian = [];
          shanchutupian.push(data.key);
          that.setData({
            vin_image: vin_image,
            shanchutupian: shanchutupian,
            vin_image_flag: true,
          });
        },
        fail(error) {
          console.log(error)
        }
      });
    });
  },

  //删除图片
  shanchutupian: function () {
    var that = this;
    var shanchutupian = that.data.shanchutupian;
    if (shanchutupian.length <= 0) {
      return;
    }
    url.ajaxPost(false, url.vehicle_removeFile, {
      openId: app.globalData.openid,
      requestId: that.data.requestId,
      fileName: shanchutupian[0]
    }, function (data) {
      console.log("服务器返回:", data);
      shanchutupian.splice(0, 1)
      that.setData({
        vin_image: '',
        shanchutupian: shanchutupian,
        vin_image_flag: false,
      });
    });
  },

  //提交表单
  formSubmitVin: function (e) {
    console.log('formSubmit', e);
    this.shanchutupian();//删除图片
    var that = this;
    var reg = /^[0-9a-zA-Z]+$/;//仅数字或字母或组合
    var reg_license = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z0-9]{5,6}$/;

    var queryData = e.detail.value;
    var queryType = e.detail.target.id
    var queryUrl = ''
    var tipMoney = "提示语";
    var stype = '';
    var carType = that.data.cartype_id_arr[e.detail.value.cartype];


    switch (queryType) {
      case 'onRanking':
        if (wx.getStorageSync('isphone')) {//数据库里有手机号 则不显示
          wx.navigateTo({
            url: '/pages/my/my-rankings/my-rankings',
          })
        }else{
          that.setData({//数据库里没有手机号 则显示
            flag: true,
          })
        }
        
        break;
      case 'onAutoSalongirls':
        wx.navigateTo({
          url: '/pages/my/task/task',
        })
        break;
      case 'onQueryMaintainLog':
        if (that.data.brand.brandName == '选择车型(仅4S查询需选择车型)' || that.data.factory.brandFactoryName =='') {
          util.showToast('请选择车型', 'error');
          return;
        }
        //console.log(that.data.factory)
        if (queryData.vin.length < 17) {
          util.showToast('请输入17位车架号', 'error');
          return;
        }
        if (queryData.vin != '' && !reg.test(queryData.vin)) {
          util.showToast('车架号格式错误', 'error');
          return;
        }
        queryUrl = url.cbs
        tipMoney = '开通会员价(维保) 3.63元';
        that.queryStatePrice(url.queryMaintainPrice2, e.detail, url.queryMaintainInfo2);
        break;
      case 'onQueryAccidentLog':
        if (queryData.vin.length < 17) {
          util.showToast('请输入17位车架号', 'error');
          return;
        }
        if (queryData.vin != '' && !reg.test(queryData.vin)) {
          util.showToast('车架号格式错误', 'error');
          return;
        }
        queryUrl = url.claim2
        tipMoney = '开通会员价(定损) 11.99元';
        that.queryStatePrice(url.queryClaimPrice, e.detail, url.queryClaim);
        break;
      case 'onQueryinfoLog':
        if (queryData.license.length < 0 || queryData.license == "") {
          util.showToast("车牌号为空", 'error');
          return;
        }
        if (queryData.license != "" && !reg_license.test(queryData.license)) {
          util.showToast("车牌号格式错误", 'error');
          return;
        }
        queryUrl = url.infobaodan
        tipMoney = '开通会员价(状态在保) 8.25元'
        that.queryStatePrice(url.queryStatePrice, e.detail, url.queryVehicleState);
        break;
    }
  },

  //priceUrl:是请求查询价格的路径
  //detail：参数
  //interUrl :请求接口的路径
  queryStatePrice: function (priceUrl, detail, interUrl) {
    var that = this;
    var carType = that.data.cartype_id_arr[detail.value.cartype];
    console.log(carType);
    url.ajaxPost(false, priceUrl, {
      openId: app.globalData.openid,
      licenseNo: detail.value.license,
      carType: carType,
      vin: detail.value.vin,
      manufacturerId: that.data.factory.brandFactoryId
    }, function (data) {
      console.log("查询车辆状态价格回掉:", data);
      var balance = data.result.balance;//账户余额
      var price = data.result.price;//查询金额
      var modelCarCount = data.result.modelCarCount;//车模个数
      var modelCarCountCost = data.result.modelCarCountCost;//查询接口需要的车模数量
      var balancePrompt = 1;
      if (balance < price) {
        balancePrompt = 0.2;
      }
      var modelPrompt = 1;
      if (modelCarCount < modelCarCountCost) {
        modelPrompt = 0.2;
      }
      that.setData({
        balance: balance,
        price: price,
        balancePrompt: balancePrompt,
        modelCarCount: modelCarCount,
        modelCarCountCost: modelCarCountCost,
        modelPrompt: modelPrompt,
        payflag: false,
        detail: detail,
        interUrl: interUrl
      });
      wx.hideTabBar();
      return;
    });
  },

  //关闭支付
  closePay: function () {
    var that = this;
    that.setData({
      payflag: true,
    });
    wx.showTabBar();
  },
  //选择支付类型(余额支付)
  onPayType1: function () {
    this.setData({
      priceType: true,
      modelType: false,
      payType: 1,
    });
  },
  onPayType2: function () {
    if (this.data.modelPrompt == 0.2) {
      return;
    }
    this.setData({
      priceType: false,
      modelType: true,
      payType: 2,
    });
  },

  //支付
  onPay: function () {
    var that = this;
    var balancePrompt = that.data.balancePrompt;
    var payType = that.data.payType;
    if (balancePrompt == 0.2 && payType == 1) {
      wx.showModal({
        title: '提示',
        content: '查询单价:' + that.data.price + '元 余额不足, 去充值?',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/memberopening/memberopening',
            })
          }
        }
      })
    } else {
      that.setData({
        payflag: true,
      });
      wx.showTabBar();
      var interUrl = that.data.interUrl;
      var detail = that.data.detail;
      var carType = that.data.cartype_id_arr[detail.value.cartype];
      var payType = that.data.payType;
      wx.showLoading({
        title: "提交中",
        mask: true
      });
      url.ajaxPost(false, interUrl, {
        openId: app.globalData.openid,
        location: JSON.stringify(app.globalData.location),
        licenseNo: detail.value.license,
        vin: detail.value.vin,
        carType: carType,
        formId: detail.formId,
        payType: payType,
        manufacturerId: that.data.factory.brandFactoryId
      }, function (data) {
        console.log("查询接口回掉:", data);
        wx.hideLoading();
        that.setData({
          priceType: true,
          modelType: false,
          payType: 1,
        });
        if (data.resultCode == 1) {
          wx.showModal({
            title: '提示',
            content: '支付成功！稍后记录会反馈到您的订单，请注意查收～',
            success: function (res) {
              wx.navigateTo({
                url: "/pages/order/order-list/order-list",
              })
            }
          })

        } else if (data.resultCode == 270) {
          wx.showModal({
            title: '提示',
            content: '该品牌可查询时间 9:00-18:00,，请您明天再来',
            success: function (res) {
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
            url: "/pages/my/my-rankings/my-rankings",
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
  //我的订单
  wodedingdan: function () {
    wx.navigateTo({
      url: '/pages/order/order-list/order-list',
    })
  },
  //账户充值
  woyaochongzhi: function(){
    wx.navigateTo({
      url: '/pages/my/memberopening/memberopening',
    })
  },

  bindChange: function (e) {
    console.log(e);
    var that = this
    const val = e.detail.value
    var brand_list = that.data.brand_list
    var factoryData = factory.data
    var factory_list = []
    for (var i = 0; i < factoryData.length;i++){
      if (factoryData[i].brandId == brand_list[val[0]].brandId){
        factory_list.push(factoryData[i])
      }
    }
    console.log(factory_list);
    this.setData({
      brand: brand_list[val[0]],
      factory: factory_list[0],
      factory_list: factory_list,
    })
  },
  //ceshi
  ontest:function(){
    this.setData({
      open:!this.data.open,
      factory_flag:false,
      brand: {
        "brandName": "选择车型(仅4S查询需选择车型)",
      },
      factory: {
        "brandFactoryName": "",
      },
    })
    //util.showToast("车牌号格式错误", 'error');
  },
  //返回首页
  fanhui: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})