var Promise = require('../libs/bluebird.min')

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}


function wxPromisify(fn) {
    return function(obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = function(res) {
                resolve(res)
            }

            obj.fail = function(res) {
                reject(res)
            }

            fn(obj)
        })
    }
}

function resizeImage(originalWidth, originalHeight) {
    var imageSize = {};
    var originalScale = originalHeight / originalWidth; //图片高宽比 
    wx.getSystemInfo({
        success: function(res) {
            var windowWidth = res.windowWidth;
            var windowHeight = res.windowHeight;
            var windowscale = windowHeight / windowWidth; //屏幕高宽比 
            if (originalScale < windowscale) { //图片高宽比小于屏幕高宽比 
                //图片缩放后的宽为屏幕宽 
                imageSize.imageWidth = windowWidth;
                imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
            } else { //图片高宽比大于屏幕高宽比 
                //图片缩放后的高为屏幕高 
                imageSize.imageHeight = windowHeight;
                imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
            }

        }
    })
    return imageSize;
}

module.exports = {
    formatTime: formatTime,
    wxPromisify: wxPromisify,
    resizeImage: resizeImage
}