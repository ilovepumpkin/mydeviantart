var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')
var wxParse = require('../../wxParse/wxParse.js');
import { addBookmark } from '../../utils/bookmark.js'

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
    this.setData({
      isLoading: true
    })

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

          if(viewCommentsButtonVisible){
            self.loadComments();
          }
        });
      }
    });
  },
  loadComments: function() {

    if (!offset && offset !== 0) {
      console.log("all comments are loaded already");
      wx.showToast({
        title: '别拉了，已经到头啦！',
        duration: 2000
      })
      return null;
    }

    if (!this.data.isCommentLoading) {

      // this.setData({
      //   isCommentLoading: true
      // });

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

        // this.setData({
        //   isCommentLoading: false
        // });

        self.handleLoadSuccess();

      })

    } else {

      console.log("still in the process of fetching data ...");

    }

  },
  handleLoadSuccess: function() {
    // wx.hideLoading();
    this.setData({
      done: true,
      isLoading: false
    })

    wx.hideNavigationBarLoading()
  },
  handleLoadError: function() {
    this.setData({
      isLoading: false
    })
    wx.showToast({
      title: "哎呦！图片加载失败了，:(，稍后再试吧！"
    });

    wx.hideNavigationBarLoading()
  },
  showActionSheet: function() {
    const self = this;
    let itemList = ['转发', '下载原图']
    itemList = ['查看详情', '收藏', '保存到相册']
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
          const dev = self.data.deviation;
          const thumb = dev.thumbs[1];
          const result = addBookmark(dev.deviationid, dev.title, thumb.src, thumb.width, thumb.height);
          if (result) {
            wx.showToast({
              title: "收藏成功啦！",
              icon: "success",
              duration: 1500
            })
          } else {
            wx.showToast({
              title: "哎呦，收藏出错了！",
              duration: 1500
            })
          }
          break;
        case 2:
          const url = self.data.deviation.content.src.replace("http://", "https://").replace(/orig\d+/, "orig01").replace(/img\d+/, "img01")

          const saveToAlbum = (savedFilePath) => {
            wx.saveImageToPhotosAlbum({
              filePath: savedFilePath,
              success(res) {
                wx.showToast({
                  title: "保存成功啦！",
                  icon: "success",
                  duration: 1500
                })
              },
              fail() {
                wx.showToast({
                  title: "哎呦，保存出错了！",
                  duration: 1500
                })
              },
              complete() {}
            })
          }

          wx.downloadFile({
            url,
            success: function(res) {
              wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function(res) {
                  const savedFilePath = res.savedFilePath;
                  console.log(savedFilePath)

                  wx.getSetting({
                    success(res) {
                      if (!res.authSetting['scope.writePhotosAlbum']) {
                        wx.authorize({
                          scope: 'scope.writePhotosAlbum',
                          success() {
                            saveToAlbum(savedFilePath)
                          }
                        })
                      } else {
                        saveToAlbum(savedFilePath)
                      }
                    }
                  })
                },
                fail: function() {},
                complete: function() {}
              })
            },
            fail: function() {},
            complete: function() {}
          })
          break;
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  }
})