<template>
	<div class='tabbar'>
		<Item txt='首页' mark='home' :sel='selected' @change='getVal'>
			<img src='../assets/images/ic_tab_home_active.png' slot='activeImg'/>
			<img src='../assets/images/ic_tab_home_normal.png' slot='normalImg'/>
		</Item>
		<Item txt='书影音' mark='audio' :sel='selected' @change='getVal'>
			<img src='../assets/images/ic_tab_subject_active.png' slot='activeImg'/>
			<img src='../assets/images/ic_tab_subject_normal.png' slot='normalImg'/>
		</Item>
		<Item txt='广播' mark='broadcast' :sel='selected' @change='getVal'>
			<img src='../assets/images/ic_tab_status_active.png' slot='activeImg'/>
			<img src='../assets/images/ic_tab_status_normal.png' slot='normalImg'/>

			
		</Item>
		<Item txt='小组' mark='group' :sel='selected' @change='getVal'>
			<img src='../assets/images/ic_tab_group_active.png' slot='activeImg'/>
			<img src='../assets/images/ic_tab_group_normal.png' slot='normalImg'/>

		</Item>
		<Item txt='我的' mark='mine' :sel='selected' @change='getVal'>
			<img src='../assets/images/ic_tab_profile_active.png' slot='activeImg'/>
			<img src='../assets/images/ic_tab_profile_normal.png' slot='normalImg'/>

		</Item>
	</div>
</template>

<script>
import Item from './item'

export default {
	components: {
		Item
	},
	data: function(){
		return {
			selected: 'home'
		}
	},
	methods: {
		getVal: function(val){
			this.selected = val;
		}
	}
}

</script>

<style>
	.tabbar {width: 100%; height: 64px; border-top: 1px solid #ccc; position: fixed; left: 0; bottom: 0; background: #fff;}
</style>