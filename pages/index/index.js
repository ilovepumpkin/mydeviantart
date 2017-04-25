import { KEY_INTRO_READ } from '../../constants/constants'

var app = getApp()
Page({
    data: {},
    onLoad: function() {
        var flag = wx.getStorageSync(KEY_INTRO_READ)
        if (flag) {
            wx.switchTab({
                url: "/pages/gallery/gallery"
            })
        } else {
            wx.redirectTo({
                url: "/pages/intro/intro"
            })
        }
    }
})