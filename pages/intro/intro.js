import {
	KEY_INTRO_READ
} from '../../constants/constants'
import util from '../../utils/util'

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

		//calculate the best image widht and height
		let [imgWidth, imgHeight] = util.calImageSize(375, 600, this.data.winWidth * 0.8, this.data.winHeight * 0.8);

		this.setData({
			slides,
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