var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util')
import imageCard from '../../components/imageCard/imageCard'
import searchBar from '../../components/searchBar/searchBar'

var app = getApp()

var col1H = 0;
var col2H = 0;

var offset = 0;

var currentUser;

let keyword;

Page({
  data: {
    totalCount: 0,
    imgWidth: 0,
    col1: {
      colH: 0,
      data: []
    },
    col2: {
      colH: 0,
      data: []
    },
    isLoading: false,
    scrollTop: 0,
    search: {
      searchValue: '',
      showClearBtn: false
    }
  },
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  loadMore:function(){
    if(keyword){
      this.searchMore();
    }else{
      this.loadImages();
    }
  },
  reload:function(){
    if(keyword){
      const keywordBak=keyword;
      this.resetData();
      keyword=keywordBak;
      this.searchMore();
    }else{
      this.initLoadImages();
    }
  },
  loadImages: function () {
    if (offset === null) {
      console.log("all images are loaded already");
      wx.showToast({
        title: '已经到最后了噢！',
        duration: 1500
      })
      return null;
    }

    if (!this.data.isLoading) {
      this.setData({
        isLoading: true
      });
      var self = this
      // dA.getFolderDeviations("1713A913-31B1-5B0D-2538-94BF1B6B7CC7", {
      dA.getFolderDeviations("all", {
        offset: offset
      }).then(function (resp) {
        let deviations = resp["results"]
        offset = resp["next_offset"]
        console.log(deviations);

        if (deviations) {
          getApp().globalData.imageUrls = deviations.map(d => d.content.src)

          var images = util.formImages(deviations, self.data.imgWidth)
          let colData = util.decideColumns(images, self.data.imgWidth, self.data.col1, self.data.col2)
          let totalCount = colData.col1.data.length + colData.col2.data.length;
          self.setData(Object.assign({}, colData, {
            isLoading: false,
            totalCount
          }))
        } else {
          wx.showToast({
            title: '服务器忙，请稍后再试',
            duration: 2000
          })
          self.setData({
            isLoading: false
          });
        }
      });
    } else {
      console.log("still in the process of fetching data ...");
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    this.initLoadImages()
  },
  doSearch: function (val) {
    this.resetData();
    keyword=val;
    console.log("keyword:" + keyword)
    this.searchMore();
  },
  doSearchClear: function () {
    this.resetData();
    this.loadImages();
  },
  initComponents: function () {
    imageCard.init(this, {
      [imageCard.MI_ADD_BOOKMARK]: true
    });

    searchBar.init(this, true)
  },
  onShow: function () {
    this.initComponents();
    const newCurrentUser = util.getCurrentUser();
    if (!currentUser) {
      currentUser = newCurrentUser;
    } else if (currentUser["username"] !== newCurrentUser["username"]) {
      this.initLoadImages();
      currentUser = newCurrentUser;
    }
    this.setData({
      authorPhotoUrl:currentUser["usericon"]
    })
  },
  onLoad: function () {
    this.setData(Object.assign({}, this.data, app.globalData))
    this.initComponents();
    this.initLoadImages();
    // let self = this;
    // wx.getNetworkType({
    //     success: function(res) {
    //         // 返回网络类型, 有效值：
    //         // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
    //         var networkType = res.networkType
    //         if (networkType !== "wifi") {
    //             wx.showModal({
    //                 title: "提示",
    //                 content: "该应用有可能产生较大网络流量，建议在Wifi环境下使用。您确定要继续吗？",
    //                 showCancel: true,
    //                 success: function(res) {
    //                     if (res.confirm) {
    //                         self.initLoadImages();
    //                     } else {

    //                     }
    //                 }
    //             })
    //         } else {
    //             self.initLoadImages();
    //         }
    //     }
    // })
  },
  initLoadImages: function () {
    offset = 0;
    this.setData({
      col1: {
        colH: 0,
        data: []
      },
      col2: {
        colH: 0,
        data: []
      }
    })

    this.loadImages();
  },
  onShareAppMessage: function () {
    return {
      title: '码农也涂鸦',
      path: '/pages/gallery/gallery',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  resetData: function () {
    offset = 0;
    keyword = null;
    this.setData({
      totalCount: 0,
      col1: {
        colH: 0,
        data: []
      },
      col2: {
        colH: 0,
        data: []
      },
      scrollViewHeight: this.data.winHeight - 40,
      isLoading: false
    })
  },
  searchMore: function () {
    if (offset === null) {
      console.log("all images are loaded already");
      wx.showToast({
        title: '别拉了，已经到头啦！'
      })
      return null;
    }

    if (!this.data.isLoading) {
      this.setData({ isLoading: true })
      var self = this
      dA.search(keyword, {
        offset: offset
      }).then(function (resp) {
        console.log("resp:", resp);
        let deviations = resp["results"]
        offset = resp["next_offset"]
        console.log(deviations);

        const totalCount = resp.estimated_total
        if (totalCount === 0) {
          const scrollViewHeight = self.data.winHeight - 40
          self.setData({
            message: "很抱歉，未搜索到任何相关作品",
            scrollViewHeight
          })
        } else {
          var images = util.formImages(deviations, self.data.imgWidth)
          let colData = util.decideColumns(images, self.data.imgWidth, self.data.col1, self.data.col2)
          const scrollViewHeight = self.data.winHeight - 40 - 25
          self.setData(Object.assign({}, colData, {
            totalCount,
            scrollViewHeight
          }))
        }


        self.setData({ isLoading: false })
      });
    } else {
      console.log("still in the process of fetching data ...");
    }
  }
})