var Promise = require('../libs/bluebird.min')
var Parser = require('../libs/xmldom/dom-parser')

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

function parseSearchResult(xml) {
    var XMLParser = new Parser.DOMParser()
    var doc = XMLParser.parseFromString(xml)
    const channel = doc.getElementsByTagName("channel")[0]
    const items = channel.getElementsByTagName("item")


    const getItemValue = function(parent, elemName) {
        return parent.getElementsByTagName(elemName)[0].firstChild.nodeValue
    }

    const getItemAttrs = function(parent, elemName, index, attrNames) {
        const node = parent.getElementsByTagName(elemName)[index]
        let obj = {}
        attrNames.forEach(attrName => {
            obj[[attrName]] = node.getAttribute(attrName)
        })
        return obj;
    }

    let jsonResult = []
    const count = items.length;
    for (let i = 0; i < count; i++) {
        const item = items.item(i)

        const title = getItemValue(item, "title")
        const pubDate = getItemValue(item, "pubDate")
        const thumb = getItemAttrs(item, "media:thumbnail", 1, ["url", "width", "height"])
        jsonResult.push({
            title,
            pubDate,
            pic: thumb.url,
            height: thumb.height,
            width: thumb.width
        })

    }

    return jsonResult;
}

function decideColumns(images, imgWidth, col1, col2) {

    let col1H = col1.colH;
    let col2H = col2.colH;

    for (let i = 0; i < images.length; i++) {
        let imageObj = images[i];

        let oImgW = imageObj.width;
        let oImgH = imageObj.height;
        let scale = imgWidth / oImgW;
        let imgHeight = oImgH * scale;

        imageObj.height = imgHeight;

        const infoContainerHeight = 30;

        if (col1H <= col2H) {
            col1H += imgHeight + infoContainerHeight;
            col1.data.push(imageObj);
        } else {
            col2H += imgHeight + infoContainerHeight;
            col2.data.push(imageObj);
        }
    }

    col1.colH = col1H
    col2.colH = col2H

    let data = {
        col1,
        col2
    };

    return data;
}

module.exports = {
    formatTime,
    wxPromisify,
    resizeImage,
    parseSearchResult,
    decideColumns
}