
//时间戳转换时间  
function toDate(number, type) {
    var n = number;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    switch (type) {
        case 'YMDhms': return (Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s)
            break;
        case 'YMD': return (Y + '-' + M + '-' + D)
          break;
        case 'MDhm': return (M + D + " " + h + m)
            break;
        case 'hm': return (h + ':' + m)
          break;
        
    }
}

function timeBefore(timestamp) {
  var date = new Date();
  var currentTime = date.getTime();
  var ago = currentTime - timestamp;
  var num;

  if ((ago / (1000 * 60 * 60 * 24 * 30 * 12)) >= 1) {
    return num = parseInt((ago / (1000 * 60 * 60 * 24 * 30 * 12))) + '年前';

  } else if ((ago / (1000 * 60 * 60 * 24 * 30)) >= 1) {
    return num = parseInt((ago / (1000 * 60 * 60 * 24 * 30))) + '月前';
  }
  else if ((ago / (1000 * 60 * 60 * 24)) >= 1) {
    return num = parseInt((ago / (1000 * 60 * 60 * 24))) + '天前';
  }
  else if ((ago / (1000 * 60 * 60)) >= 1) {
    return num = parseInt((ago / (1000 * 60 * 60))) + '小时前';
  } else if ((ago / (1000 * 60)) >= 1) {
    return num = parseInt((ago / (1000 * 60))) + '分钟前';
  } else {
    return num = '刚刚'
  }

}

//获取定位
function getLocation(cb) {
    wx.getLocation({
        type: 'wgs84',
        success: function (res) {
            console.log("定位获取成功", res);
            var location = {
                lon: res.longitude,
                lat: res.latitude
            };
            typeof cb == "function" && cb(location)
        },
        fail: function (res) {
            console.log("定位获取失败", res);
            wx.showModal({
                title: '提示',
                content: '该系统需要打开定位才能查询',
                success: function (res1) {
                    wx.openSetting({
                        success: function (res) {
                            // console.log(res);
                            res.authSetting = {
                                "scope.userInfo": true,
                                "scope.userLocation": true
                            }
                        }
                    })
                }
            })
        }
    })
}


//位置的公共方法
function location(cb) {
  var that = this;
  //获取当前位置经纬度
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      console.log(res);
      //console.log("获取当前经纬度：" + JSON.stringify(res));
      //发送请求通过经纬度反查地址信息
      var getAddressUrl = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key=33SBZ-PE3WU-YUEVI-2NUGJ-QTWV6-DNFIN&get_poi=1";
      // var getAddressUrl = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + '29.649986' + "," + '94.321763' + "&key=33SBZ-PE3WU-YUEVI-2NUGJ-QTWV6-DNFIN&get_poi=1";
      // url.ajaxGet(false, getAddressUrl, {}, function (res) {
      //   console.log("发送请求通过经纬度反查地址信息:", res);
      //   typeof cb == "function" && cb(res)
      // });
      wx.request({
        url: getAddressUrl,
        success:function(res){
          console.log("发送请求通过经纬度反查地址信息:", res);
          var region = [];
          region.push(res.data.result.address_component.province);
          region.push(res.data.result.address_component.city);
          typeof cb == "function" && cb(region)
        }
      })
    }
  })
}

//toast
function showToast(msg, ico, time) {
    if (ico == "loading" || ico == "success") {
        wx.showToast({
            title: msg,
            type: ico,
            duration: (time ? time : 1000),
        });
    }
    else {
        wx.showToast({
            title: msg,
            image: '/images/tips/' + ico + '.png',
            duration: (time ? time : 1000),
        });
    }

}

//获取异步缓存
function getStorage(key) {
    wx.getStorage({
        key: key,
        success: function (res) {
            console.log('获取用户缓存信息：', res.data)
            return res.data;
        }
    });
}

//除100
function divide100(value) {
    return (value == '0') ? 0 : parseFloat((value / 100).toFixed(2));
}
//除1000
function divide1000(value) {
  return (value == '0') ? 0 : parseFloat((value / 1000).toFixed(0));
}

//加密(后面加密)
function encryptionStr(str, lastNum) {
    // console.log(str);
    var star = "";
    for (var i = 0; i < lastNum; i++) {
        star += "*";
    }
    if (str != '' && str != null && typeof (str) !="undefined") {
        return str.substr(0, str.length - lastNum) + star;
    } else {
        return '';
    }
}

//加密(前面加密)
function encryptionStrFront(str, lastNum) {
  // console.log(str);
  var star = "";
  for (var i = 0; i < lastNum; i++) {
    star += "*";
  }
  if (str != '' && str != null && typeof (str) != "undefined") {
    return star + str.substr(lastNum, str.length);
  } else {
    return '';
  }
}

module.exports = {
    toDate: toDate,
    getLocation: getLocation,
    location: location,
    showToast: showToast,
    getStorage: getStorage,
    divide100: divide100,
    divide1000: divide1000,
    encryptionStr: encryptionStr,
    encryptionStrFront: encryptionStrFront,
    timeBefore: timeBefore
}
