import {
    KEY_DA_USERNAME,
    KEY_DA_PASSWORD
} from '../../constants/constants'

var app = getApp()
Page({
    data: {
        showPassword: false,
        dAUsername: "",
        dAPassword: ""
    },
    onLoad: function() {
        this.setData({
            dAUsername: wx.getStorageSync(KEY_DA_USERNAME),
            dAPassword: wx.getStorageSync(KEY_DA_PASSWORD)
        })
    },
    onShowPasswordChange: function(e) {
        this.setData({
            showPassword: e.detail.value.includes("showPassword")
        })
    },
    onUsernameInput(e) {
        const username = e.detail.value
        this.setData({
            dAUsername: username
        })
        wx.setStorageSync(KEY_DA_USERNAME, username)
    },
    onPasswordInput(e) {
        const password = e.detail.value
        this.setData({
            dAPassword: password
        })
        wx.setStorageSync(KEY_DA_PASSWORD, password)
    },
    testLogin(e) {

    }
})