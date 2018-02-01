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
  onLoad: function(option) {
    const username=option.username;

    this.setData(Object.assign({}, this.data, app.globalData))

    this.setData({
      isLoading: true
    })

    const self = this;
    dA.whoami(username).then(resp => {
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
      // const usericon = (resp.profile_pic && resp.profile_pic.thumbs[0].src) || resp.user.usericon

      let usericon,usericonWidth=55,usericonHeight=55;
      if(resp.profile_pic){
        const thumb=resp.profile_pic.thumbs[0];
        usericon = thumb.src
        usericonWidth=thumb.width
        usericonHeight=thumb.height
      }else{
        usericon = resp.user.usericon
      }

      // const usericon = resp.user.usericon
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

      const [imgWidth, imgHeight] = util.calImageSize(usericonWidth, usericonHeight, self.data.winWidth - 220, 150)

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