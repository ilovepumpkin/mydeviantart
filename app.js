import {addAuthor,getAuthors,setAuthors} from './utils/authors'
import {setGroups} from './utils/groups'
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

                console.log("windowWidth:",res.windowWidth)
                console.log("screenWidth:",res.screenWidth)
                console.log("windowHeight:",res.windowHeight)
                console.log("screenHeight:",res.screenHeight)

                that.globalData.imgWidth = imgWidth;
                that.globalData.winHeight = wh;
                that.globalData.winWidth = ww;
            }
        });

        //initialize data
        let authors = getAuthors();
        if (authors.length === 0) {
          const authorsData=[{"username":"ilovepumpkin2014","real_name":"Rui","usericon":"https://a.deviantart.net/avatars/i/l/ilovepumpkin2014.jpg?6","groups":["最爱"]},{"username":"superschool48","real_name":"XiaoJi","usericon":"https://a.deviantart.net/avatars/s/u/superschool48.jpg?1","groups":["最爱"]},{"username":"wlop","real_name":"Wang Ling","usericon":"https://a.deviantart.net/avatars/w/l/wlop.jpg?7","groups":["最爱"]},{"username":"rossdraws","real_name":"Ross Tran","usericon":"https://a.deviantart.net/avatars/r/o/rossdraws.jpg?5","groups":["最爱"]}] 
          setAuthors(authorsData)  
          const defaultAuthor=authorsData.find(author=>author.username==="ilovepumpkin2014")
          util.changeCurrentUser(defaultAuthor)

          setGroups([{name:"最爱"}])  
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