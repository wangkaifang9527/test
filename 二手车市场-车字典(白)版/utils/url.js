//ajaxPost(app.globalData.token, url.pay, , function () { }, function () { })
function checkStatusCode(res) {
    // console.log(res);
    if (res.statusCode == 200) {
        return true;
        if (res.data.status == "success") {
            return true;
        } else {
            wx.showToast({
                title: '请求失败',
                image: '/images/tips/error.png',
                duration: 1000
            })
            return false;
        }
    } else {
        if (res.data.msg) {
            wx.showModal({
                title: '提示',
                content: res.data.msg
            })
        }
        // else {
        //     wx.showToast({
        //         title: res.statusCode + '错误',
        //         image: '/images/tips/error.png',
        //         duration: 1000
        //     })
        // }


        return false;
    }
}


//get请求服务器数据
function ajaxGet(token, url, data, successFn, failFn) {
    console.log('【Get】', url, 'data：', data);
    wx.request({
        url: url,
        data: data,//提交数据
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            // "Content-Type": "json",
            "Token": token ? wx.getStorageSync('token') : null,
        }, // 设置请求的 header
        success: function (res) {
            if (checkStatusCode(res)) {
                successFn(res.data);
            }
        },
        fail: function (res) {
            console.log("failed", res);
            failFn(res)
        }
    })
}


//Post请求服务器数据
function ajaxPost(token, url, data, successFn, failFn) {
    console.log('【Post】', url, 'data：', data);
    wx.request({
        url: url,
        data: data,//提交数据
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            // "Content-Type": "json",
            //"Token": token ? wx.getStorageSync('token') : null,
          'content-type':'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function (res) {
            if (checkStatusCode(res)) {
                successFn(res.data);
            }
        },
        fail: function (res) {
            console.log("failed", res);
            failFn(res)
        }
    })
}
var server = "https://gets.hzrjyw.cn";
var server1 = "https://www.cheguohu.com/fours";
var server2 = "https://shark.chejiwei.com";

//var server1 = 'http://localhost:8080/fours';

module.exports = {
    ajaxGet: ajaxGet,
    ajaxPost: ajaxPost,

    login: server2 + '/user/login',// 登陆
    user: server2 + '/user/updateProfile',// 小程序用户信息
    banner: server1 + '/v1/index/banner',//banner
    banner2: server2 + '/system/getBanners',//banner
    photo_ocr: server2 + '/upload/uploadPicture',//图片匹配
    share: server + '/v1/chewu/share/info',//分享文案
    order_detail: server2 + '/order/orderDetail',//获取单个订单详情
    phone: server2 +'/user/updateCellPhoneNumber',//获取用户手机号

    agent_binding: server2 + '/promote/binding',// 绑定代理商
    agent_order_new: server1 + '/v1/chewu/order/new',// 下单
    agent_order_new2: server1 + '/v1/chewu/order2/new',//下单2

    agent_order_list: server2 + '/order/orderList',// 获取订单
    agent_order_list1: server1 + '/v1/chewu/order/get1',// 获取订单1
    agent_apply: server2 + '/promote/agentApply',// 申请成为代理商
    agent_myinfo: server2 + '/promote/detail',// 查看自己的代理信息
    agent_earnings: server2 + '/promote/incomeList',// 查看自己推广的订单收益
    agent_info: server2 + '/my/homePage',// 个人主页
    // agent_withdrawal: server + '/v1/chewu/pay/atm',// 代理商提现
    agent_bill: server2 + '/withdraw/withdrawList',//代理商查看自己的提现记录
    agent_order_list2: server2 + '/promote/orderList',//代理商所有订单列表


    //withdrawal: server2 + '/withdraw/apply',// 代理商提现
    admin_info: server2 + '/admin/homePage',// 管理首页
    // admin_withdrawal: server + '/v1/chewu/admin/pay/atm/apply',//代理商提现申请
    admin_withdrawal_apply: server1 + '/v1/chewu/admin/pay/atm/list',//后台提现列表
    admin_withdrawal_reply: server1 + '/v1/chewu/admin/pay/atm/reply',//后台提现审核
    admin_bill: server2 + '/admin/withdrawList',//资金明细 代理商提现记录
    admin_agent_apply: server2 + '/admin/agentToAuditList',//待审核代理商列表
    
    admin_agent_reply_audit: server2 + '/admin/auditAgent',// 审核代理商资格(通过)
    admin_agent_reply_cancel: server2 + '/admin/cancelAgent',// 审核代理商资格(取消)
    admin_agent_edit_modify: server2 + '/admin/modifyAgent',// 修改代理商信息

    admin_agent_list: server2 + '/admin/agentList',//已通过代理商列表
    //admin_agent_edit: server1 + '/v1/chewu/admin/agent/edit',//编辑代理商信息
    //admin_agent_delete: server1 + '/v1/chewu/admin/agent/delete',//删除代理商信息
    admin_order_list: server2 + '/admin/orderList',//所有订单列表

    //rankings: server1 +'/v1/chewu/rankings/get',//用户排行;
    rankings: server2 +'/ranking/rankingList',
    getprepay: server1 +'/v1/chewu/prepay/get',//根据订单的prepay查询当前的订单的状态，
    xianxiaguanli: server2 +'/promote/downlineList',//线下管理

    music: server2 +'/system/getMusics',//背景音乐

    checked: server1 +'/v1/groups/groupsCheckType',
    
    imageurl:'https://guohubaoimage.oss-cn-shanghai.aliyuncs.com', //阿里云图片服务器

    cbs: server2 +'/query/maintenanceInfo',
    claim: server2 +'/query/nationalClaim',
    claim2: server2 +'/query/shanghaiClaim',
    info: server2 +'/query/vehicleState',
    baodan: server2 +'/query/insure',
    infobaodan: server2 +'/query/vehicleStateAndInsure',

    member_buy:server2 +'/member/buy',//会员购买
    member_renew: server2 + '/member/renew',//续费
    member_change: server2 + '/member/change',//换卡
    member_cardList: server2 + '/member/cardList',//会员卡列表

    member_change: server2 + '/admin/summary',//管理员统计
    
    vehicle_gettoken: server2 + '/vehicle/getToken',//上传图片到七牛云 ，先获取token

    //qiniu:'http://p9w80x57p.bkt.clouddn.com/',//七牛云地址
    qiniu: 'http://pic.chejiwei.com/',//七牛云地址(加速)
    qiniu_compress:'?imageView2/0/w/864',//七牛云地址(压缩)
    fache: server2 +'/vehicle/publish',//发车
    souche: server2 + '/vehicleSearch/vehicleList',//搜车（车辆列表
    favorite_collect: server2 + '/favorite/collect',//收藏车辆
    favorite_remove: server2 + '/favorite/remove',//取消收藏：
    vehicle_detail: server2 + '/vehicle/detail',//车辆详细：
    refresh: server2 + '/vehicle/refresh',//车辆刷新
    vehicle_removeFile: server2 + '/vehicle/removeFile',//车辆图片删除

    comment_comment: server2 + '/comment/comment',//评论
    comment_reply: server2 + '/comment/reply',//评论恢复
    comment_thumbUp: server2 + '/comment/thumbUp',//评论点赞
    comment_cancelThumbUp: server2 + '/comment/cancelThumbUp',//取消点赞
    comment_commentList: server2 + '/comment/commentList',//加载多条评论

    focus: server2 + '/relationship/focus',//关注：
    cancelFocus: server2 + '/relationship/cancelFocus',//取消关注：
    fansList: server2 + '/relationship/fansList',//粉丝列表：   
    focusList: server2 + '/relationship/focusList',//关注列表：

    vehicleList: server2 + '/my/vehicleList',//看别人的主页   
    myVehicleList: server2 + '/my/myVehicleList',//车辆的个人主页

    //openId   必须有
    //requestId  如果有新的图片，需要
	  //id  车的ID 必须有
	  //String[] removeFiles  如果有删除图片，删除的文件名
	  //其他参数跟发车的一样
    //修改车：
    vehicle_modify: server2 + '/vehicle/modify',
    vehicle_delete: server2 + '/vehicle/delete',//删除：	openId vehicleId 
    vehicle_clinch: server2 + '/vehicle/clinch',//修改成成交状态：openId  vehicleId
    
    favorite_vehicleList: server2 + '/favorite/vehicleList',//收藏列表：
    recharge: server2 + '/recharge/recharge',//普通充值

    queryStatePrice: server2 + '/query/queryStatePrice',//3 查询车辆状态价格
    queryClaimPrice: server2 + '/query/queryClaimPrice',//2 查询理赔价格
    queryMaintainPrice: server2 + '/query/queryMaintainPrice',//1 查询维保价格
    queryVehicleState: server2 + '/query/queryVehicleState',//3.查询车辆状态接口
    queryClaim: server2 + '/query/queryClaim',//2.查询理赔接口
    queryMaintainInfo: server2 + '/query/queryMaintainInfo',//1.查询维保接口

    // 1 品牌列表： query/getBrandList 
  query_getBrandList: server2 + '/query/getBrandList',//1 品牌列表：
    // 2 厂商列表： query/getFactoryList 
  query_getFactoryList: server2 + '/query/getFactoryList',//2 厂商列表：
    // 3 查价格： query/queryMaintainPrice2  参数  openId, vin, manufacturerId（对应brandFactoryId）
  queryMaintainPrice2: server2 + '/query/queryMaintainPrice2',//3 查价格
    // 4 查询： query/queryMaintainInfo2 参数   openId, location, vin, manufacturerId, formId, payType
  queryMaintainInfo2: server2 + '/query/queryMaintainInfo2',// 4 查询：

    withdrawList: server2 + '/admin/withdrawList',//提现列表（管理员）：
    rejectWithdraw: server2 + '/admin/rejectWithdraw',//拒绝（管理员）
    approveWithdraw: server2 + '/admin/approveWithdraw',//通过（管理员）：

    withdrawal: server2 + '/withdraw/apply',//申请提现(用户)

    promoteApply: server2 + '/my/promoteApply',//推广申请(用户)：
  //my/promotePay  参数openId 返回支付信息
  promotePay: server2 + '/my/promotePay',//返回支付信息：
    promoterToAuditList: server2 + '/admin/promoterToAuditList',//待审核的推广人列表（管理员）
    promoterList: server2 + '/admin/promoterList',//已审核过的推广人列表（管理员）
    auditPromoter: server2 + '/admin/auditPromoter',//审核通过（管理员）
    cancelPromoter: server2 + '/admin/cancelPromoter',//拒绝或取消（管理员）

    vehicle_createQRCode: server2 + '/vehicle/createQRCode',//车辆详情的二维码

    shareToGroup: server2 + '/modelCar/shareToGroup',//分享到群
    signIn: server2 + '/modelCar/signIn',//每日签到
    shareVehicle: server2 + '/modelCar/shareVehicle',//分享车源
    present: server2 + '/modelCar/present',//赠送车模

    

    banned_create: server2 + '/banned/create',//封杀录入
    banned_removeFile: server2 + '/banned/removeFile',//删除图片
    banned_detail: server2 + '/banned/detail',//封杀的详细页面
    banned_find: server2 + '/banned/find',//搜索全部
    banned_getToken: server2 + '/banned/getToken',//获取图片上传token

// 1 悬赏发车
// vehicle/publishWithReward   新增参数  needQuery （1 需要维保查询, 0 不需要） reward（悬赏金，单位元）  deadline （期限，单位天）
  vehicle_publishWithReward: server2 + '/vehicle/publishWithReward',//1 悬赏发车
// 2 设置悬赏（车辆先发了以后再设置）
//   vehicle/reward 参数 openId  vehicleId deadline reward
  vehicle_reward: server2 + '/vehicle/reward',//2 设置悬赏（车辆先发了以后再设置）
// 3 设置有偿转发
// forward/setForward  参数 openId ,vehicleId amount(金额，单位为元)
  forward_setForward: server2 + '/forward/setForward',//3 设置有偿转发
// 4 用户有偿转发
// forward/forwardWithReward 参数 openId destId  vehicleId
  forward_forwardWithReward: server2 + '/forward/forwardWithReward',// 4 用户有偿转发
// 5 用户免费转发（悬赏卖车时的转发）
//   forward/forward  参数 openId（用户）  sourceOpenId（来源用户，谁转发的） vehicleId
  forward_forward: server2 + '/forward/forward',// 5 用户免费转发（悬赏卖车时的转发）
// 6 有偿转发用户列表
// forward/paidForwardList 参数 openId  vehicleId
  forward_paidForwardList: server2 + '/forward/paidForwardList',//6 有偿转发用户列表

//   交易担保
// 1 下单（买家） vehicleTrade/createTrade 参数 openId vehicleId earnestMoney（保证金）  entrust（是否平台代办 1是）
  vehicleTrade_createTrade: server2 + '/vehicleTrade/createTrade',// 1 下单（买家）
// 2 支付（买家  前置条件：1） vehicleTrade/pay 参数 openId orderNo
  vehicleTrade_pay: server2 + '/vehicleTrade/pay',// 2 支付（买家  前置条件：1）
// 3 支付（卖家，前置条件：2） vehicleTrade/payResponse 参数 openId orderNo
  vehicleTrade_payResponse: server2 + '/vehicleTrade/payResponse',// 3 支付（卖家，前置条件：2）
// 4 确认交易（买家，前置条件：3） vehicleTrade/confirm 参数 openId orderNo
  vehicleTrade_confirm: server2 + '/vehicleTrade/confirm',// 4 确认交易（买家，前置条件：3）
// 5 取消（买家，前置条件：2或1） vehicleTrade/cancel 参数 openId orderNo
  vehicleTrade_cancel: server2 + '/vehicleTrade/cancel',// 5 取消（买家，前置条件：2或1）
//  6 拒绝（卖家，前置条件：2） vehicleTrade/refuse 参数 openId orderNo
  vehicleTrade_refuse: server2 + '/vehicleTrade/refuse',//  6 拒绝（卖家，前置条件：2）
// 10 详情 vehicleTrade/detail 参数 openId,orderNo    
  vehicleTrade_detail: server2 + '/vehicleTrade/detail',// 10 详情

  // vehicleTrade/tradeListOfSellers  参数 openId status start  (status  0 待处理   1 进行中  2 完成  3 关闭) 卖家的订单列表
  vehicleTrade_tradeListOfSellers: server2 + '/vehicleTrade/tradeListOfSellers',//卖家的订单列表
	// vehicleTrade/tradeListOfBuyers  参数 openId status start  (status  0 待处理   1 进行中  2 完成  3 关闭) 卖家的订单列表
  vehicleTrade_tradeListOfBuyers: server2 + '/vehicleTrade/tradeListOfBuyers',//卖家的订单列表

//   1  有偿转发记录列表  forward/paidForwardList  参数  openId  vehicleId
  forward_paidForwardList: server2 + '/forward/paidForwardList',
// 红包：
//   2  红包转发： redEnvelope/forward 参数  openId  envelopeId groupIds 
  redEnvelope_forward: server2 + '/redEnvelope/forward',
// 3  订单详细： order/orderDetail2  参数  orderNo    增加返回红包ID
  order_detail2: server2 + '/order/orderDetail2',
// 4  收红包：  redEnvelope/unpack  参数  openId  envelopeId 
  redEnvelope_unpack: server2 + '/redEnvelope/unpack',
}

