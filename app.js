import {addAuthor,getAuthors} from './utils/authors'
const util = require('./utils/util.js')

//app.js
App({
    onLaunch: function() {
        var that = this
        wx.getSystemInfo({
            success: (res) => {
                let ww = res.windowWidth;
                let wh = res.windowHeight;
                let imgWidth = ww * 0.48;
                let scrollH = wh;

                that.globalData.imgWidth = imgWidth;
                that.globalData.winHeight = wh;
                that.globalData.winWidth = ww;
            }
        });

        let authors = getAuthors();
        if (authors.length === 0) {
          const author=addAuthor(
            "ilovepumpkin2014",
            "Rui",
            "https://a.deviantart.net/avatars/i/l/ilovepumpkin2014.jpg"
          );
          util.changeCurrentUser(author)
        }
    },
    globalData: {
        userInfo: null,
        scrollH: 0,
        imgWidth: 0,
        winHeight: 0,
        winWidth: 0,
        imageUrls:[]
    }
})