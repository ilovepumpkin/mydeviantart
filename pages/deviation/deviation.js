var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')
var wxParse = require('../../wxParse/wxParse.js');

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
    winHeight: 0,
    viewCommentsButtonVisible: false,
    isCommentLoading: false
  },
  buildDetails: function(dev) {
    let details = []
    details.push({
      name: "标题",
      value: dev.title
    });
    details.push({
      name: "类别",
      value: dev.category
    });
    details.push({
      name: "发布时间",
      value: util.formatTime(new Date(dev.published_time * 1000))
    });
    details.push({
      name: "评论数",
      value: dev.stats.comments
    });
    details.push({
      name: "点赞数",
      value: dev.stats.favourites
    });
    details.push({
      name: "文件大小（单位：字节）",
      value: dev.content.filesize
    });
    details.push({
      name: "文件尺寸（宽x高，单位：像素）",
      value: dev.content.width + "x" + dev.content.height
    });
    return details;
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

          //construct detail array
          let details = self.buildDetails(res);

          let viewCommentsButtonVisible = (res.stats.comments + 0) > 0

          let commentScrollHeight = wh * 0.6

          self.setData({
            deviation: res,
            imageSrc: image.src,
            imagewidth: imageSize.imageWidth,
            imageheight: imageSize.imageHeight,
            pageMarginTop: pageMarginTop,
            deviationid: deviationid,
            winWidth: ww,
            winHeight: wh,
            details,
            viewCommentsButtonVisible,
            commentScrollHeight
          })

          //reset offset value to zero
          offset = 0;

        });
      }
    });
  },
  loadComments: function() {

    if (!offset && offset !== 0) {
      console.log("all comments are loaded already");
      wx.showToast({
        title: '已经到最后了噢！',
        duration: 2000
      })
      return null;
    }

    if (!this.data.isCommentLoading) {

      this.setData({
        isCommentLoading: true
      });

      const self = this;
      dA.getComments(this.data.deviationid, {
        offset: offset
      }).then(resp => {

        console.log(resp)

        let newComments = resp.data["thread"];

        offset = resp.data["next_offset"];
        newComments.map(item => {
          let d = new Date(item["posted"])
          item["formattedDate"] = util.formatTime(d);
        })

        let comments = self.data.comments;
        comments = comments.concat(newComments);

        for (let i = 0; i < comments.length; i++) {
          wxParse.wxParse('comment' + i, 'html', comments[i].body, self);
          if (i === comments.length - 1) {
            wxParse.wxParseTemArray("commentTemArray", 'comment', comments.length, self)
          }
        }

        self.setData({
          comments,
          viewCommentsButtonVisible: false
        })

        this.setData({
          isCommentLoading: false
        });
      })

    } else {

      console.log("still in the process of fetching data ...");

    }

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