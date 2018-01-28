var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')

import {getAuthors,addAuthor,deleteAuthor} from '../../utils/authors.js'
import {saveStatsInfo,loadStatsInfo,clearStatsInfo} from '../../utils/authors.js'

var app = getApp()
Page({
  data: {
    done: false,
    isLoading: false,
    isEdit: false,
    currentUser:util.getCurrentUser()
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
    dA.whoami(username).then(resp => {
      if (resp.error_description === "user not found." || resp.real_name === "") {
        wx.showToast({
          title: "账号[" + username + "]不存在！",
          duration: 1500
        })
      } else {
        addAuthor(username,resp.real_name,resp.user.usericon)
        this.onLoad()
        this.setData({
          isEdit: false
        })
      }
    })
  },
  switchAuthor:function(e){
    const username=e.currentTarget.dataset.username;
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
      authors
    })

  }
})