<template>
	<view class="qrimg">
		<view style="flex: 1;">
			<!-- 显示弹窗时显示 分享进入时(showBtn 为 false)始终显示 -->
			<image style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;"
				v-if="!showBtn || (showBtn && showPop)"
				mode="scaleToFill" :src="src"
				@error="imageError"
			></image>
			<!-- 显示弹窗时隐藏； 分享进入时(showBtn 为 false)始终隐藏 -->
			<canvas canvas-id="canvas_id" v-if="showBtn"
				:style="{canvasStyle, visibility: !showPop ? 'visible' : 'hidden'}"
				@error="onCanvasError"
			></canvas>
		</view>
		<!-- 正常进入且不显示弹窗时且显示 分享进入时(showBtn 为 false)始终隐藏-->
		<cover-view class="btn-row" v-if="showBtn && !showPop">
			<button type="warn" @tap="bindSave" class="btn">下载二维码</button>
			<button type="primary" open-type="share" class="btn">分享给朋友</button>
			<button type="primary" @tap="bindShareMessage" class="btn">分享到朋友圈</button>
		</cover-view>
		<!-- 弹窗 -->
		<cover-view class="pop_view" v-if="showPop" @click="hidePop">
			<cover-view class="mask"></cover-view>
			<cover-view  class="share_prompt">
				<cover-image :src="arrowIcon" mode="widthFix" style="display: inline-block; width: 200rpx;"></cover-image>
				<cover-view class="txt">请点击右上角按钮，点击“分享到朋友圈”</cover-view>
			</cover-view >
		</cover-view>
		
		<!-- 正常进入时且弹窗显示时显示，分享进入时(showBtn 为 false)始终显示 -->
		<view class="qr_info" :style="{visibility: !showBtn || (showBtn && showPop) ? 'visible' : 'hidden'}">
			<view class="qr_user_info">
				<text>{{userInfo.DealerName}}</text>
				<text>{{userInfo.Mobile}}</text>
			</view>
			<view>
				<tki-qrcode ref="qrcode" :size="200" :val="qrcodeStr" onval loadMake @result="qrR" />
			</view>
		</view>
	</view>
</template>

<script>
	// import tkiQrcode from "@/components/tki-qrcode/tki-qrcode";
	import util from "@/common/util.js";
	import {mapState, mapMutations} from 'vuex';

	export default {
		// components: {
		// 	tkiQrcode
		// },
		computed: mapState(['userInfo']),
		data() {
			return {
				qrcodeStr: '',
				src: '',
				// arrowIcon: util.getImgUrl() + '/images/right_top_arrow.png',
				arrowIcon: '/static/images/right_top_arrow.png',
				showPop: false,
				DealerId: '',
				showBtn: true, // 正常进入时显示，通过分享进入时不显示
				canvasStyle: '',
				ctx: null
			}
		},
		onLoad(options) {
			// 分享时进入
			if (options && options.AboveDealerId) {
				console.log('options: ', JSON.stringify(options))
				this.src = options.qrcodeadurl
				this.qrcodeStr = `https://www.zzxianchang.cn/qcdm/${options.AboveDealerId}`
				this.showBtn = false
				this.setUserInfo({
					DealerName: options.DealerName,
					Mobile: options.Mobile
				})
				util.goUrl({
					url: '../user/createQuickReg?AboveDealerId=' + options.AboveDealerId
				})
				return
			}
			
			// 正常进入
			this.src = util.getStorageSync('qrcodead')
			this.draw()
			this.getQrcode()
			// 如果首页未下载就点起走了，要先下载图片
			if (!this.src) {
				this.downloadAd()
			}
		},
		onShareAppMessage (res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			    console.log(res)
			}
			const imageUrl = this.src
			return {
			    title: '纤畅业务系统',
			    path: '/pages/user/createQuickReg?AboveDealerId=' + this.DealerId,
				imageUrl
			}
		},
		onShareTimeline () {
			const qrcodeadurl = util.getStorageSync('qrcodeadurl')
			return {
				title: '纤畅业务系统',
				query: `AboveDealerId=${this.DealerId}&DealerName=${this.userInfo.DealerName}&Mobile=${this.userInfo.Mobile}&qrcodeadurl=${qrcodeadurl}`
			}
		},
		methods: {
			...mapMutations(['setUserInfo']),
			async getQrcode() {
				await util.ajax({
					method: 'SYS.UserDAL.GetDealerByToken'
				}).then(res => {
					const { result } = res.data
					this.qrcodeStr = `https://www.zzxianchang.cn/qcdm/${result.DealerId}`
					this.DealerId = result.DealerId
				})
			},
			qrR(e) {
				// 如果正常进入时绘制
				if (this.showBtn) {
					const systemInfo = uni.getSystemInfoSync()
					const { windowWidth: width, windowHeight: height } = systemInfo
					const imgX = width - 130
					const imgY = height - 130
					this.drawImg(this.ctx, {width, height})
					this.ctx.save()
					this.ctx.drawImage(e, imgX, imgY, 110, 110)
					this.ctx.draw()
				}
			},
			downloadAd() {
				// 获取广告图
				this.imgLs = []
				const adImg = util.getStorageSync('indextopad')
				const adImgTime = util.getStorageSync('indextopadtime')
				if (adImg) {
					this.imgLs.push(adImg)
				}
				util.ajax({
					method: 'SYS.OptionsDAL.GetOptions',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					const { result } = res.data
					// 更新时间
					util.setStorageSync({
						key: 'indextopadtime',
						data: result.PictureTopLastModifyTime
					})
					util.setStorageSync({
						key: 'qrcodeadtime',
						data: result.PictureCardLastModifyTime
					})
					const imgUrl = util.getBaseUrl() + 'files/downloadfile?filename=' + result.PictureTopFileName
					if (!adImg || result.PictureTopLastModifyTime !== adImgTime) {
						this.imgLs = [imgUrl]
					}
					// 删除多余缓存图片
					this.deleMoreFile()
					// 下载图片，获得临时文件
					this.donwloadSaveFile('indextopad', imgUrl)
					const qrcodeImgUrl = util.getBaseUrl() + 'files/downloadfile?filename=' + result.PictureCardFileName
					util.setStorageSync({
						key: 'qrcodeadurl',
						data: qrcodeImgUrl
					})
					// 下载图片，获得临时文件
					this.donwloadSaveFile('qrcodead', qrcodeImgUrl)
				})
			},
			bindSave (e) {
				// this.$refs.qrcode._saveCode();
				// return;
				uni.canvasToTempFilePath({
				    canvasId: 'canvas_id',
				    success: res => {
						console.log(res.tempFilePath)
						this.saveCanvas(res.tempFilePath)
				    }
				})
			},
			hidePop () {
				console.log('hidePop')
				this.showPop = false
			},
			draw () {
				const systemInfo = uni.getSystemInfoSync()
				const { windowWidth: width, windowHeight: height } = systemInfo
				// 正常进入，且未显示弹窗时显示
				this.canvasStyle = `display: block; width: ${width}px; height: ${height}px;`
				this.$nextTick(() => {
					const ctx = uni.createCanvasContext('canvas_id', this)
					this.ctx = ctx
					this.drawImg(ctx, {width, height})
					
					ctx.draw()
				})
			},
			drawImg (ctx, {width, height}) {
				const imgUrl = util.getStorageSync('qrcodead')
				const txtX = 30
				
				ctx.drawImage(imgUrl, 0, 0, width, height)
				
				ctx.setFontSize(20)
				ctx.fillText(this.userInfo.DealerName, txtX, height - 120)
				ctx.fillText(this.userInfo.Mobile, txtX, height - 90)
			},
			saveCanvas (tempFilePath) {
				// 小程序
				uni.saveImageToPhotosAlbum({
					filePath: tempFilePath,
					success () {
						uni.showToast({
							title: '图片保存成功',
							icon: 'none'
						})
					},
					fail () {
						console.log();
					}
				})
				// app
				// const bitmap = new plus.nativeObj.Bitmap("test");
				// bitmap.loadBase64Data(tempFilePath, function() {
				// 	const url = "_downloads/" + "myqrcode.png";  // url为时间戳命名方式
				// 	bitmap.save(url, {
				// 		overwrite: true,  // 是否覆盖
				// 		quality: 100  // 图片清晰度
				// 	}, (i) => {
				// 		uni.saveImageToPhotosAlbum({
				// 			filePath: url,
				// 			success: function() {
				// 				uni.showToast({
				// 					title: '图片保存成功',
				// 					icon: 'none'
				// 				})
				// 				bitmap.clear()
				// 			}
				// 		});
				// 	}, (e) => {
				// 		uni.showToast({
				// 			title: '图片保存失败',
				// 			icon: 'none'
				// 		})
				// 		bitmap.clear()
				// 	})
				// }, (e) => {
				// 	uni.showToast({
				// 		title: '图片保存失败',
				// 		icon: 'none'
				// 	})
				// 	bitmap.clear()
				// })
			},
			// 删除多余缓存图片
			deleMoreFile() {
				const fSysManager = uni.getFileSystemManager()
				fSysManager.getSavedFileList({
					success ({ fileList }) {
						console.log('fileList: ', fileList)
						fileList.sort((a, b) => b.createTime - a.createTime)
						fileList.slice(3).forEach(fileObj => {
							(function(filePath) {
								fSysManager.removeSavedFile({
									filePath
								})
							})(fileObj.filePath)
						})
					}
				})
			},
			bindShareMessage() {
				this.showPop = true
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			onCanvasError(e) {
				console.log('canvas error: ', e)
			}
		}
	}
</script>

<style>
</style>
