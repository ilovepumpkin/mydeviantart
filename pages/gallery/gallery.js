var dA = require('../../utils/deviantArt.js')

var app = getApp()

var col1H = 0;
var col2H = 0;

var offset = 0;

Page({
    data: {
        imgWidth: 0,
        col1: [],
        col2: [],
        isLoading: false
    },
    renderImages: function(images) {
        let col1 = this.data.col1;
        let col2 = this.data.col2;

        for (let i = 0; i < images.length; i++) {
            let imageObj = images[i];

            let imageId = imageObj.id;
            let oImgW = imageObj.width;
            let oImgH = imageObj.height;
            let imgWidth = this.data.imgWidth;
            let scale = imgWidth / oImgW;
            let imgHeight = oImgH * scale;

            imageObj.height = imgHeight;


            if (col1H <= col2H) {
                col1H += imgHeight;
                col1.push(imageObj);
            } else {
                col2H += imgHeight;
                col2.push(imageObj);
            }

        }

        let data = {
            col1: col1,
            col2: col2
        };

        this.setData(data);
    },
    loadImages: function() {
        if (offset === null) {
            console.log("all images are loaded already");
            return null;
        }

        if (!this.data.isLoading) {
            this.setData({
                isLoading: true
            });
            var self = this
            console.log(">>>offset:" + offset)
            dA.getAll({
                offset: offset
            }).then(function(resp) {
                let deviations = resp["results"]
                offset = resp["next_offset"]
                console.log(deviations);
                var images = deviations.map(d => {
                    let img = d.thumbs[1]
                    return {
                        "pic": img.src,
                        "id": d.deviationid,
                        "width": img.width,
                        "height": img.height
                    }
                });
                self.renderImages(images)

                self.setData({
                    isLoading: false
                });
            });
        } else {
            console.log("still in the process of fetching data ...");
        }
    },
    onLoad: function() {
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
    },
    showBigView: function(e) {
        let deviationid = e.target.id;
        wx.navigateTo({
            url: "../deviation/deviation?deviationid=" + deviationid
        });
    }
})