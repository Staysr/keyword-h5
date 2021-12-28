<template>
    <view>
        <view class="cu-bar bg-white">
            <view class="action">
                <text class="cuIcon-title text-green"></text>
                <text>{{ data.keyword }}</text>
            </view>
        </view>
        <scroll-view scroll-x class="bg-white nav text-center" style="margin-top: 20rpx;">
            <view class="cu-item" :class="0==TabCur?'text-blue cur':''" @tap="tabSelect" data-id="0">
                <text class="cuIcon-pic"></text> 图片
            </view>
            <view class="cu-item" :class="1==TabCur?'text-blue cur':''" @tap="tabSelect" data-id="1">
                <text class="cuIcon-record"></text> 视频
            </view>
            <view class="cu-item" :class="2==TabCur?'text-blue cur':''" @tap="tabSelect" data-id="2">
                <text class="cuIcon-text"></text> 文字
            </view>
        </scroll-view>
        <!-- 图片 -->
        <view v-if="TabCur == 0">
            <view class="cu-bar bg-white margin-top">
                <view class="action">
                    图片上传
                </view>
                <view class="action">
                    {{imgList.length}}张
                </view>
                <!-- <view v-if="imgList.length == 9" class="action">
                    因上传数量被官方限制目前只能上传9张
                </view> -->
            </view>
            <view class="cu-form-group">
                <izUploaderImg upload_img_wh="width:195rpx;height:200rpx;" upload_count='100' ref="izUploaderImg"
                    style="width: 100%;" @change="change"></izUploaderImg>
            </view>
            <button style="width: 90%;margin-top: 40rpx;margin-left: 30rpx;"
                class="cu-btn block bg-blue margin-tb-sm lg">
                <text v-if="addimglog" class="cuIcon-loading2 cuIconfont-spin"></text> 提交</button>
        </view>
        <!-- 视频 -->
        <view v-if="TabCur == 1">
            <view class="cu-bar bg-white margin-top">
                <view class="action">
                    视频上传
                </view>
                <view class="action">
                    {{videoList.length}}条
                </view>
                <!-- <view v-if="videoList.length == 9" class="action">
                    因上传数量被官方限制目前只能上传9条
                </view> -->
            </view>
            <view class="cu-form-group">
                <izUploaderVideo upload_img_wh="width:195rpx;height:200rpx;" upload_count='100' ref="izUploaderVideo"
                    style="width: 100%;" @change="change"></izUploaderVideo>
            </view>
            <button style="width: 90%;margin-top: 40rpx;margin-left: 30rpx;"
                class="cu-btn block bg-blue margin-tb-sm lg">
                <text v-if="addvideolog" class="cuIcon-loading2 cuIconfont-spin"></text> 提交</button>
        </view>
        <!-- 文字 -->
        <view v-if="TabCur == 2">
            <view class="cu-form-group">
                <textarea v-model="media_text" maxlength="-1" style="height:17.6em" :disabled="modalName!=null"
                    @input="textareaAInput" placeholder="添加文字"></textarea>
            </view>
            <button @click="addaddText()" :disabled="addtextlog"
                style="width: 90%;margin-top: 40rpx;margin-left: 30rpx;" class="cu-btn block bg-blue margin-tb-sm lg">
                <text v-if="addtextlog" class="cuIcon-loading2 cuIconfont-spin"></text> 提交</button>
        </view>
    </view>
</template>
<script>
    import http from '@/components/utils/http.js';
    import izUploaderImg from '@/components/iz-aloss-uploader-img/iz-aloss-uploader-img.vue'
    import izUploaderVideo from '@/components/iz-aloss-uploader-img/iz-aloss-uploader-video.vue'
    export default {
        components: {
            izUploaderImg,
            izUploaderVideo,
        },
        data() {
            return {
                TabCur: 0,
                imgList: [],
                videoList: [],
                modalName: null,
                addimglog: false,
                addvideolog: false,
                addtextlog: false,
                data: {},
                UploadAddress: '',
                UploadAuth: '',
                VideoId: '',
                imgs: [],
                ivdeo: [],
                media_text: '',
                textid: '',
            };
        },
        onLoad(option) {
            this.data = JSON.parse(option.data)
            this.keyWorddetail()
        },
        methods: {
            tabSelect(e) {
                this.TabCur = e.currentTarget.dataset.id;
                if (this.TabCur == 1) {
                    let opts = {
                        url: '/cms/media/keyWorddetail',
                        method: 'post',
                    };
                    let data = {
                        id: this.data.id,
                        token: uni.getStorageSync('token'),
                    };
                    http.httpRequest(opts, data).then(res => {
                        if (res.data.code == 200) {
                            for (var i = 0; i < res.data.data.vod.length; i++) {
                                this.ivdeo.push({
                                    src: res.data.data.vod[i].media_cover_img,
                                    url: res.data.data.vod[i].keyowrd,
                                    id: res.data.data.img[i].id
                                })
                            }
                            this.$refs.izUploaderVideo.init(this.ivdeo, this.data)
                            this.imgList = res.data.data.img
                            this.videoList = res.data.data.vod
                        } else {
                            this.error(res.data.msg)
                        }
                    }, error => {
                        console.log(error);
                    })
                }
                // this.keyWorddetail();
            },
            //获取素材库详情
            keyWorddetail() {
                let opts = {
                    url: '/cms/media/keyWorddetail',
                    method: 'post',
                };
                let data = {
                    id: this.data.id,
                    token: uni.getStorageSync('token'),
                };
                http.httpRequest(opts, data).then(res => {
                    if (res.data.code == 200) {
                        for (var i = 0; i < res.data.data.img.length; i++) {
                            this.imgs.push({
                                src: res.data.data.img[i].media_url,
                                url: res.data.data.img[i].keyowrd,
                                id: res.data.data.img[i].id
                            })
                        }
                        this.$refs.izUploaderImg.init(this.imgs, this.data)
                        this.media_text = res.data.data.text[0].media_text
                        this.textid = res.data.data.text.length == 0 ? this.textid == '' : res.data.data.text[0]
                            .id
                        this.imgList = res.data.data.img
                        this.videoList = res.data.data.vod
                    } else {
                        this.error(res.data.msg)
                    }
                }, error => {
                    console.log(error);
                })
            },
            change(e) {
                // console.log(e)
            },
            //文本操作
            addaddText() {
                let opts = {
                    url: '/cms/media/addText',
                    method: 'post',
                };
                let data = {
                    id: this.textid,
                    keyword_id: this.data.id,
                    keyword: this.data.keyword,
                    media_text: this.media_text,
                    token: uni.getStorageSync('token'),
                };
                http.httpRequest(opts, data).then(res => {
                    if (res.data.code == 200) {
                        this.error('保存成功')
                    } else {
                        this.error(res.data.msg)
                    }
                }, error => {
                    console.log(error);
                })

            },
            textareaAInput(e) {
                this.textareaAValue = e.detail.value
            },
            error(msg) {
                uni.showToast({
                    title: msg,
                    icon: 'none'
                });
            },
        }
    }
</script>

<style>
</style>
