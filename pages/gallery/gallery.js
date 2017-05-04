var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util')
import imageCard from '../../components/imageCard/imageCard'

var app = getApp()

var col1H = 0;
var col2H = 0;

var offset = 0;

Page({
    data: {
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
        scrollTop: 0
    },
    scroll: function(event) {
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },
    loadImages: function() {
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
            dA.getFolderDeviations("1713A913-31B1-5B0D-2538-94BF1B6B7CC7", {
                offset: offset
            }).then(function(resp) {
                let deviations = resp["results"]
                offset = resp["next_offset"]
                console.log(deviations);

                var images = util.formImages(deviations, self.data.imgWidth)
                let colData = util.decideColumns(images, self.data.imgWidth, self.data.col1, self.data.col2)
                self.setData(Object.assign({}, colData, {
                    isLoading: false
                }))
            });
        } else {
            console.log("still in the process of fetching data ...");
        }
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh()
        this.initLoadImages()
    },
    initImageCard: function() {
        imageCard.init(this, {
            [imageCard.MI_ADD_BOOKMARK]: true
        });
    },
    onShow: function() {
        this.initImageCard();
    },
    onLoad: function() {

        this.initImageCard();

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
    initLoadImages: function() {
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

        wx.getSystemInfo({
            success: (res) => {
                let ww = res.windowWidth;
                let wh = res.windowHeight;
                let imgWidth = ww * 0.48;
                let scrollH = wh - 30;

                this.setData({
                    scrollH: scrollH,
                    imgWidth: imgWidth
                });

                this.loadImages();
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: '码农也涂鸦之dA版',
            path: '/pages/gallery/gallery',
            success: function(res) {
                // 分享成功
            },
            fail: function(res) {
                // 分享失败
            }
        }
    }
})