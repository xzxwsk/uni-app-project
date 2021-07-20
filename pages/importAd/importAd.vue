<template>
	<view class="content">
		<view class="con" :style="{backgroundImage: img === '' ? 'url(/static/loading.gif)' : 'none'}">
			<image v-if="img"
				style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: 2;"
				:src="img"
				mode="aspectFit"
			></image>
		</view>
		<view class="btn" id="timer" @click="onClickAd">
			<view id="info">跳过</view>
			<view class="circleProgress_wrapper btn">
				<view class="wrapper right">
					<view class="circleProgress rightcircle"></view>
				</view>
				<view class="wrapper left">
					<view class="circleProgress leftcircle"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util'
	export default {
		data() {
			return {
				st: null,
				img: ''
			}
		},
		created() {
			this.st = setTimeout(() => {
				util.goTab({
					url: '../tabBar/index'
				})
			}, 6000)
			this.getAd()
		},
		methods: {
			async getAd() {
				let res = await util.ajax({
					method: 'SYS.OptionsDAL.GetOptions',
					params: {}
				}).catch(() => {})
				console.log('getAd: ', res)
				if (res.data.result.PictureSplashFileName) {
					this.img = util.getBaseUrl() + 'files/downloadfile?filename=' + res.data.result.PictureSplashFileName
				}
			},
			onClickAd() {
				clearTimeout(this.st)
				this.st = null
				util.goTab({
					url: '../tabBar/index'
				})
			}
		}
	}
</script>

<style>
@import url("/common/advertise.css")
</style>
