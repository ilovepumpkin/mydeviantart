var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')

import {saveStatsInfo,loadStatsInfo,clearStatsInfo} from '../../utils/authors.js'

const KEY_STATS_INFO = "stats_info"
const KEY_USERNAME = "da_user"

var app = getApp()
Page({
  data: {
    done: false,
    isLoading: false,
    isEdit: false
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
    // wx.hideLoading();
    this.setData({
      isLoading: false
    })
  },
  computeDelta: function(user_deviations, watchers, user_favourites) {
    const oldData = loadStatsInfo();
    let user_deviations_delta,
      watchers_delta,
      user_favourites_delta
    if (oldData) {
      user_deviations_delta = user_deviations - oldData.user_deviations
      watchers_delta = watchers - oldData.watchers
      user_favourites_delta = user_favourites - oldData.user_favourites
    }

    saveStatsInfo(user_deviations, watchers, user_favourites)

    return {
      user_deviations_delta,
      watchers_delta,
      user_favourites_delta
    }
  },
  startEdit: function() {
    // this.setData({
    //   isEdit: true
    // })
    wx.navigateTo({
      url:"/pages/author/author"
    })
  },
  cancelChangeUser: function() {
    this.setData({
      username: util.getCurrentUser(),
      isEdit: false
    })
  },
  saveUser: function() {
    const username = this.data.username
    if (username === util.getCurrentUser()) {
      this.setData({
        isEdit: false
      })
      return;
    }
    dA.whoami(username).then(resp => {
      if (resp.error_description === "user not found." || resp.real_name === "") {
        wx.showToast({
          title: "账号[" + username + "]不存在！",
          duration: 1500
        })
      } else {
        util.changeCurrentUser(username)
        clearStatsInfo()
        this.onLoad()
        this.setData({
          isEdit: false
        })
      }
    })
  },
  onUsernameInput: function(e) {
    const username = e.detail.value
    this.setData({
      username
    })
  },
  onLoad: function() {
    this.setData(Object.assign({}, this.data, app.globalData))

    this.setData({
      isLoading: true
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
      const usericon = (resp.profile_pic && resp.profile_pic.thumbs[0].src) || resp.user.usericon
      const username = resp.user.username
      

      const item = self.item;

      const delta = this.computeDelta(user_deviations, watchers, user_favourites)

      let details = [
        item("账号", username),
        item("名字", real_name),
        item("加入时间", util.formatTime(new Date(joindate))),
        item("作品数", user_deviations, delta.user_deviations_delta),
        item("粉丝数", watchers, delta.watchers_delta)
      ]

      const [imgWidth, imgHeight] = util.calImageSize(150, 150, self.data.winWidth - 220, 150)

      self.setData({
        username,
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