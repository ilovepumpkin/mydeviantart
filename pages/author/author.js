var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')

import {getAuthors,addAuthor,deleteAuthor} from '../../utils/authors.js'
import {saveStatsInfo,loadStatsInfo,clearStatsInfo} from '../../utils/authors.js'

var touchStart = 0;
var touchEnd = 0;

var app = getApp()
Page({
  data: {
    done: false,
    isLoading: false,
    isEdit: false
  },
  bindPickerChange:function(e){

  },
  startEdit: function() {
    this.setData({
      isEdit: true
    })
  },
  cancelChangeUser: function() {
    this.setData({
      username: "",
      isEdit: false
    })
  },
  saveUser: function() {
    const username = this.data.username
    // if (username === util.getCurrentUser()) {
    //   this.setData({
    //     isEdit: false
    //   })
    //   return;
    // }
    wx.showLoading({
			title: "操作中..."
		})
    dA.whoami(username).then(resp => {
      if (resp.error_description === "user not found." || resp.real_name === "") {
        wx.showToast({
          title: "艺术家[" + username + "]不存在！",
          duration: 2000
        })
      } else {
        addAuthor(username,resp.real_name,resp.user.usericon)
        wx.hideLoading();
        this.onLoad()
        this.setData({
          isEdit: false
        })
      }
    })
  },
  onTouchStart:function (e) {
    touchStart = e.timeStamp;
    console.log("touchStart:" + touchStart);
  },
  onTouchEnd:function (e) {
    touchEnd = e.timeStamp;
    console.log("touchStart:" + touchStart);
  },
  onTouchTap:function (e) {
    const touchTime = touchEnd - touchStart;
    console.log("touchTime:" + touchTime);

    const username=e.currentTarget.dataset.username;

    if (touchTime > 350) {
        /*long tap*/
        wx.navigateTo({
          url: "/pages/him/him?username="+username
        });
    } else {
        this.switchAuthor(username)
    }
  },
  onShow: function() {
    this.onLoad();
  },
  switchAuthor:function(username){
    util.changeCurrentUser(username)
    clearStatsInfo() 
    wx.reLaunch({
      url: "/pages/gallery/gallery"
    })
  },
  onDeleteAuthor:function(e){
    const username=e.currentTarget.dataset.username;
    deleteAuthor(username);
    this.onLoad();
  },
  onUsernameInput: function(e) {
    const username = e.detail.value
    this.setData({
      username
    })
  },
  onLoad: function() {
    let authors=getAuthors();
    if(authors.length===0){
        addAuthor("ilovepumpkin2014","Rui","https://a.deviantart.net/avatars/i/l/ilovepumpkin2014.jpg")
    }
    
    this.setData(Object.assign({}, this.data, app.globalData))

    this.setData({
      authors,
      currentUser:util.getCurrentUser()
    })

  }
})