var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')
import imageCard from '../../components/imageCard/imageCard'

var app = getApp()

var offset = 0;
var keyword;
var isLoading = false;

Page({
    data: {
        totalCount: 0,
        message: "请输入搜索关键字"
    },
    onLoad: function() {
        this.resetData()
        this.setData(Object.assign({}, this.data, app.globalData))

        imageCard.init(this, {
            [imageCard.MI_ADD_BOOKMARK]: true
        });
    },
    resetData: function() {
        this.setData({
            totalCount: 0,
            col1: {
                colH: 0,
                data: []
            },
            col2: {
                colH: 0,
                data: []
            }
        })
    },
    doSearch: function(e) {
        keyword = e.detail.value
        console.log("keyword:" + keyword)

        this.resetData();

        const self = this;
        self.setData({
            message: ""
        })

        this.searchMore();
    },
    searchMore: function() {
        if (offset === null) {
            console.log("all images are loaded already");
            wx.showToast({
                title: '已经到最后了噢！',
                duration: 1500
            })
            return null;
        }

        if (!isLoading) {
            wx.showLoading({
                title: "搜索中...."
            })
            isLoading = true
            var self = this
            dA.search(keyword, {
                offset: offset
            }).then(function(resp) {
                let deviations = resp["results"]
                offset = resp["next_offset"]
                console.log(deviations);

                self.setData({
                    totalCount: resp.estimated_total
                })

                const titleWidth = self.data.imgWidth - 130

                var images = deviations.map(d => {
                    let img = d.thumbs[1]
                    return {
                        "pic": img.src,
                        "id": d.deviationid,
                        "width": img.width,
                        "height": img.height,
                        title: d.title,
                        commentCount: d.stats.comments,
                        favouriteCount: d.stats.favourites,
                        titleWidth
                    }
                });
                self.setData(util.decideColumns(images, self.data.imgWidth, self.data.col1, self.data.col2))

                isLoading = false;
                wx.hideLoading();
            });
        } else {
            console.log("still in the process of fetching data ...");
        }
    }
})