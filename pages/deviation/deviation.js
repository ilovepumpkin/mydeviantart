var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')

var offset = 0;

Page({
  data: {
    imageSrc: "",
    deviation: {},
    imagewidth: 0,
    imageheight: 0,
    isLoading: false,
    done: false,
    pageMarginTop: 0,
    comments: [],
    deviationid: null,
    winWidth: 0,
    winHeight: 0
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
            pageMarginTop: pageMarginTop,
            deviationid: deviationid,
            winWidth: ww,
            winHeight: wh
          })

          //fetch comments
          offset = 0;
          self.loadComments()

        });
      }
    });
  },
  loadComments: function() {
    if (offset === null) {
      console.log("all comments are loaded already");
      wx.showToast({
        title: '已经到最后了噢！',
        duration: 2000
      })
      return null;
    }
    const self = this;
    dA.getComments(this.data.deviationid, {
      offset: offset
    }).then(resp => {
      offset = resp["next_offset"];
      resp.map(item => {
        let d = new Date(item["posted"])
        item["formattedDate"] = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
      })
      self.setData({
        comments: resp
      })
    })
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