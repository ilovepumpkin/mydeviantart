var menuBar = require('../../components/menuBar/menuBar')

var app = getApp()
Page({
	data: {
		currentPage: 'him'
	},
	onLoad: function() {
		for (let funcName in menuBar) {
			this[[funcName]] = menuBar[funcName]
		}
	}
})