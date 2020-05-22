<template>
	<div class='listWrap'>
		<div class='left'>
			<h4><slot name='title'></slot></h4>
			<p><slot name='desc'></slot></p>
			<div class='sep'></div>
			<p class='author'>作者：{{ author }}</p>
		</div>
		<img :src='url'/>
	</div>
</template>

<script>
export default {
	props: ['author', 'url']
}
</script>

<style>
	.listWrap {padding: 20px; text-align: left; height: 150px; border-bottom: 1px solid #eee;}
	.listWrap img {width: 100px; height: 100px; float: right;}
	.listWrap .left {width: 65%; float: left;}
	.listWrap p {margin: 10px 0; color: #999; font-size: 14px;}
	.listWrap .author {color: #ccc; font-size: 12px;}
	.listWrap .sep {width: 20px; height: 1px; background: #eee;}
</style>