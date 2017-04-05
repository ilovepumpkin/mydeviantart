var dA = require('../../utils/deviantArt.js')

var app = getApp()
Page({
	data: {
		deviations: []
	},
	onLoad: function() {
		// dA.fetchAccessToken()
		var self = this
		dA.getAll({
			offset: 0
		}).then(function(deviations) {
			console.log(deviations)
			self.setData({
				deviations: deviations
			})
		});

		dA.getComments("245372DE-D6F8-A2EB-CA61-BF3A76C5AFAC").then(function(comments) {
			console.log(comments)
		})
	}
})