var parames = {
    left: 0, top: 0,
    currentX: 0,
    currentY: 0,
    flag: false
}

// 获取相关CSS
// IE 支持currentStyle
// getComputedStyle获取所有外部样式，包括class
var getCss = function (target, key) {
    return target.currentStyle ? target.currentStyle[key] : document.defaultView.getComputedStyle(target, false)[key];
}

var startDrag = function (bar, target, callback) {
    if (getCss(target, "left") !== "auto") {
        parames.left = getCss(target, "left");
    }
    if (getCss(target, "top") !== "auto") {
        parames.left = getCss(target, "top");
    }
    // bar是移动对象
    // 鼠标摁下
    bar.onmousedown = function (event) {
        parames.flag = true;
        if (!event) {
            event = window.event;
            bar.onselectstart = function () {
                return false;
            }
        }
        parames.currentX = event.clientX;
        parames.currentY = event.clientY;
    };
    // 鼠标弹起
    document.onmouseup = function () {
        parames.flag = false;
        if (getCss(target, "left") !== "auto") {
            parames.left = getCss(target, "left");
        }
        if (getCss(target, "top") !== "auto") {
            parames.left = getCss(target, "top");
        }
    }
    // 鼠标移动
    document.onmousemove = function (event) {
        var e = event ? event : window.event;
        if (parames.flag) {
            var nowX = e.clientX, nowY = e.clientY;
            var disX = nowX - parames.currentX, disY = nowY - parames.currentY;
            target.style.left = parseInt(parames.left) + disX + "px";
            target.style.top = parseInt(parames.top) + disY + "px";
        }
        if (typeof callback == "function") {
            callback(parseInt(parames.left + disX, parseInt(parames.top) + disY));
        }
    }
}

