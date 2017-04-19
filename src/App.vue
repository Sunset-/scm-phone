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
		padding: 5px 5px 10px 5px;
	}
</style>
<template>
	<router-view></router-view>
</template>
<script>
	export default {
		ready() {
			// SignStore.currentUser().then(data => {
			// 	if (this.$route.path == '/' || !this.$route.path) {
			// 		Router.go(modules.navs[0].path);
			// 	}
			// }, err => {
			// 	if (!this.$route.skipAuth) {
			// 		Router.go('/sign');
			// 	}
			// });
		}
	}
</script>