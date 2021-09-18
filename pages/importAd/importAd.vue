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
				const adImg = util.getStorageSync('importad')
				const adImgTime = util.getStorageSync('importadtime')
				if (adImg) {
					this.img = adImg
				}
				let res = await util.ajax({
					method: 'SYS.OptionsDAL.GetOptions',
					params: {}
				}).catch(() => {})
				const { result } = res.data
				// 判断是否更新，如果没有更新，则不用下载
				if (adImgTime === result.PictureSplashLastModifyTime) {
					return
				}
				// 更新时间
				util.setStorageSync({
					key: 'importadtime',
					data: result.PictureSplashLastModifyTime
				})
				if (result.PictureSplashFileName) {
					const imgUrl = util.getBaseUrl() + 'files/downloadfile?filename=' + result.PictureSplashFileName
					// 下载图片，获得临时文件
					uni.downloadFile({
					    url: imgUrl,
					    success: res => {
					        if (res.statusCode === 200) {
					            console.log('下载成功', res.tempFilePath)
								// 保存
								uni.saveFile({
								    tempFilePath: res.tempFilePath,
								    success: saveRes => {
								        const { savedFilePath } = saveRes
										console.log('savedFilePath: ', savedFilePath)
										// this.img = saveRes.savedFilePath
										// 更新显示这个刚下载的
										this.img = savedFilePath
										util.setStorageSync({
											key: 'importad',
											data: savedFilePath
										})
								    }
								})
					        }
					    }
					})
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
