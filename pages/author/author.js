var dA = require("../../utils/deviantArt.js");
var util = require("../../utils/util.js");
import searchBar from '../../components/searchBar/searchBar'

import {
  findAuthor,
  getAuthors,
  addAuthor,
  deleteAuthor
} from "../../utils/authors.js";
import {
  saveStatsInfo,
  loadStatsInfo,
  clearStatsInfo
} from "../../utils/authors.js";

import {
  findGroup,
  getGroups,
  addGroup,
  deleteGroup
} from "../../utils/groups.js";

var touchStart = 0;
var touchEnd = 0;

let authorsBak;

const LABEL_NEW_GROUP="[新建]"
const LABEL_ALL="全部"

var app = getApp();
const scrollViewHeight=app.globalData["winHeight"]-80*app.globalData["winWidth"]/750;
const dialogHeight=scrollViewHeight*0.8
const dialogWidth=app.globalData["winWidth"]*0.9

Page({
  data: {
    done: false,
    isLoading: false,
    isEdit: false,
    delBtnWidth: 120,
    search: {
      searchValue: '',
      showClearBtn: false
    },
    scrollViewHeight:scrollViewHeight,
    addIconY:scrollViewHeight-80,
    addIconX:app.globalData["winWidth"]-80,
    groups:[],
    currentTab:LABEL_ALL,
    dialogHeight:dialogHeight,
    dialogWidth:dialogWidth,
    dialogTop:(scrollViewHeight-dialogHeight)/2,
    dialogLeft:(app.globalData["winWidth"]-dialogWidth)/2,
    showModal:false,
    authorGroups:[]
  },
  loadGroups:function(){
    let groups=getGroups();
    groups.unshift({name:LABEL_ALL})
    groups.unshift({name:LABEL_NEW_GROUP})
    return groups;
  },
  buildAuthorGroups:function(username){
    let groups=getGroups();
    const authorGroups=findAuthor(username)["groups"]||[]
    groups=groups.map(grp=>{
      return {
        name:grp.name,
        checked:authorGroups.includes(grp.name)
      }
    })
    return groups;
  },
  doSearch: function (val) {
    const filteredAuthors=authorsBak.filter(author=>author.username.toLowerCase().includes(val)||author.real_name.toLowerCase().includes(val))
    this.setData({
      authors:filteredAuthors
    })
  },
  doSearchClear: function () {
    this.setData({
      authors:authorsBak
    })
  },
  bindPickerChange: function (e) { },
  startEdit: function () {
    this.setData({
      isEdit: true
    });
  },
  cancelChangeUser: function () {
    this.setData({
      username: "",
      isEdit: false
    });
  },
  saveUser: function () {
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
        if (findAuthor(username)) {
          wx.showToast({
            title: "艺术家[" + username + "]已存在！"
          });
        } else {
          const author = addAuthor(username, resp.real_name, resp.user.usericon);
          const authors = this.data.authors
          authors.push(author)
          authorsBak=authors;
          this.setData({
            authors
          });
        }

        wx.hideLoading();
        this.setData({
          isEdit: false
        });
      }
    });
  },
  onTouchTap: function (e) {
    const touchTime = touchEnd - touchStart;
    console.log("touchTime:" + touchTime);

    const username = e.currentTarget.dataset.username;

    // if (touchTime > 350) {
    //   /*long tap*/
    //   wx.navigateTo({
    //     url: "/pages/him/him?username=" + username
    //   });
    // } else {

    const newAuthor = this.data.authors.find(
      author => author.username === username
    );
    this.switchAuthor(newAuthor);
    // }
  },
  gotoAuthorDetail: function (e) {
    const username = e.currentTarget.dataset.username;
    // wx.navigateTo({
    //   url: "/pages/him/him?username=" + username
    // });

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

      const content=`账号:　${username}\r\n名字:　${real_name}\r\n加入时间:　${util.formatTime(new Date(joindate))}\r\n作品数:　${user_deviations}\r\n粉丝数:　${watchers}`
      const title="信息"
      wx.showModal({
        title,
        content,
        showCancel:false
      })

      this.setData({
        isLoading: false
      })
    })
  },
  onShow: function () {
    this.onLoad();
  },
  switchAuthor: function (author) {
    util.changeCurrentUser(author);
    clearStatsInfo();
    wx.reLaunch({
      url: "/pages/gallery/gallery"
    });
  },
  onDeleteAuthor: function (e) {
    const username = e.currentTarget.dataset.username;

    if (username === this.data.currentUser["username"]) {
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
      const authors = this.data.authors
      authors.splice(authors.findIndex(author => author.username === username), 1)
      authorsBak=authors;
      this.setData({
        authors
      });
    }
  },
  onUsernameInput: function (e) {
    const username = e.detail.value;
    this.setData({
      username
    });
  },
  onLoad: function () {
    searchBar.init(this)

    let authors = getAuthors();
    const currentGroup=this.data.currentTab
    if(currentGroup!==LABEL_ALL&&currentGroup!==LABEL_NEW_GROUP){
      authors=authors.filter(author=>(authors.groups||[]).includes(currentGroup))
    }
    authorsBak=authors;

    this.setData(Object.assign({}, this.data, app.globalData));

    this.setData({
      authors,
      currentUser: util.getCurrentUser(),
      groups:this.loadGroups()
    });
  },
  touchS: function (e) {
    console.log("touchS" + e);

    touchStart = e.timeStamp;
    console.log("touchStart:" + touchStart);

    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    console.log("touchM:" + e);
    var that = this;
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      const moveY = e.touches[0].clientY;
      var disY = Math.abs(that.data.startY - moveY);

      if (disY < 1) {
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
    }
  },
  touchE: function (e) {
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
        disX > delBtnWidth * 0.75 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.authors;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        authors: list
      });
    }
  },
  // 点击标题切换当前页时改变样式
  switchNav:function(e){
      var cur=e.target.dataset.current;
      if(this.data.currentTab===cur){return false;}
      else{
          this.setData({
              currentTab:cur
          })
          this.onLoad();
      }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor:function(){
    if (this.data.currentTab>4){
      this.setData({
        scrollLeft:300
      })
    }else{
      this.setData({
        scrollLeft:0
      })
    }
  },
  onGroupnameInput: function (e) {
    const groupName = e.detail.value;
    this.setData({
      groupName
    });
  },
  cancelCreateGroup:function(){
    this.setData({
      groupName:"",
      currentTab:LABEL_ALL
    });
  },
  createGroup:function(){
    if(!this.data.groupName||this.data.groupName.trim().length===0){
      wx.showToast({
        title:"请输入组名"
      })   
      return;
    }else{
      addGroup(this.data.groupName)
      this.setData({
        groupName:"",
        currentTab:LABEL_ALL
      })
      this.onLoad();
    }
  },
  deleteGroup:function(){
    deleteGroup(this.data.currentTab)
    this.setData({
      currentTab:LABEL_ALL
    })
    this.onLoad();
  },
  onEditIconTap:function(e){
    console.log("edit icon clicked!")
    const username = e.currentTarget.dataset.username;
    const groups=this.buildAuthorGroups(username);
    this.setData({
      showModal:true,
      authorGroups:groups
    })
  },
  onCancelGroup:function(){
    this.setData({
      showModal:false,
      authorGroups:[]
    })
  },
  onConfirmGroup:function(){

  }
});
