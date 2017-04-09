var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')

Page({
  data: {
    imageSrc: "",
    deviation: {},
    imagewidth: 0,
    imageheight: 0,
    isLoading: false,
    done: false,
    pageMarginTop: 0
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    this.onLoad();
  },
  onLoad: function(option) {
    wx.showLoading({
      title: "加载中..."
    });
    var deviationid = option.deviationid
    var self = this;

    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;

        dA.getDeviation(deviationid).then(function(res) {
          var image = res.preview
          var imageSize = util.resizeImage(image.width, image.height);

          var pageMarginTop = 0;
          if (imageSize.imageHeight + 30 < wh) {
            pageMarginTop = (wh - (imageSize.imageHeight + 30)) / 2
          }

          self.setData({
            deviation: res,
            imageSrc: image.src,
            imagewidth: imageSize.imageWidth,
            imageheight: imageSize.imageHeight,
            pageMarginTop: pageMarginTop
          })
        });
      }
    });
  },
  handleLoadSuccess: function() {
    wx.hideLoading();
    this.setData({
      done: true
    })
  },
  handleLoadError: function() {
    wx.hideLoading();
    wx.showToast({
      title: "图片加载失败，请稍后再试"
    });
  }
})