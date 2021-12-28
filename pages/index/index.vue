<template>
    <view>
        <view class="cu-bar bg-white solid-bottom" :class="isCard?'margin-top':''">
            <view class="action">
                <text class="cuIcon-titles text-blue"></text> <text
                    style="font-size: 40rpx;font-weight: bolder;">{{ userinfo.username }}-素材库</text>
                <view class='cu-tag radius bg-grey' style="margin-left: 60rpx;">共{{ userinfo.keyWordCount }}个关键词</view>
            </view>
        </view>
        <view class="box" :class="navBarFixed == true ? 'navBarWrap' :''">
            <view class="cu-bar search bg-white">
                <view class="search-form round">
                    <text class="cuIcon-search"></text>
                    <input v-model="keyword" @blur="InputBlur" :adjust-position="false" type="text"
                        placeholder="搜索关键词"></input>
                </view>
                <view class="action">
                    <button @click="search" class="cu-btn bg-blue shadow-blur round">搜索</button>
                </view>
            </view>
        </view>


        <view class="cu-card dynamic" :class="isCard?'no-card':''">
            <view class="cu-item shadow" v-for="(item,index) in keylist" :key="index">
                <view class="cu-list menu-avatar">
                    <view class="cu-item">
                        <view style="position: relative;right:23rpx;" @click="manage(item)">
                            <button class="cu-btn bg-blue  sm shadow">管理</button>
                        </view>
                        <view class="content" style="margin-left: -100rpx;">
                            <view>{{ item.keyword }}</view>
                            <view class="text-gray text-sm flex justify-between">
                                {{ item.createtime | formatDate}}
                            </view>
                        </view>
                    </view>
                </view>
                <view class="padding bg-white">
                    <view class="flex">
                        <view class="flex-sub padding-sm margin-xs radius">
                            <image style="width: 60rpx;height: 60rpx;" mode="aspectFit" src="../../static/video.png">
                            </image>
                            <view style="margin-top: 20rpx;">
                                <view class='cu-tag round '>{{ item.media_vod_count }}条</view>
                            </view>
                        </view>
                        <view class="flex-sub padding-sm margin-xs radius">
                            <image style="width: 60rpx;height: 60rpx;" mode="aspectFit" src="../../static/img.png">
                            </image>
                            <view style="margin-top: 20rpx;">
                                <view class='cu-tag round '>{{ item.media_img_count }}张</view>
                            </view>
                        </view>
                        <view class="flex-sub padding-sm margin-xs radius">
                            <image style="width: 60rpx;height: 60rpx;" mode="aspectFit" src="../../static/text.png">
                            </image>
                            <view style="margin-top: 20rpx;">
                                <view class='cu-tag round'>{{ item.media_text_count }}个</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import http from '@/components/utils/http.js';
    export default {
        data() {
            return {
                isCard: false,
                CustomBar: this.CustomBar,
                navBarFixed: false,
                keylist: [],
                userinfo: '',
                InputBottom: 0,
                keyword: '',
                count: 10,
            }
        },
        onLoad(option) {
            if (option.token == undefined) {
                uni.showToast({
                    title: 'token错误',
                    icon: 'none'
                });
                return false
            } else {
                uni.setStorageSync('token',option.token);
                //获取用户信息
                this.getuserinfo()
            }
            //获取用户信息
            // this.getuserinfo()
        },
        methods: {
            IsCard(e) {
                this.isCard = e.detail.value
            },
            InputBlur(e) {
                this.keyword = e.detail.value
                if (e.detail.value == '') {
                    this.keyWordList()
                }
                this.InputBottom = 0
            },
            //搜索
            search() {
                let opts = {
                    url: '/cms/media/keyWordList',
                    method: 'post',
                };
                let data = {
                    type: -1,
                    page_size: this.count,
                    keyword: this.keyword,
                    token: uni.getStorageSync('token'),
                };
                uni.showLoading({
                    title: '加载中....'
                });
                http.httpRequest(opts, data).then(res => {
                    if (res.data.code == 200) {
                        uni.hideLoading();
                        if (res.data.data.list.length == 0) {
                            this.keyword = ""
                            this.error('暂无关键词数据')
                        } else {
                            this.keylist = res.data.data.list
                        }
                    } else {
                        uni.hideLoading();
                        this.error(res.data.msg)
                    }
                }, error => {
                    console.log(error);
                })
            },
            //获取用户信息
            getuserinfo() {
                let opts = {
                    url: '/cms/media/getUserKeyWordInfo',
                    method: 'post',
                };
                let data = {
                    token: uni.getStorageSync('token'),
                };
                http.httpRequest(opts, data).then(res => {
                    if (res.data.code == 200) {
                        this.userinfo = res.data.data
                        this.count = res.data.data.keyWordCount
                        this.keyWordList()
                    } else {
                        this.error(res.data.msg)
                    }
                }, error => {
                    console.log(error);
                })
            },
            //获取关键词素材列表
            keyWordList() {
                let opts = {
                    url: '/cms/media/keyWordList',
                    method: 'post',
                };
                let data = {
                    type: -1,
                    page_size: this.count,
                    token: uni.getStorageSync('token'),
                };
                http.httpRequest(opts, data).then(res => {
                    if (res.data.code == 200) {
                        this.keylist = res.data.data.list
                    } else {
                        this.error(res.data.msg)
                    }
                }, error => {
                    console.log(error);
                })
            },
            // //跳转到管理
            manage(data) {
                uni.navigateTo({
                    url: './manage?data=' + JSON.stringify(data)
                });
            },
            error(msg) {
                uni.showToast({
                    title: msg,
                    icon: 'none'
                });
            },
        },
        //时间戳的处理    
        filters: {
            formatDate: function(value) {
                var date = new Date();
                //date.setTime(value);
                var month = date.getMonth() + 1;
                var hours = date.getHours();
                if (hours < 10)
                    hours = "0" + hours;
                var minutes = date.getMinutes();
                if (minutes < 10)
                    minutes = "0" + minutes;
                var time = date.getFullYear() + "年" + month + "月" + date.getDate() +
                    "日" + " " + hours + ":" + minutes;
                return time;
            }

        },
    }
</script>

<style>
    .navBarWrap {
        position: fixed;
    }
</style>
