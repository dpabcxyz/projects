<template>
	<div :class='{headerWrap:true, green:bol}'>
		<span>{{ txt }}</span>
		<slot name='left'></slot>
		<slot name='right'></slot>
		<slot name='search'></slot>
	</div>
</template>

<script>
export default {
	props: ['txt', 'bol']
}

</script>

<style>
	.headerWrap {width: 100%; height: 44px; border-bottom: 1px solid #ccc; background: #f7f7f7; text-align: center; line-height: 44px; position: relative;}
	.green {background: #48bd5a;}
	.headerWrap img {width: 25px; position: absolute;}
	.headerWrap .rightImg {top: 10px; right: 10px;}
	.headerWrap .leftImg {top: 10px; right: 50px;}

	.headerWrap .search input {width: 85%; height: 30px; position: absolute; left: 5px; top: 8px; border-radius: 5px; border: none; text-indent: 2.5em;}
	.headerWrap .search img {position: absolute; width: 20px;}
	.headerWrap .search .searchImg {left: 10px; top: 13px;}
	.headerWrap .search .scanImg {right: 60px; top: 13px;}
</style>