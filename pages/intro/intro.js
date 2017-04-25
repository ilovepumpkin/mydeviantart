import { KEY_INTRO_READ } from '../../constants/constants'

var app = getApp()
Page({
    data: {
        slides: []
    },
    onLoad: function() {
        this.setData(Object.assign({}, this.data, app.globalData))

        const slides = [{
            image: "intro_gallery.jpg",
            text: "下拉刷新，上拉加载"
        }, {
            image: "intro_image.jpg",
            text: "点缩略图，浏览大图"
        }, {
            image: "intro_share.jpg",
            text: "点右上角，轻松转发"
        }, {
            image: "intro_info.jpg",
            text: "左右滑动，查看详情"
        }, {
            image: "intro_author.jpg",
            text: "点点点”他“，了解作者"
        }]


        this.setData({
            slides
        })

        //calculate the best image widht and height
        this.calImageSize();
    },
    calImageSize: function() {
        const winWidth = this.data.winWidth;
        const winHeight = this.data.winHeight;

        const origImgWidth = 375
        const origImgHeight = 600

        let imgWidth = 0
        let imgHeight = 0

        if (origImgHeight > (winHeight - 70)) {
            imgHeight = winHeight * 0.8
            imgWidth = imgHeight * origImgWidth / origImgHeight
        } else {
            imgWidth = winWidth * 0.8
            imgHeight = imgWidth * origImgHeight / origImgWidth
        }

        this.setData({
            imgWidth,
            imgHeight
        })
    },
    enter: function() {
        wx.setStorageSync(KEY_INTRO_READ, true)

        wx.switchTab({
            url: "/pages/gallery/gallery"
        })
    }
})