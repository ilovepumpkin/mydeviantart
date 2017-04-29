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
    isCommentLoading: false,
    currentSwipperItemIndex: 0
  },
  onShareAppMessage: function() {
    const dev = this.data.deviation;
    return {
      title: dev.title,
      path: '/pages/deviation/deviation?deviationid=' + dev.deviationid,
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
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
    wx.showNavigationBarLoading()

    var deviationid = option.deviationid
    var self = this;

    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;

        dA.getDeviation(deviationid).then(function(res) {

          var image = res.preview

          //construct detail array
          let details = self.buildDetails(res);

          let viewCommentsButtonVisible = (res.stats.comments + 0) > 0

          let commentScrollHeight = wh * 0.6

          wx.setNavigationBarTitle({
            title: res.title
          })

          const [imagewidth, imageheight] = util.calImageSize(image.width, image.height, ww, wh - 30)

          self.setData({
            deviation: res,
            imageSrc: image.src,
            imagewidth,
            imageheight,
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
          item["parsedComment"] = wxParse.wxParse('content', 'html', item.body, self);
        })

        let comments = self.data.comments;
        comments = comments.concat(newComments);

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

    wx.hideNavigationBarLoading()
  },
  handleLoadError: function() {
    wx.hideLoading();
    wx.showToast({
      title: "图片加载失败，请稍后再试"
    });

    wx.hideNavigationBarLoading()
  },
  showActionSheet: function() {
    const self = this;
    let itemList = ['转发', '收藏', '下载原图']
    itemList = ['查看详情']
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            self.setData({
              currentSwipperItemIndex: 1
            })
            break;
          case 1:
            const url = self.data.deviation.content.src.replace("http://", "https://").replace(/orig\d+/, "orig01").replace(/img\d+/, "img01")

            wx.downloadFile({
              url,
              success: function(res) {
                wx.saveFile({
                  tempFilePath: res.tempFilePath,
                  success: function(res) {
                    const savedFilePath = res.savedFilePath;
                    console.log(savedFilePath)
                  },
                  fail: function() {},
                  complete: function() {}
                })
              },
              fail: function() {

              },
              complete: function() {

              }
            })
            break;
          case 2:
            /* a bug here - this API can not pop up the Share menu */
            wx.showShareMenu({
              success: function() {},
              fail: function() {},
              complete: function() {}
            })
            break;
          case 3:

            break;
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  }
})