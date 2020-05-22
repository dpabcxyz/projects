<template>
	<div class='itemWrap' @click='fn'>
		<span v-show='bol'><slot name='activeImg'></slot><br/></span>
		<span v-show='!bol'><slot name='normalImg'></slot><br/></span>
		<span :class='{active: bol}'>{{ txt }}</span>
	</div>
</template>

<script>
export default {
	props: ['txt', 'mark', 'sel'],
	computed: {
		bol: function(){
			if (this.mark == this.sel){
				return true;
			}
			return false;
		}
	},
	methods: {
		fn: function(){
			this.$emit('change',this.mark);
			this.$router.push('/' + this.mark);
		}
	}
}
</script>

<style>
.itemWrap {width: 20%; float: left; text-align: center; font-size:0;}
.itemWrap img {width: 40px;}
.itemWrap span {font-size: 12px; color: #666;}
.itemWrap .active {color: #42bd56;}
</style>