// pages/anli.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weibao:0.3,
    chuxian:0,
    zaibao:0,
    src:'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com/fours',

  },

 
  weibao:function(){
    var that = this;
    that.setData({
      weibao: 0.3,
      chuxian: 0,
      zaibao: 0,
      src: 'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com/fours',
    });
  },
  dingsun: function () {
    var that = this;
    that.setData({
      weibao: 0,
      chuxian: 0.3,
      zaibao: 0,
      src: 'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com/claim',
    });
  },
  zaibao: function () {
    var that = this;
    that.setData({
      weibao: 0,
      chuxian: 0,
      zaibao: 0.3,
      src: 'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com/info',
    });
  },
})