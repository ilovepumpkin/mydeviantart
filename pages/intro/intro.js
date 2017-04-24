//index.js
//获取应用实例
var app = getApp()
Page({
	data: {
		slides: []
	},
	onLoad: function() {
		this.setData(Object.assign({}, this.data, app.globalData))

		const slides = [{
			image: "intro_gallery.jpg",
			text: "直接进入"
		}, {
			image: "intro_image.jpg",
			text: "直接进入"
		}, {
			image: "intro_share.jpg",
			text: "直接进入"
		}, {
			image: "intro_info.jpg",
			text: "直接进入"
		}, {
			image: "intro_author.jpg",
			text: "直接进入"
		}]

		this.setData({
			slides
		})
	},
	enter: function() {
		wx.switchTab({
			url: "/pages/gallery/gallery"
		})
	}
})