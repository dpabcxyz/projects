<template>
	<div class='cell_wrap' :class='{hot: hot}'>
		<div>
			<span><slot name='icon'></slot></span>{{ title }}
		</div>
		<div>
			<slot name='cell-right'></slot>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		},
		hot: {
			type: Boolean,
			default: false
		}
	}
}
</script>

<style>
	.cell_wrap {height: 40px; position: relative; border-bottom: 1px solid lightgray; line-height: 40px; padding-left: 15px; text-align: left;}
	.cell_img {width: 25px; position: relative; top: 6px; right: 8px;}
	.cell_right_img {width: 28px; position: absolute; top: 6px; right: 8px;}
	.hot {border-bottom: none;}
	.hot:after {content: ''; width: 5px; height: 20px; background: orange; position: absolute; left:0; top: 8px; bottom:0;}
</style>