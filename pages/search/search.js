var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')

var app = getApp()
Page({
	data: {
		totalCount: 0,
		message: "请输入搜索关键字"
	},
	onLoad: function() {
		this.resetData()
		this.setData(Object.assign({}, this.data, app.globalData))
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
		const keyword = e.detail.value
		console.log("keyword:" + keyword)


		wx.showLoading({
			title: "搜索中...."
		})

		this.resetData();

		const self = this;
		self.setData({
			message: ""
		})

		dA.search(keyword).then(function(res) {
			const result = util.parseSearchResult(res)
			console.log(result)

			const totalCount = result.length;
			if (totalCount !== 0) {
				self.setData({
					totalCount
				})
				self.setData(util.decideColumns(result, self.data.imgWidth, self.data.col1, self.data.col2))
			} else {
				self.setData({
					message: "未搜索到任何内容，请重新输入搜索关键字"
				})
			}

			wx.hideLoading();
		})
	}
})