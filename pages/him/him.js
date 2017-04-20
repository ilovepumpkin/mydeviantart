var menuBar = require('../../components/menuBar/menuBar')

var app = getApp()
Page({
	data: {
		currentPage: 'him'
	},
	onLoad: function() {
		menuBar.init(this);
	}
})