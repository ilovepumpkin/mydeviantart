var menuBar = require('../../components/menuBar/menuBar')

var app = getApp()
Page({
	data: {
		currentPage: 'favorite'
	},
	onLoad: function() {
		menuBar.init(this);
	}
})