var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')

const KEY_STATS_INFO = "stats_info"

var app = getApp()
Page({
    data: {
        done: false
    },
    item: function(name, value, delta) {
        let deltaText;
        let deltaClassName;
        if (delta) {
            deltaText = delta > 0 ? `(+${delta})` : `(${delta})`;
            deltaClassName = delta > 0 ? "deltaGreen" : "deltaRed";
        }
        return {
            name,
            value,
            delta,
            deltaText,
            deltaClassName
        }
    },
    onUserIconLoaded: function() {
        wx.hideLoading();
    },
    saveStatsInfo: function(user_deviations, watchers, user_favourites) {
        wx.setStorageSync(KEY_STATS_INFO, {
            user_deviations,
            watchers,
            user_favourites
        })
    },
    loadStatsInfo: function() {
        return wx.getStorageSync(KEY_STATS_INFO)
    },
    computeDelta: function(user_deviations, watchers, user_favourites) {
        const oldData = this.loadStatsInfo();
        let user_deviations_delta,
            watchers_delta,
            user_favourites_delta
        if (oldData) {
            user_deviations_delta = user_deviations - oldData.user_deviations
            watchers_delta = watchers - oldData.watchers
            user_favourites_delta = user_favourites - oldData.user_favourites
        }

        this.saveStatsInfo(user_deviations, watchers, user_favourites)

        return {
            user_deviations_delta,
            watchers_delta,
            user_favourites_delta
        }
    },
    onLoad: function() {
        this.setData(Object.assign({}, this.data, app.globalData))

        wx.showLoading({
            title: "加载中..."
        })

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

            const delta = this.computeDelta(user_deviations, watchers, user_favourites)

            let details = [item("名字", real_name),
                item("加入时间", util.formatTime(new Date(joindate))),
                item("作品数", user_deviations, delta.user_deviations_delta),
                item("粉丝数", watchers, delta.watchers_delta),
                item("收藏数", user_favourites, delta.user_favourites_delta)
            ]

            const [imgWidth, imgHeight] = util.calImageSize(150, 150, self.data.winWidth - 220, 150)

            self.setData({
                details,
                profile_url,
                usericon,
                imgWidth,
                imgHeight,
                done: true
            })


        })
    }
})