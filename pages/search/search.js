var menuBar = require('../../components/menuBar/menuBar')

var app = getApp()
Page({
	data: {
		currentPage: 'search'
	},
	onLoad: function() {
		menuBar.init(this);

		this.setData(app.globalData)
	}
})