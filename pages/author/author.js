var dA = require('../../utils/deviantArt.js')
var util = require('../../utils/util.js')

import {getAuthors,addAuthor,deleteAuthor} from '../../utils/authors.js'

var app = getApp()
Page({
  data: {
    done: false,
    isLoading: false,
    isEdit: false
  },
  bindPickerChange:function(e){

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