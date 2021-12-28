<!--
 * @Description: 悬浮菜单组件
 * @Version: 1.0.0
 * @Autor: hch
 * @Date: 2020-08-15 22:03:28
 * @LastEditors: hch
 * @LastEditTime: 2020-08-15 22:12:17
-->
<template>
    <view class="menu-content">
      <img class="menu icon" @click="openFlag = !openFlag" :class="{'menuOpen':openFlag}" src="/static/hch-menu/menu.png"
        alt="" srcset="">
      <img class="bg-menu icon indext" :class="{'open open1':openFlag}" src="/static/hch-menu/bg.png" alt="" srcset="">
      <img class="pic-menu icon indext" :class="{'open open2':openFlag}" src="/static/hch-menu/pic.png" alt="" srcset="">
      <img class="text-menu icon indext" :class="{'open open3':openFlag}" src="/static/hch-menu/text.png" alt="" srcset="">
      <img class="save-menu icon indext" :class="{'open open4':openFlag}" src="/static/hch-menu/save.png" alt="" srcset="">
    </view>
</template>

<script>
  export default {
    data() {
      return {
        openFlag: false, //是否展开菜单
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .menu-content {
    .icon {
      position: fixed;
      bottom: 120rpx;
      right: 80rpx;
      width: 80rpx;
      height: 80rpx;
      opacity: 0;
      transform: rotate(0deg);
      transition: all 0.5s ease-out 0s;
    }

    .text-menu {
      width: 86rpx;
      height: 86rpx;
    }

    .menu {
      z-index: 300;
      opacity: 1;
    }

    .menuOpen {
      transform: rotate(180deg);
      animation-fill-mode: forwards;
      transition: all 0.5s ease-out 0s;
    }

    .open {
      opacity: 1;
      transform: rotate(360deg);
      animation-fill-mode: forwards;
      transition: all 0.5s ease-out 0s;
    }

    .open1 {
      right: 80rpx;
      bottom: 250rpx;
    }

    .open2 {
      right: 190rpx;
      bottom: 210rpx;
    }

    .open3 {
      right: 210rpx;
      bottom: 100rpx;
    }

    .open4 {
      right: 160rpx;
      bottom: 20rpx;
    }

    .bg-menu {}

    .indext {
      z-index: 100;
    }
  }

  .mloginbg {
    background-color: black;
    width: 100%;
    height: 100%;
  }
</style>
