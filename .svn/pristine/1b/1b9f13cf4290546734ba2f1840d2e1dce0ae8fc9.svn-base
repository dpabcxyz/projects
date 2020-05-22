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
	import '../assets/libs/swiper/js/swiper.js'
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
				default: 'center'
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
				default: 'slide'
			}
		},
		mounted: function(){
			var That = this;
			new Swiper('.'+That.swiperid, {
				direction: That.direction,
				loop: That.loop,
				pagination: '.swiper-pagination',
				paginationType: That.paginationType,
				autoplay: That.autoplay,
				effect:That.effect
			})
		}
	}
</script>

<style>
@import '../assets/libs/swiper/css/swiper.css';

.banner {width: 100%; height: 128px; overflow: hidden;}
.banner .swiper-container .swiper-slide img {width: 100%;}
.swiper-pagination-bullet-active {background: white;}

</style>