var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')

var app = getApp()
Page({
	data: {},
	item: function(name, value) {
		return {
			name,
			value
		}
	},
	onLoad: function() {
		const self = this;
		dA.whoami().then(resp => {
			console.log(resp)

			const profile_url = resp.profile_url
			const real_name = resp.real_name
			const profile_comments = resp.profile_comments
			const profile_pageviews = resp.profile_pageviews
			const user_comments = resp.user_comments
			const user_deviations = resp.stats.user_deviations
			const user_favourites = resp.stats.user_favourites
			const joindate = resp.user.details.joindate
			const friends = resp.user.stats.friends
			const watchers = resp.user.stats.watchers
			const usericon = resp.profile_pic.thumbs[0].src

			const item = self.item;
			let details = [item("名字", real_name),
				item("加入时间", util.formatTime(new Date(joindate))),
				item("作品数", user_deviations),
				item("粉丝数", watchers),
				item("收藏数", user_favourites)
			]

			self.setData({
				details,
				profile_url,
				usericon
			})
		})
	}
})