(function () {
    var Sunset = window.Sunset = window.Sunset || {};

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    var code = getQueryString('code');

    Sunset.Wechat = {
        debug: false,
        jsApiList: ['scanQRCode'],
        _openId: null,
        getOpenId: function () {
            var self = this;
            return new Promise(function (resolve) {
                if (self._openId) {
                    resolve(self._openId);
                } else {
                    return $.ajax({
                        url: '/wechat/getOAuthAccessToken',
                        data: {
                            code: code
                        }
                    }).then(function (res) {
                        resolve(self._openId = res.data && res.data.openid);
                    });
                }
            });
        },
        pay: function (payParams) {
            return new Promise(function (resolve, reject) {
                function onBridgeReady() {
                    //当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
                    //公众号支付
                    WeixinJSBridge.invoke('getBrandWCPayRequest', payParams, function (res) {
                        //alert(JSON.stringify(res));
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            resolve(res);
                        } else {
                            reject(res);
                        }
                        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        //因此微信团队建议，当收到ok返回时，向商户后台询问是否收到交易成功的通知，若收到通知，前端展示交易成功的界面；若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前	展示相应的界面。
                    });
                }
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            });
        },
        _pending: false,
        _configed: false,
        _waits: [],
        configParams: {},
        config: function (params) {
            var self = this;
            return new Promise((resolve, reject) => {
                if (self._configed) {
                    resolve(self._configed);
                } else {
                    self._waits.push(resolve);
                    if (!self._pending) {
                        self._pending = true;
                        var data = Object.assign({}, this.configParams);
                        data.url = location.href.split('#')[0];
                        $.ajax({
                            url: '/service/system/wechat/apiTicket', //'/wechat/getJsSdkConfig',
                            type: 'GET',
                            data: data
                        }).then(function (res) {
                            if (res && res.data) {
                                wx.ready(function () {
                                    var waits = self._waits;
                                    while (waits.length) {
                                        waits.shift()();
                                    }
                                    self._configed = true;
                                    self._pending = false;
                                });
                                wx.error(function (res) {
                                    reject();
                                });
                                var config = res.data;
                                config.debug = self.debug;
                                config.jsApiList = self.jsApiList;
                                delete config.jsapi_ticket;
                                wx.config(config);
                            } else {
                                reject(e);
                            }
                        }, function (e) {
                            reject(e);
                        });
                    }
                }
            });
        },
        cmd() {
            var func = arguments[0],
                args = [].slice.call(arguments, 1),
                self = this;
            return this.config().then(function () {
                return self[func].apply(self, args);
            });
        },
        scanQRCode(byWechatSelf) {
            return new Promise(function (resolve, reject) {
                wx.scanQRCode({
                    needResult: byWechatSelf ? 0 : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        resolve(res.resultStr);
                        //var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    }
                });
            });
        }
    }

})();