<template>
	<div>
		<Myheader bol='true'>

			<img src='../../assets/images/ic_chat_white.png' class='rightImg' slot='right'/>
			<div slot='search' class='search'>
				<input type='text' placeholder='影视 图书 唱片 小组等'/>
				<img src='../../assets/images/ic_group_search_small.png' class='searchImg'/>
				<img src='../../assets/images/ic_scan_gray.png' class='scanImg'/>
			</div>
		</Myheader>
		<Banner swiperid='go'>
			<div slot='swiper-con' class='swiper-slide'>
				<img src='../../assets/images/banner/01.jpg'/>
			</div>
			<div slot='swiper-con' class='swiper-slide'>
				<img src='../../assets/images/banner/02.jpg'/>
			</div>
			<div slot='swiper-con' class='swiper-slide'>
				<img src='../../assets/images/banner/03.jpg'/>
			</div>
		</Banner>
		<Cell title='热点' hot=true></Cell>
		<List v-for='item in arr' :author='item.target.author.name' :url='item.target.cover_url'>
			<span slot='title'>{{ item.title }}</span>
			<span slot='desc'>{{ item.target.desc }}</span>
		</List>
	</div>
</template>

<script>
import Myheader from '../../components/header'
import Banner from '../../components/banner'
import Cell from '../../components/cell'
import List from '../../components/news_list'

export default {
	data: function(){
		return {
			arr:[]
		}
	},
	components: {
		Myheader,
		Banner,
		Cell,
		List
	},
	created: function(){
		this.fn();
	},
	methods: {
		fn(){
			console.log(1);
			this.axios.get('/api/homeData').then((response)=>{
				console.log(response.data.data.recommend_feeds);
				var data = response.data.data.recommend_feeds;
				this.arr = data;
				console.log(this.arr);
			});
		}
	}
}
</script>
