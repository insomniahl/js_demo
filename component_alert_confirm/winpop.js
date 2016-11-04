(function (window, jQuery, undefined) {

    // 组件样式
    var HTMLS = {
        ovl: '<div class="WinpopMask winpop-mask" id="WinpopMask"></div>' + '<div class="WinpopBox winpop-box" id="WinpopBox">' + '<div class="WinpopMain winpop-main"></div>' + '<div class="WinpopBtns winpop-btns"></div>' + '</div>',
        alert: '<input type="button" class="AltBtn pop-btn alert-button" value="确定">',
        confirm: '<input type="button" class="CfmFalse pop-btn confirm-false" value="取消">' + '<input type="button" class="CfmTrue pop-btn confirm-true" value="确定">'
    }

    // 组件对象
    function Winpop() {
        this.config = {};
        this.get = function (n) {
            return this.config[n];
        }

        this.set = function (n, v) {
            this.config[n] = v;
        }
        this.init();
    }

    // 组件原型
    Winpop.prototype = {
        // 初始化
        init: function () {
            this.createDom();
            this.bindEvent();
        },
        // 获取jquery对象
        createDom: function () {
            var body = jQuery("body"),
                ovl = jQuery("#WinpopBox");

            if (ovl.length === 0) {
                body.append(HTMLS.ovl);
            }

            this.set("ovl", jQuery("#WinpopBox"));
            this.set("mask", jQuery("#WinpopMask"));
        },
        // 绑定事件
        bindEvent: function () {
            var _this = this,
                ovl = _this.get("ovl"),
                mask = _this.get("mask");
            // alert事件
            ovl.on("click", ".AltBtn", function (e) {
                _this.hide();
            });
            // confirm确定事件
            ovl.on("click", ".CfmTrue", function (e) {
                var cb = _this.get("confirmBack");
                _this.hide();
                cb && cb(true);
            });
            // confirm取消事件            
            ovl.on("click", ".CfmFalse", function (e) {
                var cb = _this.get("confirmBack");
                _this.hide();
                cb && cb(false);
            });
            // 遮罩层事件
            mask.on("click", function (e) {
                _this.hide();
            });
            // 快捷键
            jQuery(document).on("keyup", function (e) {
                var kc = e.keyCode,
                    cb = _this.get("confirmBack");
                if (kc === 27) {
                    _this.hide();
                } else if (kc === 13) {
                    if (_this.get("type") === "confirm") {
                        jQuery(".CfmTrue").trigger("click");                  
                    } else if (_this.get("type") === "alert") {
                        jQuery(".AltBtn").trigger("click");                  
                    }
                }
            });
        },
        // alert事件
        alert: function (str, btnstr) {
            var str = typeof str === 'string' ? str : str.toString(),
                ovl = this.get("ovl");
            // 设置弹出框类型
            this.set("type", "alert");
            // 显示样式
            ovl.find(".WinpopMain").html(str);
            if (typeof btnstr == "undefined") {
                ovl.find(".WinpopBtns").html(HTMLS.alert);
            } else {
                ovl.find(".WinpopBtns").html(btnstr);
            }
            this.show();
        },
        // confirm事件
        confirm: function (str, callback) {
            var str = typeof str === 'string' ? str : str.toString(),
                ovl = this.get("ovl");
            // 设置弹出框类型
            this.set("type", "confirm");
            ovl.find(".WinpopMain").html(str);
            ovl.find(".WinpopBtns").html(HTMLS.confirm);
            // 设置回调函数
            this.set("confirmBack", (callback || function () { }));
            this.show();
        },
        // 调用jquery对象的show方法
        show: function () {
            this.get("ovl").show();
            this.get("mask").show();
        },
        // 调用jquery对象的hide方法,并重置内容
        hide: function () {
            var ovl = this.get("ovl");
            ovl.find(".WinpopMain").html("");
            ovl.find(".WinpopBtns").html("");
            ovl.hide();
            this.get("mask").hide();
        },
        // 清除插件
        destory: function () {
            this.get("ovl").remove();
            this.get("mask").remove();
            delete window.alert;
            delete window.confirm;
        }
    };

    // 实例化
    var obj = new Winpop();
    // 重写alert, confirm事件
    window.alert = function (str) {
        // 设置this指向
        obj.alert.call(obj, str);
    };
    window.confirm = function (str, cb) {
        obj.confirm.call(obj, str, cb);
    };
})(window, jQuery);