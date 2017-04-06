var dA = require('../../utils/deviantArt.js')

var app = getApp()

var col1H = 0;
var col2H = 0;

Page({
    data: {
        images: [],
        scrollH: 0,
        imgWidth: 0,
        loadingCount: 0,
        col1: [],
        col2: []
    },
    onImageLoad: function(e) {
        let imageId = e.currentTarget.id;
        let oImgW = e.detail.width; 
        let oImgH = e.detail.height;
        let imgWidth = this.data.imgWidth;
        let scale = imgWidth / oImgW; 
        let imgHeight = oImgH * scale; 

        let images = this.data.images;
        let imageObj = null;

        for (let i = 0; i < images.length; i++) {
            let img = images[i];
            if (img.id === imageId) {
                imageObj = img;
                break;
            }
        }

        imageObj.height = imgHeight;

        let loadingCount = this.data.loadingCount - 1;
        let col1 = this.data.col1;
        let col2 = this.data.col2;

        if (col1H <= col2H) {
            col1H += imgHeight;
            col1.push(imageObj);
        } else {
            col2H += imgHeight;
            col2.push(imageObj);
        }

        let data = {
            loadingCount: loadingCount,
            col1: col1,
            col2: col2
        };

        if (!loadingCount) {
            data.images = [];
        }

        this.setData(data);
    },
    loadImages:function(){
        var self = this
        dA.getAll({
            offset: 0
        }).then(function(deviations) {
            console.log(deviations);
            var images = deviations.map(d => {
                return { "pic": d.preview.src, "id": d.deviationid }
            });
            self.setData({
                images: images,
                loadingCount: images.length
            });
        });
    },
    onLoad:function(){
        wx.getSystemInfo({
            success: (res) => {
                let ww = res.windowWidth;
                let wh = res.windowHeight;
                let imgWidth = ww * 0.48;
                let scrollH = wh;

                this.setData({
                    scrollH: scrollH,
                    imgWidth: imgWidth
                });

                this.loadImages();
            }
        })
    }
})