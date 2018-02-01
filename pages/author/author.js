var dA = require("../../utils/deviantArt.js");
var util = require("../../utils/util.js");

import { findAuthor,getAuthors, addAuthor, deleteAuthor } from "../../utils/authors.js";
import {
  saveStatsInfo,
  loadStatsInfo,
  clearStatsInfo
} from "../../utils/authors.js";

var touchStart = 0;
var touchEnd = 0;

var app = getApp();
Page({
  data: {
    done: false,
    isLoading: false,
    isEdit: false,
    delBtnWidth: 120
  },
  bindPickerChange: function(e) {},
  startEdit: function() {
    this.setData({
      isEdit: true
    });
  },
  cancelChangeUser: function() {
    this.setData({
      username: "",
      isEdit: false
    });
  },
  saveUser: function() {
    const username = this.data.username;
    // if (username === util.getCurrentUser()) {
    //   this.setData({
    //     isEdit: false
    //   })
    //   return;
    // }
    wx.showLoading({
      title: "操作中..."
    });
    dA.whoami(username).then(resp => {
      if (
        resp.error_description === "user not found." ||
        resp.real_name === ""
      ) {
        wx.showToast({
          title: "艺术家[" + username + "]不存在！",
          duration: 2000
        });
      } else {
        if(findAuthor(username)){
          wx.showToast({
            title: "艺术家[" + username + "]已存在！"
          });
        }else{
          addAuthor(username, resp.real_name, resp.user.usericon);
        }
        
        wx.hideLoading();
        this.onLoad();
        this.setData({
          isEdit: false
        });
      }
    });
  },
  onTouchTap: function(e) {
    const touchTime = touchEnd - touchStart;
    console.log("touchTime:" + touchTime);

    const username = e.currentTarget.dataset.username;

    // if (touchTime > 350) {
    //   /*long tap*/
    //   wx.navigateTo({
    //     url: "/pages/him/him?username=" + username
    //   });
    // } else {

    const newAuthor=this.data.authors.find(author=>author.username===username)
    this.switchAuthor(newAuthor);
    // }
  },
  gotoAuthorDetail:function(e){
    const username = e.currentTarget.dataset.username;
    wx.navigateTo({
      url: "/pages/him/him?username=" + username
    });
  },
  onShow: function() {
    this.onLoad();
  },
  switchAuthor: function(author) {
    util.changeCurrentUser(author);
    clearStatsInfo();
    wx.reLaunch({
      url: "/pages/gallery/gallery"
    });
  },
  onDeleteAuthor: function(e) {
    const username = e.currentTarget.dataset.username;

    if (username === this.data.currentUser) {
      wx.showToast({
        title: "不能删除当前用户！"
      });

      var index = e.currentTarget.dataset.index;
      var list = this.data.authors;
      list[index].txtStyle = "left:0px";
      this.setData({
        authors: list
      });
    } else {
      deleteAuthor(username);
      this.onLoad();
    }
  },
  onUsernameInput: function(e) {
    const username = e.detail.value;
    this.setData({
      username
    });
  },
  onLoad: function() {
    let authors = getAuthors();
    if (authors.length === 0) {
      addAuthor(
        "ilovepumpkin2014",
        "Rui",
        "https://a.deviantart.net/avatars/i/l/ilovepumpkin2014.jpg"
      );
    }

    this.setData(Object.assign({}, this.data, app.globalData));

    this.setData({
      authors,
      currentUser: util.getCurrentUser()["username"]
    });
  },
  touchS: function(e) {
    console.log("touchS" + e);

    touchStart = e.timeStamp;
    console.log("touchStart:" + touchStart);

    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function(e) {
    console.log("touchM:" + e);
    var that = this;
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {
        //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {
        //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.authors;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        authors: list
      });
    }
  },
  touchE: function(e) {
    console.log("touchE" + e);

    touchEnd = e.timeStamp;
    console.log("touchEnd:" + touchEnd);

    var that = this;
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle =
        disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.authors;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        authors: list
      });
    }
  }
});
