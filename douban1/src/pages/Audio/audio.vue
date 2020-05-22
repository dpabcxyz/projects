<template>
	<div>
		<Myheader txt='书影音'>
			<img src='../../assets/images/ic_actionbar_search_icon.png' class='leftImg' slot='left'/>
			<img src='../../assets/images/ic_chat_green.png' class='rightImg' slot='right'/>
		</Myheader>
		<div class='nav'>
			<span :class='{active: nowIndex==0}' @click='nowIndex=0'>
				<router-link to='/audio/film'>电影</router-link>
			</span>
			<span @click='nowIndex=1' :class='{active: nowIndex==1}'>
				<router-link to='/audio/read'>读书</router-link>
			</span>
			<span @click='nowIndex=2' :class='{active: nowIndex==2}'>
				<router-link to='/audio/tv'>电视</router-link>
			</span>
			<span @click='nowIndex=3' :class='{active: nowIndex==3}'>
				<router-link to='/audio/city'>同城</router-link>
			</span>
			<span @click='nowIndex=4' :class='{active: nowIndex==4}'>
				<router-link to='/audio/music'>音乐</router-link>
			</span>
		</div>
		<div>
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	import Myheader from '../../components/header'

	export default {
		components: {
			Myheader
		},
		data: function(){
			return {
				nowIndex: 3
			}
		},
		methods: {
			fn(){
				console.log(1);
			}
		}
	}


</script>
<style>
	.nav {height: 30px; border-bottom: 1px solid #eee; line-height: 30px;}
	a {display: block; width: 20%; float: left; color: #999; font-size: 12px; text-decoration: none;}
	.nav .active a {border-bottom: 2px solid green;}
</style>