<template>
	<view class="uni-padding-wrap uni-common-pb">
		<button @tap="goMian">登录</button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			plus.nativeUI.showWaiting('加载中……');
			// this.getSystemInfo();
			// #endif
		},
		onReady() {
			// #ifdef APP-PLUS
			plus.nativeUI.closeWaiting();
			// #endif
		},
		onShareAppMessage() {
			return {
				title: '欢迎体验uni-app',
				path: '/pages/tabBar/template/template'
			}
		},
		methods: {
			goMian() {
				uni.switchTab({
					url: '/pages/tabBar/template/template'
				});
			},
			getSystemInfo() {
				uni.getSystemInfo({
					success (res) {
						uni.showModal({
							title: '系统信息',
							content: 'model: ' + res.model + '\n'
									+ 'pixelRatio: ' + res.pixelRatio + '\n'
									+ 'windowWidth: ' + res.windowWidth + '\n'
									+ 'windowHeight: ' + res.windowHeight + '\n'
									+ 'language: ' + res.language + '\n'
									+ 'version: ' + res.version + '\n'
									+ 'platform: ' + res.platform + '\n'
									+ 'SDKVersion: ' + res.SDKVersion + '\n'
									+ 'system: ' + res.system + '\n'
									+ 'statusBarHeight: ' + res.statusBarHeight,
							success (resOperate) {
								if (resOperate.confirm) {
									console.log('用户点击确定');
								} else if (resOperate.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					}
				});
			}
		}
	}
</script>
