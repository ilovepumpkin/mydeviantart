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
    },
    globalData: {
        userInfo: null,
        scrollH: 0,
        imgWidth: 0,
        winHeight: 0,
        winWidth: 0
    }
})