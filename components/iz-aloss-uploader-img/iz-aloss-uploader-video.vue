<template>
    <view class="sunui-uploader-bd">
        <view class="sunui-uploader-files">
            <block v-for="(item, index) in images" :key="index">
                <view class="sunui-uploader-file" :class="[item.progress < 100 ? 'sunui-uploader-file-status' : '']"
                    @click="previewImage(index)">
                    <!-- step1.这里修改服务器返回字段 ！！！ -->
                    <!-- <view class="sunui-uploader-file"  @click="previewImage(index)"> -->
                    <image class="sunui-uploader-img" :style="upload_img_wh" src="../../static/video.png" mode="aspectFill" />
                    <view class="sunui-img-removeicon right" @click.stop="removeImage(index,item)" v-show="upimg_move">×
                    </view>
                    <view class="sunui-loader-filecontent" v-if="item.progress < 100">{{ item.progress }}%</view>
                </view>
            </block>
            <view v-show="videodata.length < upload_count" hover-class="sunui-uploader-hover"
                class="sunui-uploader-inputbox" @click="chooseImage" :style="upload_img_wh">
                <view><text class="iconfont icon-mn_shangchuantupian" style="color: #666;"></text></view>
            </view>
        </view>
    </view>
</template>

<script>
    import izUploader from '@/components/iz-aloss-uploader/iz-aloss-uploader.js'
    import http from '@/components/utils/http.js';
    export default {
        data() {
            return {
                images: [],
                videodata: [],
                data: '',
            };
        },
        name: 'upload-img',
        props: {
            // 上传样式宽高
            upload_img_wh: {
                type: String,
                default: 'width:190rpx;height:200rpx;'
            },
            // 上传数量
            upload_count: {
                type: [Number, String],
                default: 6
            },
            // 是否显示删除
            upimg_move: {
                type: Boolean,
                default: true
            },
            // 服务器预览图片
            upimg_preview: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            // 服务器返回预览(看服务器卡顿情况设定)
            upimg_delaytime: {
                type: [Number, String],
                default: 300
            }
        },
        methods: {
            init(imgs, data) {
                this.data = data
                imgs.forEach(img => {
                    this.images.push({
                        path: img.src,
                        url: img.url,
                        uploadTask: null,
                        progress: 100,
                        uploadInfo: null,
                        status: 6,
                        id: img.id
                    })
                })
                this.emit()
            },
            /* ************************上传方法***************************************** */
            upImage() {
                let that = this;
                let promises = []
                console.log(this.images)
                this.images.forEach(img => {
                    if (img.status == 0) {
                        img.status = 1
                        let promise = new Promise(function(resolve, reject) {
                            let uploadTask = izUploader(img.path, 'mp4', data => {
                                that.uploadWebVideo(data)
                                // that.addVod(data)
                                that.emit();
                                resolve(data)
                            }, reject)
                            img.uploadTask = uploadTask
                            uploadTask.onProgressUpdate(async function(res) {
                                img.progress = res.progress
                                img.uploadInfo = res
                            });
                        }).then(res => {
                            img.progress = 100
                            img.status = 2
                            img.url = res
                        }).catch(e => {
                            img.status = 99
                            console.log(e)
                        })
                        promises.push(promise)
                    }
                })

                uni.showLoading({
                    title: `正在上传...`
                });
                console.log("promises===>",promises)
                Promise.all(promises)
                    .then(res => {
                        uni.hideLoading()
                        that.emit()
                    }).catch(function(e) {
                        uni.hideLoading()
                    })
            },
            chooseImage() {
                let that = this;
                uni.chooseVideo({
                    count: 1,
                    sizeType: ['compressed', 'original'],
                    sourceType: ['album', 'camera'],
                    success: function(res) {
                        that.images.push({
                            path: res.tempFilePath,
                            size: res.tempFile.size,
                            url: '',
                            uploadTask: null,
                            progress: 0,
                            uploadInfo: null,
                            status: 0
                        })
                        // for (let i = 0, len = res.tempFiles.length; i < len; i++) {
                        //     that.images.push({
                        //         path: res.tempFiles[i].path,
                        //         size: res.tempFiles[i].size,
                        //         url: '',
                        //         uploadTask: null,
                        //         progress: 0,
                        //         uploadInfo: null,
                        //         status: 0
                        //     })
                        // }
                        that.getOssSign()
                    },
                    fail: function(err) {
                        console.log(err);
                    }
                });
            },
            //上传远程视频到视频点播
            uploadWebVideo(url) {
                let opts = {
                    url: '/cms/media/uploadWebVideo',
                    method: 'post',
                };
                let data = {
                    url: url,
                    title: this.data.keyword,
                    tags: 'dspseo',
                    cateId: '5099',
                    token: uni.getStorageSync('token'),
                };
                http.httpRequest(opts, data).then(res => {
                    if (res.data.code == 200) {
                        this.addVod(res.data.data)
                    } else {}
                }, error => {
                    console.log(error);
                })
            },
            //获取oss获取上传凭证
            getOssSign() {
                let opts = {
                    url: '/cms/media/getOssSign',
                    method: 'post',
                };
                let data = {
                    token: uni.getStorageSync('token'),
                };
                http.httpRequest(opts, data).then(res => {
                    console.log(res)
                    if (res.data.code == 200) {
                        uni.setStorageSync('updatedata', JSON.stringify(res.data.data));
                        this.upImage()
                    }
                }, error => {
                    console.log(error);
                })
            },
            //添加到后台
            addVod(url) {
                let opts = {
                    url: '/cms/media/addVod',
                    method: 'post',
                };
                let data = {
                    keyword_id: this.data.id,
                    keyword: this.data.keyword,
                    media_id: url.VideoId,
                    media_name: "素材库H5",
                    media_ext: "mp4",
                    media_cate_id: "6",
                    media_url: url.VideoId,
                    token: uni.getStorageSync('token'),
                };
                http.httpRequest(opts, data).then(res => {
                    if (res.data.code == 200) {
                        console.log(res, '成功')
                    } else {}
                }, error => {
                    console.log(error);
                })
            },
            previewImage(index) {
                console.log(index)
                let list = []
                this.images.forEach(img => {
                    list.push(img.path)
                })
                console.log(list)
                uni.previewImage({
                    urls: list,
                    current: index,
                    longPressActions: {
                        itemList: ['发送给朋友', '保存图片', '收藏'],
                        success: function(data) {
                            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
                        },
                        fail: function(err) {
                            console.log(err.errMsg);
                        }
                    }
                });
            },
            removeImage(idx,idr) {
                let opts = {
                    url: '/cms/media/delMediaByIds',
                    method: 'post',
                };
                var mycars = new Array();
                mycars[0] = idr.id
                let data = {
                    ids: mycars,
                    keyword_id: this.data.id,
                    type: 1,
                    token: uni.getStorageSync('token'),
                };
                http.httpRequest(opts, data).then(res => {
                    console.log(res)
                    if (res.data.code == 200) {
                        this.images.splice(idx, 1);
                        this.emit();
                        uni.showToast({
                            title: '删除成功',
                            icon: 'none'
                        });
                    }
                }, error => {
                    console.log(error);
                })
            },
            emit() {
                let list = []
                let upSuccessCount = 0
                let upLoadingCount = 0
                this.images.forEach(img => {
                    if (img.status == 2 || img.status == 6) {
                        upSuccessCount++
                        list.push(img.url)
                    }
                    if (img.status == 1) {
                        upLoadingCount++
                    }
                })
                let data = {
                    details: this.images,
                    upLoadingCount: upLoadingCount,
                    upSuccessCount: upSuccessCount,
                    imgCount: this.images.length
                }
                this.$emit('change', data);
            }
        }
    };
</script>

<style lang="scss">
    @font-face {
        font-family: 'iconfont';
        src: url('//at.alicdn.com/iconfont.eot?t=1574391686418');
        /* IE9 */
        src: url('//at.alicdn.com/iconfont.eot?t=1574391686418#iefix') format('embedded-opentype'),
            /* IE6-IE8 */
            url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAMkAAsAAAAAB2QAAALYAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAqCYIJEATYCJAMICwYABCAFhG0HPRt3BhEVlCNkH4dxmzUXNsJHc1SNfR9KTkCtiXv/l+QDBQSFRBJdKoEsg60HUgCsOpWVnWxNx3BvVITqkj3fepbtzM/OfDo4D86iFEIiJAeX02+Bh/O84TLmsrEnYBxQoHtgm6xACoxTkN0zFsgEdQynCShpq7cwbsK0eTKROSkgbNu8cbUspRFrkoNMkC9ZGYWjcrJkX/IIR/zPhz/6hIxELmWmzdowfp1RvxdbYWm1VrUMCO54JvDrSNEbkTCv1DJDGvp6S5VUX9SRdSUHfi+u1cBZ7R+PQMgzEyugNcU5J67DO9VfJiCigD042iuNQqXSunGRfvrWV6/mvX49/+3bhW/eLHr4puOFtxMfvO5w9tX8yv7rIbf3Rrl84Mbe66XSzWet46nn/etMuALua5LqNZUqpKdfDKjsv2qef+yambJsTWM2zDtKIQ0pS7msvSTUpn1tNyts2xZmWUyw3LI4bPisSZNyOUc2y4/scfZs3QZ1UcgqUWtkVednsvnVs7NOHzmqglXIBnqU7+/M9Hp3y3L2RLWYA9uhlat61/LGGwVqt9Nvafv/8R2fmg/pu7LesH9ZOYL3/6e3P6Z2O0rbIztra+Dtc1u2RY1vapOocEtDiT0Kd1VUUkIN42joS19Fk1s1BVmKy0OioA2kMp1REdcbcsr6QV5mJJT0MnF9mbQRchZiET29CAT1fSBR1y1I1fdFRdwPcpr6Q179cIaSBaHRjmVdgxFjCSvGFuonmGYcpK1nESRfUC1dRUm+T3ggeeOEOIiywRwHpDHm+FUlzBIkjT1k5DzsuhEmGi02HGjmKQ1DWfaioBn7gzAWQRWGWqD2BIzGaCDRm4nc+y+QsuhUqKaqyviAiGcGB7FA1AKVS4ZWVddyibdSEoxJQCKjHsjIMNTpjMBUPsxCDRbQPTyTVGh1k20lwfyy/un2QYmpTII1I9Vo+1B4XQ2q0QvwvExGfTgA') format('woff2'),
            url('//at.alicdn.com/iconfont.woff?t=1574391686418') format('woff'), url('//at.alicdn.com/iconfont.ttf?t=1574391686418') format('truetype'),
            /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
            url('//at.alicdn.com/iconfont.svg?t=1574391686418#iconfont') format('svg');
        /* iOS 4.1- */
    }

    @charset "UTF-8";

    .iconfont {
        font-family: 'iconfont' !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-mn_shangchuantupian {
        &:before {
            content: '\e559';
        }

        font-size: 3em;
    }

    .sunui-uploader-img {
        display: block;
    }

    .sunui-uploader-input {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    .sunui-uploader-inputbox {
        position: relative;
        margin-bottom: 16rpx;
        box-sizing: border-box;
        background-color: #FFFFFF;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }

    .sunui-img-removeicon {
        position: absolute;
        color: #fff;
        width: 40upx;
        height: 40upx;
        line-height: 40upx;
        z-index: 2;
        text-align: center;
        background-color: #e54d42;

        &.right {
            top: 0;
            right: 0;
        }
    }

    .sunui-uploader-file {
        position: relative;
        margin-right: 10rpx;
        margin-left: 9rpx;
        margin-bottom: 16rpx;
    }

    .sunui-uploader-file-status:before {
        content: ' ';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .sunui-loader-filecontent {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        z-index: 9;
    }

    .sunui-uploader-bd {
        padding: 26rpx;
        margin: 0;
        // background-color: #F0F0F0;
    }

    .sunui-uploader-files {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-around;
    }

    .sunui-uploader-file:nth-child(4n + 0) {
        //margin-right: 0;
    }

    .sunui-uploader-inputbox>view {
        text-align: center;
    }

    .sunui-uploader-file-status:after {
        content: ' ';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .sunui-uploader-hover {
        box-shadow: 0 0 0 #e5e5e5;
        background: #e5e5e5;
    }
</style>
