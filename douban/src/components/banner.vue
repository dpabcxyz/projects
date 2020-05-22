<template>
  <div class='banner'>
    <div class='swiper-container' :class='swiperid'>
      <div class='swiper-wrapper'>
        <slot name='swiper-con'></slot>
      </div>
      <div :class='{"swiper-pagination":paginationshow}' :style='{"text-align":paginationdesition}'></div>
    </div>
  </div>
</template>

<script>
  import  '../assets/lib/swiper/js/swiper'
  export default {
    props: {
      swiperid: {
        type: String,
        default: ''
      },
      paginationshow: {
        type: Boolean,
        default: true
      },
      paginationdesition: {
        type: String,
        default: 'right'
      },
      paginationType: {
        type: String,
        default: 'bullets'
      },
      autoplay: {
        type: Number,
        default: 2000
      },
      loop: {
        type: Boolean,
        default: true
      },
      direction: {
        type: String,
        default: 'horizontal'
      },
      effect: {
        type: String,
        default: 'fade'
      }
    },
    mounted: function(){
      var That = this;
      new Swiper('.'+That.swiperid, {
        direction: That.direction,                  //方向
        loop: That.loop,                           //循环播放
        pagination: '.swiper-pagination',          //分页器
        paginationType: That.paginationType,       //分页器类型
        autoplay: That.autoplay,                   //自动播放
        effect:That.effect
      })
    }
  }
</script>

<style>
  @import "../assets/lib/swiper/css/swiper.css";
  .banner{
    width: 100%;
    height: 128px;
    overflow: hidden;
  }
  .banner .swiper-container .swiper-slide img{
    width: 100%;
  }
  .banner .swiper-container .swiper-pagination-bullet-active{
    background-color: #00b51d;
  }
</style>
