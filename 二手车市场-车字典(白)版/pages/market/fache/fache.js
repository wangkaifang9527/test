// pages/market/fache/fache.js
var app = getApp();
var url = require("../../../utils/url.js");//服务列表
var util = require("../../../utils/util.js");
var post_url = url.fache
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title_flag: false, //false 普通发车 true悬赏发车
    dates: '请选择上牌日期',
    region: ['选择省', '选择市'],
    multiArray: [
      ['京', '津', '冀', '晋', '蒙', '辽', '吉',
        '黑', '沪', '苏', '浙', '皖', '闽', '赣',
        '鲁', '豫', '鄂', '湘', '粤', '桂', '琼',
        '川', '贵', '云', '渝', '藏', '陕', '甘',
        '青', '宁', '新', '港', '澳', '台'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G',
        'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U',
        'V', 'W', 'X', 'Y', 'Z']
    ],
    multiIndex: [0, 0],

    yy_list:[
      { id: 1, name: '非营运', flag: true },
      { id: 0, name: '营转非', flag: false },
    ],
    yy2_list: [
      { id: 0, name: '抵押车', flag: false },
      { id: 1, name: '轿车', flag: false },
      { id: 2, name: 'SUV', flag: false },
    ],
    //国标排放
    NS_list: [
      { id: 0, name: '国六', flag: false },
      { id: 1, name: '国五', flag: false },
      { id: 2, name: '国四', flag: false },
      { id: 3, name: '国三', flag: false },
      { id: 4, name: '国二', flag: false },
    ],
    //车系
    CS_list: [
      { id: 0, name: '国产', flag: false },
      { id: 1, name: '德系', flag: false },
      { id: 2, name: '日系', flag: false },
      { id: 3, name: '美系', flag: false },
      { id: 4, name: '其他', flag: false },
    ],
    car_condition_flag: true,//默认1.非精品车 ，2.精品车
    main_list: ['请选择','是','否'],
    main_index: 0,// 是否需要维保查询

    tupianconnt: 24,//上传图片的总数
    yulan: [],//预览图片
    shanchutupian: [],//删除图片
    requestId:'',//图片上传的需要的

    self_proof: [
      {
        'name': '维保记录和出险',
        'list_flag': false,
        'self_list':
          [
            { 'name': '有记录', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '无记录', 'self_list_flag': false, 'ratio': 0 },
          ]
      },
      {
        'name': '油漆面',
        'list_flag': false,
        'self_list':
          [
            { 'name': '零补漆', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '局部补漆', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '需补漆', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '有刮痕', 'self_list_flag': false, 'ratio': 0 },
          ]
      }
    ],

    self_proof_fei: [
      {
        'name': '钣金',
        'list_flag': false,
        'self_list':
          [
            { 'name': '无', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '门', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '叶子板', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '后尾板', 'self_list_flag': false, 'ratio': 0 },
          ]
      }, {
        'name': '内饰',
        'list_flag': false,
        'self_list':
          [
            { 'name': '原装', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '改装', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '磨损', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '需整备', 'self_list_flag': false, 'ratio': 0 },
          ]
      }, {
        'name': '骨架',
        'list_flag': false,
        'self_list':
          [
            { 'name': '正常', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '切割', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '钣金', 'self_list_flag': false, 'ratio': 0 },
          ]
      }, {
        'name': '底盘',
        'list_flag': false,
        'self_list':
          [
            { 'name': '正常', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '异响', 'self_list_flag': false, 'ratio': 0 },
          ]
      }, {
        'name': '发动机',
        'list_flag': false,
        'self_list':
          [
            { 'name': '无拆修', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '拆卸', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '渗油', 'self_list_flag': false, 'ratio': 0 },
          ]
      }, {
        'name': '变速箱',
        'list_flag': false,
        'self_list':
          [
            { 'name': '无拆修', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '拆卸', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '渗油', 'self_list_flag': false, 'ratio': 0 },
          ]
      }, {
        'name': '疑似更换/松动',
        'list_flag': false,
        'self_list':
          [
            { 'name': '水箱框架', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '保险杠', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '大灯', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '叶子板', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '门', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '玻璃', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '后尾盖', 'self_list_flag': false, 'ratio': 0 },
            { 'name': '机盖', 'self_list_flag': false, 'ratio': 0 },
          ]
      },
    ],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cellphoneNumber: app.globalData.cellphoneNumber
    })
  },

  //下拉显示， 上啦隐藏(精品)
  onXiaShangla: function (e) {
    var that = this;
    var self_proof = that.data.self_proof;
    var i = e.currentTarget.dataset.i
    var list_flag = self_proof[i].list_flag;
    if (list_flag) {
      self_proof[i].list_flag = false;
    } else {
      self_proof[i].list_flag = true;
    }

    that.setData({
      self_proof: self_proof,
    });
  },
  //下拉显示， 上啦隐藏(非精品)
  onXiaShanglafei: function (e) {
    var that = this;
    var self_proof = that.data.self_proof_fei;
    var i = e.currentTarget.dataset.i
    var list_flag = self_proof[i].list_flag;
    if (list_flag) {
      self_proof[i].list_flag = false;
      //this.animation.rotate(0).step()
      //this.setData({ animation: this.animation.export() })
    } else {
      self_proof[i].list_flag = true;
      //this.animation.rotate(180).step()
      //this.setData({ animation: this.animation.export() })
    }

    that.setData({
      self_proof_fei: self_proof,
    });
  },
  //选择(非精品)
  onXuanzefei: function (e) {
    console.log(e);
    var that = this;
    var self_proof = that.data.self_proof_fei;
    var i = e.currentTarget.dataset.i;
    var iii = e.currentTarget.dataset.iii;
    var self_list = self_proof[i].self_list;
    var array = self_list[iii];
    if (i == 0) {
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[2].self_list_flag = false;
        self_proof[i].self_list[3].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].ratio = 0;
        self_proof[i].self_list[2].ratio = 0;
        self_proof[i].self_list[3].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[1].self_list_flag) {
          self_proof[i].self_list[1].self_list_flag = false;
          self_proof[i].self_list[1].ratio = 0;
        } else {
          self_proof[i].self_list[1].self_list_flag = true;
          self_proof[i].self_list[1].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 2) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 3) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[3].self_list_flag) {
          self_proof[i].self_list[3].self_list_flag = false;
          self_proof[i].self_list[3].ratio = 0;
        } else {
          self_proof[i].self_list[3].self_list_flag = true;
          self_proof[i].self_list[3].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      }

    } else if (i == 1) { //内饰
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[1].self_list_flag = true;
        self_proof[i].self_list[0].ratio = 0;
        self_proof[i].self_list[1].ratio = 0.3;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 2) {
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 3) {
        if (self_proof[i].self_list[3].self_list_flag) {
          self_proof[i].self_list[3].self_list_flag = false;
          self_proof[i].self_list[3].ratio = 0;
        } else {
          self_proof[i].self_list[3].self_list_flag = true;
          self_proof[i].self_list[3].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      }

    } else if (i == 2) {//骨架
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[2].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].ratio = 0;
        self_proof[i].self_list[2].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[1].self_list_flag) {
          self_proof[i].self_list[1].self_list_flag = false;
          self_proof[i].self_list[1].ratio = 0;
        } else {
          self_proof[i].self_list[1].self_list_flag = true;
          self_proof[i].self_list[1].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 2) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
        }
        that.setData({
          self_proof_fei: self_proof,
        });
      }
    } else if (i == 3) {//底盘
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[1].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        self_proof[i].self_list[1].self_list_flag = true;
        self_proof[i].self_list[1].ratio = 0.3;
        that.setData({
          self_proof_fei: self_proof,
        });
      }
    } else if (i == 4) {//发动机
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[1].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        self_proof[i].self_list[1].self_list_flag = true;
        self_proof[i].self_list[1].ratio = 0.3;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 2) {
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
          that.setData({
            self_proof_fei: self_proof,
          });
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
          that.setData({
            self_proof_fei: self_proof,
          });
        }
      }
    } else if (i == 5) {//变速箱
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[1].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        self_proof[i].self_list[1].self_list_flag = true;
        self_proof[i].self_list[1].ratio = 0.3;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else if (iii == 2) {
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
          that.setData({
            self_proof_fei: self_proof,
          });
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
          that.setData({
            self_proof_fei: self_proof,
          });
        }
      }
    } else if (i == 6) {
      if (self_proof[i].self_list[iii].self_list_flag) {
        self_proof[i].self_list[iii].self_list_flag = false;
        self_proof[i].self_list[iii].ratio = 0;
        that.setData({
          self_proof_fei: self_proof,
        });
      } else {
        self_proof[i].self_list[iii].self_list_flag = true;
        self_proof[i].self_list[iii].ratio = 0.3;
        that.setData({
          self_proof_fei: self_proof,
        });
      }
    }
  },
  
  
  //选择(精品)
  onXuanze: function (e) {
    console.log(e);
    var that = this;
    var self_proof = that.data.self_proof;
    var i = e.currentTarget.dataset.i;
    var iii = e.currentTarget.dataset.iii;
    var self_list = self_proof[i].self_list;
    var array = self_list[iii];
    if (i == 0) {
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].ratio = 0;
        that.setData({
          self_proof: self_proof,
        });
      } else {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[1].self_list_flag = true;
        self_proof[i].self_list[0].ratio = 0;
        self_proof[i].self_list[1].ratio = 0.3;
        that.setData({
          self_proof: self_proof,
        });

      }
    } else {
      // var self_list_flag = self_proof[i].self_list[iii].self_list_flag;
      // if (self_list_flag){
      //   self_proof[i].self_list[iii].self_list_flag = false;
      //   self_proof[i].self_list[iii].ratio = 0;
      //   that.setData({
      //     self_proof: self_proof,
      //   });
      // }else{
      //   self_proof[i].self_list[iii].self_list_flag = true;
      //   self_proof[i].self_list[iii].ratio = 0.3;
      //   that.setData({
      //     self_proof: self_proof,
      //   });
      // }
      if (iii == 0) {
        self_proof[i].self_list[0].self_list_flag = true;
        self_proof[i].self_list[1].self_list_flag = false;
        self_proof[i].self_list[2].self_list_flag = false;
        self_proof[i].self_list[3].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0.3;
        self_proof[i].self_list[1].ratio = 0;
        self_proof[i].self_list[2].ratio = 0;
        self_proof[i].self_list[3].ratio = 0;
        that.setData({
          self_proof: self_proof,
        });
      } else if (iii == 1) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[1].self_list_flag) {
          self_proof[i].self_list[1].self_list_flag = false;
          self_proof[i].self_list[1].ratio = 0;
        } else {
          self_proof[i].self_list[1].self_list_flag = true;
          self_proof[i].self_list[1].ratio = 0.3;
        }
        that.setData({
          self_proof: self_proof,
        });
      } else if (iii == 2) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[2].self_list_flag) {
          self_proof[i].self_list[2].self_list_flag = false;
          self_proof[i].self_list[2].ratio = 0;
        } else {
          self_proof[i].self_list[2].self_list_flag = true;
          self_proof[i].self_list[2].ratio = 0.3;
        }
        that.setData({
          self_proof: self_proof,
        });
      } else if (iii == 3) {
        self_proof[i].self_list[0].self_list_flag = false;
        self_proof[i].self_list[0].ratio = 0;
        if (self_proof[i].self_list[3].self_list_flag) {
          self_proof[i].self_list[3].self_list_flag = false;
          self_proof[i].self_list[3].ratio = 0;
        } else {
          self_proof[i].self_list[3].self_list_flag = true;
          self_proof[i].self_list[3].ratio = 0.3;
        }
        that.setData({
          self_proof: self_proof,
        });
      }
    }
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
  //是否提供维保记录
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      main_index: e.detail.value
    })
  },
  //非精品车
  onCC1: function () {
    var that = this
    that.setData({
      car_condition_flag: true
    })
  },
  //精品车
  onCC2: function(){
    var that = this
    that.setData({
      car_condition_flag:false
    })
  },

  // 
  onYY2: function (e) {
    var that = this
    var yy2_list = that.data.yy2_list
    var index = e.currentTarget.dataset.index
    if (yy2_list[index].flag){
      yy2_list[index].flag = false
    }else{
      yy2_list[index].flag = true
    }
    that.setData({
      yy2_list: yy2_list,
    })
  },
  //选择营运非营运
  onYY: function(e){
    var that = this 
    var yy_list = that.data.yy_list
    var index = e.currentTarget.dataset.index
    for (var i = 0; i < yy_list.length;i++){
      if(index == i){
        yy_list[i].flag = true
      }else{
        yy_list[i].flag = false
      }
    }
    that.setData({
      yy_list: yy_list,
    })
  },
  //排放
  onNS:function(e){
    var that = this
    var NS_list = that.data.NS_list
    var index = e.currentTarget.dataset.index
    for (var i = 0; i < NS_list.length; i++) {
      if (index == i) {
        NS_list[i].flag = !NS_list[index].flag
      } else {
        NS_list[i].flag = false
      }
    }
    that.setData({
      NS_list: NS_list,
    })
  },
  //车系
  onCS: function (e) {
    var that = this
    var CS_list = that.data.CS_list
    var index = e.currentTarget.dataset.index
    for (var i = 0; i < CS_list.length; i++) {
      if (index == i) {
        CS_list[i].flag = !CS_list[index].flag
      } else {
        CS_list[i].flag = false
      }
    }
    that.setData({
      CS_list: CS_list,
    })
  },

  //paizhaoxiaqu
  paizhaoxiaqu: function () {
    var that = this;
    var provinceFlag = that.data.provinceFlag;
    var provinceCodeFlag = that.data.provinceCodeFlag;
    if (provinceFlag || provinceCodeFlag) {
      that.setData({
        provinceFlag: false,//
        provinceCodeFlag: false,//
      });
    } else {
      that.setData({
        provinceFlag: true,//
        provinceCodeFlag: false,//
      });
    }

  },
  //选择省份简称
  dianjishengfen: function (e) {
    console.log(e)
    var that = this;
    var multiIndex = that.data.multiIndex;
    multiIndex[0] = e.currentTarget.dataset.i
    that.setData({
      multiIndex: multiIndex,
      provinceFlag: false,//
      provinceCodeFlag: true,//
    });
  },
  //选择A-Z
  dianjizimu: function (e) {
    var that = this;
    var multiIndex = that.data.multiIndex;
    multiIndex[1] = e.currentTarget.dataset.i
    that.setData({
      multiIndex: multiIndex,
      provinceFlag: false,//
      provinceCodeFlag: false,//
    });
  },

  //获取当前位置
  weizhi: function () {
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
          var region = [];
          region.push(res.result.address_component.province);
          region.push(res.result.address_component.city);
          that.setData({
            region: region
          });
          that.getregion(region)
        });
      }
    })
  },
  // 城市选择器
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    this.getregion(e.detail.value);
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  //普通发车
  putongfache: function () {
    this.setData({
      title_flag: false,
    });
  },
  //急速发车
  jisufache: function () {
    this.setData({
      title_flag: true,
    });
  },

  //提交表单
  formSubmit: function(e){
    var that = this;
    var from_data = e.detail.value
    console.log(e, that.data, that.data.removeFiles);
    //判断是悬赏发车
    if (that.data.title_flag) {
      if (from_data.reward == '') {
        util.showToast("悬赏金为空", 'error');
        return;
      }
      if (from_data.reward < 1000) {
        util.showToast("悬赏金小于1000", 'error');
        return;
      }
      if (from_data.reward > app.globalData.balance){
        wx.showModal({
          title: '提示',
          content: '余额不足,是否去充值',
          success: function (res) {
            if(res.confirm){
              wx.navigateTo({
                url: '/pages/my/memberopening/memberopening',
              })
            }
          }
        })
        return
      }
      post_url = url.vehicle_publishWithReward
    }
    //判断是否需要维保查询 1.需要
    var needQuery = 0
    if (that.data.main_index == 1) {
      if (from_data.vin == '') {
        util.showToast("VIN码为空", 'error');
        return;
      }
      needQuery = 1
    }
    if (from_data.jiage > 1000) {
      util.showToast("超过1000万", 'error');
      return;
    }
    if (from_data.jiage == '' || from_data.jiage > 1000) {
      util.showToast("价格为空", 'error');
      return;
    }
    if (that.data.requestId == '') {
      util.showToast("没有上传图片", 'error');
      return;
    }
    if (that.data.region[0] == '选择省' || that.data.region[1] == '选择市') {
      util.showToast("请选择车辆所在地", 'error');
      return;
    }
    if (that.data.dates == '请选择上牌日期') {
      util.showToast("请选择上牌日期", 'error');
      return;
    }
    if (from_data.biaoti == '') {
      util.showToast("标题为空", 'error');
      return;
    }
    if (from_data.gonglishu == '') {
      util.showToast("公里数为空", 'error');
      return;
    }
    if (from_data.cellphoneNumber == '') {
      util.showToast("联系电话为空", 'error');
      return;
    }
    if (from_data.cc == '') {
      util.showToast("排量为空", 'error');
      return;
    }
    
    var licenseLocation = that.data.multiArray[0][that.data.multiIndex[0]] + that.data.multiArray[1][that.data.multiIndex[1]];//牌照辖区
    //var dateOfManufacture = that.data.dates1;//出厂日期
    // if (dateOfManufacture == '请选择出厂日期') {
    //   dateOfManufacture = '';
    // }
    //var transferTimes = that.data.index;//过户次数
    var property = 1//1 非营运 2营运
    var yy_list = that.data.yy_list
    if (yy_list[1].flag){
      property = 2;
    }

    var yy2_list = that.data.yy2_list;
    var type = '';
    for (var i = 0; i < yy2_list.length; i++) {
      if (yy2_list[i].flag != 0) {
        if (i == (yy2_list.length - 1)) {
          type = type + yy2_list[i].name;
        } else {
          type = type + yy2_list[i].name + ',';
        }
      }
    }

    //var chekuang = that.data.chekuang;
    var brief = '';
    console.log(type, brief, app.globalData.openid, that.data.requestId);
    if (e.detail.target.id == 'putongfache') {
      var self_proof = that.data.self_proof;
      var self_proof_fei = that.data.self_proof_fei;
      if (that.data.car_condition_flag) {//非精品车
        brief = JSON.stringify(self_proof) + '#' + JSON.stringify(self_proof_fei);
      } else {
        brief = JSON.stringify(self_proof) + '#'
      }
    } else {
      licenseLocation = '';
      transferTimes = '';
      property = '';
      type = '';
      brief = '';
    }

    url.ajaxPost(false, post_url, {
      removeFiles: that.data.removeFiles,
      //vehicleId: that.data.vehicle.id,
      openId: app.globalData.openid,
      requestId: that.data.requestId,
      title: from_data.biaoti,
      price: from_data.jiage,
      mileage: from_data.gonglishu,
      licenseDate: that.data.dates,
      location: that.data.region[0] + ',' + that.data.region[1],
      licenseLocation: licenseLocation,
      //dateOfManufacture: dateOfManufacture,
      //transferTimes: transferTimes,
      cc: from_data.cc,
      vin: from_data.vin,
      property: property,
      type: type,
      brief: brief,
      description: from_data.jiansu,
      cellphoneNumber: from_data.cellphoneNumber,
      reward: from_data.reward, //悬赏金
      deadline: from_data.deadline,//悬赏时间
      needQuery: needQuery, //1 需要维保查询, 0 不需要
    },
      function (data) {
        console.log('编辑车辆信息回掉', data);
        if (data.resultCode == 1) {

          wx.redirectTo({
            url: '/pages/market/success/success?id_=' + data.result.vehicleId + "&title_flag=" + that.data.title_flag,
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
  },

  getregion: function (region) {
    console.log(region);
    var that = this;
    var multiIndex = that.data.multiIndex;
    switch (region[0]) {
      case '北京市':
        multiIndex[0] = 0
        break
      case '天津市':
        multiIndex[0] = 1
        break
      case '河北省':
        multiIndex[0] = 2
        break
      case '山西省':
        multiIndex[0] = 3
        break
      case '内蒙古自治区':
        multiIndex[0] = 4
        break
      case '辽宁省':
        multiIndex[0] = 5
        break
      case '吉林省':
        multiIndex[0] = 6
        break
      case '黑龙江省':
        multiIndex[0] = 7
        break
      case '上海市':
        multiIndex[0] = 8
        break
      case '江苏省':
        multiIndex[0] = 9
        break
      case '浙江省':
        multiIndex[0] = 10
        break
      case '安徽省':
        multiIndex[0] = 11
        break
      case '福建省':
        multiIndex[0] = 12
        break
      case '江西省':
        multiIndex[0] = 13
        break
      case '山东省':
        multiIndex[0] = 14
        break
      case '河南省':
        multiIndex[0] = 15
        break
      case '湖北省':
        multiIndex[0] = 16
        break
      case '湖南省':
        multiIndex[0] = 17
        break
      case '广东省':
        multiIndex[0] = 18
        break
      case '广西壮族自治区':
        multiIndex[0] = 19
        break
      case '海南省':
        multiIndex[0] = 20
        break
      case '重庆市':
        multiIndex[0] = 21
        break
      case '四川省':
        multiIndex[0] = 22
        break
      case '贵州省':
        multiIndex[0] = 23
        break
      case '云南省':
        multiIndex[0] = 24
        break
      case '西藏自治区':
        multiIndex[0] = 25
        break
      case '陕西省':
        multiIndex[0] = 26
        break
      case '甘肃省':
        multiIndex[0] = 27
        break
      case '青海省':
        multiIndex[0] = 28
        break
      case '宁夏回族自治区':
        multiIndex[0] = 29
        break
      case '新疆维吾尔自治区':
        multiIndex[0] = 30
        break


    }
    that.setData({
      multiIndex: multiIndex
    });

  },
  //获取用户手机号
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
              that.setData({
                cellphoneNumber: data.data.result.cellphoneNumber,
              });
            }
          })
        }
      })
    }
  },
  //上传图片
  shangchuantupian: function (e) {
    var that = this;
    var tupianconnt = that.data.tupianconnt;
    if (tupianconnt <= 0) {
      wx.showModal({
        title: '提示',
        content: '最多可以上传9张图片',
      });
      return;
    }

    //从本地相册选择图片或使用相机拍照。
    wx.chooseImage({
      count: that.data.tupianconnt, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log("选择图片:", tempFilePaths, tempFilePaths.length);

        url.ajaxGet(false, url.vehicle_gettoken, {
          openId: app.globalData.openid,
          'type': 1,
          count: tempFilePaths.length,
          requestId: that.data.requestId
        }, function (data) {
          console.log("获取上传图片的token:", data);
          tupianconnt = tupianconnt - tempFilePaths.length;
          that.setData({
            requestId: data.result.requestId,
            tupianconnt: tupianconnt
          });
          wx.showLoading({
            title: "上传中",
            mask: false
          });
          for (var i = 0; i < tempFilePaths.length; i++) {
            wx.uploadFile({
              url: 'https://up.qbox.me',
              filePath: tempFilePaths[i],
              name: 'file',
              formData: {
                'key': data.result.tokens[i].fileName,
                'token': data.result.tokens[i].token
              },
              header: {// 设置请求的 header
                'content-type': 'multipart/form-data',
              },
              success: function (res) {
                console.log('res', res);
                var data = JSON.parse(res.data);
                var yulan = that.data.yulan;
                var shanchutupian = that.data.shanchutupian;
                console.log(url.qiniu + data.key + '?imageView2/0/w/100');
                yulan.push(url.qiniu + data.key + '?imageView2/0/w/100');
                shanchutupian.push(data.key);
                console.log(that.data.yulan);
                that.setData({
                  yulan: yulan,
                  shanchutupian: shanchutupian
                });
                setTimeout(function () {
                  wx.hideLoading();
                }, 2000);
              },
              fail(error) {
                console.log(error)
              }
            });
          }
        });
      }
    })


  },
  //删除图片
  shanchutupian: function (e) {
    console.log(e);
    var that = this;
    var yulan = that.data.yulan
    var shanchutupian = that.data.shanchutupian;
    var i = e.currentTarget.dataset.i
    url.ajaxPost(false, url.vehicle_removeFile, {
      openId: app.globalData.openid,
      requestId: that.data.requestId,
      fileName: shanchutupian[i]
    }, function (data) {
      console.log("服务器返回:", data);
      yulan.splice(i, 1)
      shanchutupian.splice(i, 1)
      var requestId = that.data.requestId
      if (yulan.length == 0){
        requestId = '';
      }
      that.setData({
        yulan: yulan,
        shanchutupian: shanchutupian,
        tupianconnt: that.data.tupianconnt+1,
        requestId: requestId,
      });
    });
  },

  //上传视频
  shangchuanshipin: function () {
    var that = this;
    var videos = that.data.videos;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      success: function (res) {
        console.log(res);

        url.ajaxGet(false, url.vehicle_gettoken, {
          openId: app.globalData.openid,
          'type': 2,
          count: 1,
          requestId: that.data.requestId
        }, function (data) {
          console.log('请求token回掉', data);
          that.setData({
            requestId: data.result.requestId
          });
          wx.showLoading({
            title: '上传中',
            success: function () {
              wx.uploadFile({
                url: 'https://up.qbox.me',
                filePath: res.tempFilePath,
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
                  var data = JSON.parse(res.data);
                  var videos = that.data.videos;
                  var videos_images = that.data.videos_images;
                  console.log(url.qiniu + data.key);
                  videos.push(url.qiniu + data.key);
                  videos_images.push(data.key.replace('.mp4', '.jpg'));
                  that.setData({
                    videos: videos,
                    videos_images: videos_images,
                  })
                  //do something
                },
                fail(error) {
                  console.log(error)
                }
              });


              wx.hideLoading();

            }
          })
        })

      }
    })
  },

  //删除视频
  shanchushipin: function (e) {
    var that = this;
    var removeFiles = that.data.removeFiles;
    var videos = that.data.videos;
    //var videos1 = that.data.videos1;
    var videos_images = that.data.videos_images
    console.log(e);
    removeFiles.push(videos[e.currentTarget.dataset.i]);
    removeFiles.push(videos_images[e.currentTarget.dataset.i]);
    videos.splice(e.currentTarget.dataset.i, 1);
    //videos1.splice(e.currentTarget.dataset.i, 1);
    videos_images.splice(e.currentTarget.dataset.i, 1);
    that.setData({
      videos: videos,
      //videos1: videos1,
      videos_images: videos_images,
      removeFiles: removeFiles,
    });
  },
})