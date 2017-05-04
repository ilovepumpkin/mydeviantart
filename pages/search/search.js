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

        this.initImageCard();
    },
    initImageCard: function() {
        imageCard.init(this, {
            [imageCard.MI_ADD_BOOKMARK]: true
        });
    },
    onShow: function() {
        this.initImageCard();
        var isLoading = false;
        wx.hideLoading();
    },
    resetData: function() {
        offset = 0;
        keyword = null;
        isLoading = false;
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
        this.resetData();
        keyword = e.detail.value
        console.log("keyword:" + keyword)


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
                console.log("resp:", resp);
                let deviations = resp["results"]
                offset = resp["next_offset"]
                console.log(deviations);

                const totalCount = resp.estimated_total
                if (totalCount === 0) {
                    self.setData({
                        message: "很抱歉，未搜索到任何相关作品"
                    })
                } else {
                    var images = util.formImages(deviations, self.data.imgWidth)
                    let colData = util.decideColumns(images, self.data.imgWidth, self.data.col1, self.data.col2)
                    self.setData(Object.assign({}, colData, {
                        totalCount
                    }))
                }


                isLoading = false;
                wx.hideLoading();
            });
        } else {
            console.log("still in the process of fetching data ...");
        }
    }
})