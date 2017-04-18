<style lang="less">
	@import './style.less';
	* {
		padding: 0px;
		margin: 0px;
	}
	
	.major {
		position: absolute;
		left: 0px;
		right: 0px;
		top: 40px;
		bottom: 55px;
		overflow-x: hidden;
		overflow-y: auto;
		background: @background;
		color: @content;
	}
	
	.major-content {
		position: absolute;
		left: 0px;
		right: 0px;
		top: 40px;
		bottom: 0px;
		overflow-x: hidden;
		overflow-y: auto;
		background: @background;
		color: @content;
	}
	
	.pop-view {
		width: 100%;
		height: 100%;
		background-color: #fff;
		overflow-x: hidden;
		overflow-y: auto;
	}
	
	.mint-toast {
		z-index: 9999;
	}
	
	.content-container {
		position: absolute;
		top: 40px;
		left: 0px;
		right: 0px;
		bottom: 0px;
		overflow-y: auto;
		padding: 5px;
	}
</style>
<template>
	<div id="app">
		<mt-header title="订单查询"></mt-header>
		<div class="content-container">
			<Orders></Orders>
		</div>
	</div>
</template>
<script>
	import {
		Toast,
		MessageBox,
		Indicator
	} from 'mint-ui';

	window.Base = {
		Toast: Toast,
		MessageBox: MessageBox,
		Indicator: Indicator
	}

	import Orders from './components/order/Orders.vue';

	export default {
		components: {
			Orders
		},
		data() {
			return {}
		},
		methods: {},
		ready() {}
	}
</script>
<style>
	body {
		font-family: Helvetica, sans-serif;
	}
</style>