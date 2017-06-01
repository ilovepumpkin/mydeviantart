var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')
import {
	getBookmarks,
	deleteBookmark
} from '../../utils/bookmark'

import imageCard from '../../components/imageCard/imageCard'

let offset = 0;
let isLoading = false;

var app = getApp()
Page({
	data: {
		totalCount: 0,
		loadedCount: 0,
		message: "收藏夹是空的,赶紧添加吧！:)"
	},
	onLoad: function() {
		this.setData(Object.assign({}, this.data, app.globalData))

		this.initImageCard();
		this.initLoadBookmarks();
	},
	postDeleteBookmark: function() {
		this.initLoadBookmarks();
	},
	initImageCard: function() {
		imageCard.init(this, {
			[imageCard.MI_DELETE_BOOKMARK]: true
		}, this.postDeleteBookmark);
	},
	onShow: function() {
		this.initLoadBookmarks();
		this.initImageCard();
	},
	loadBookmarks: function() {
		if (offset === null) {
			wx.showToast({
				title: '别拉了，已经到头啦！',
				duration: 1500
			})
			return null;
		}

		if (!isLoading) {
			var self = this
			wx.showNavigationBarLoading()
			isLoading = true;

			const resp = getBookmarks(offset);
			const bookmarks = resp.data;
			offset = resp.next_offset;

			const titleWidth = self.data.imgWidth - 130

			var images = bookmarks.map(b => {
				return {
					"pic": b.imgUrl,
					"id": b.deviationid,
					"width": b.imgWidth,
					"height": b.imgHeight,
					title: b.title,
					titleWidth,
					bookmarkDate: util.formatTime(new Date(b.ts)).split(" ")[0]
				}
			});
			let colData = util.decideColumns(images, self.data.imgWidth, self.data.col1, self.data.col2)
			self.setData(Object.assign({}, colData, {
				loadedCount: bookmarks.length,
				totalCount: resp.totalCount
			}))

			isLoading = false;
			wx.hideNavigationBarLoading();

		} else {
			console.log("still in the process of fetching data ...");
		}
	},
	onPullDownRefresh: function() {
		wx.stopPullDownRefresh()
		this.initLoadBookmarks()
	},
	initLoadBookmarks: function() {
		offset = 0;
		this.setData({
			col1: {
				colH: 0,
				data: []
			},
			col2: {
				colH: 0,
				data: []
			}
		})

		wx.getSystemInfo({
			success: (res) => {
				let ww = res.windowWidth;
				let wh = res.windowHeight;
				let imgWidth = ww * 0.48;
				let scrollH = wh;

				this.setData({
					scrollH: scrollH,
					imgWidth: imgWidth
				});

				this.loadBookmarks(offset);
			}
		});
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