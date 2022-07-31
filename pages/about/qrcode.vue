<template>
	<view class="qrimg">
		<view style="flex: 1;" v-if="showBtn">
			<!-- <image style="width: 100%; height: 100%;" mode="scaleToFill" :src="src"
		    @error="imageError"></image> -->
			<canvas canvas-id="canvas_id" :style="{canvasStyle}" @error="onCanvasError">
				<cover-view class="pop_view" v-if="showPop" @click="showPop = false">
					<view class="mask"></view>
					<cover-view  class="share_prompt">
						<cover-image :src="arrowIcon" mode="widthFix" style="display: inline-block; width: 200rpx;"></cover-image>
						<cover-view>
							<text class="txt">请点击右上角按钮，点击“分享到朋友圈”</text>
						</cover-view>
					</cover-view >
				</cover-view>
			</canvas>
		</view>
		<cover-view class="btn-row" v-if="showBtn && !showPop">
			<button type="warn" @tap="bindSave" class="btn">下载二维码</button>
			<button type="primary" open-type="share" class="btn">分享给朋友</button>
			<button type="primary" @tap="bindShareMessage" class="btn">分享到朋友圈</button>
		</cover-view>
		
		<view class="qr_info box" :style="{visibility: !showBtn ? 'visible' : 'hidden';}">
			<view class="qr_user_info">
				<view>{{userInfo.DealerName}}</view>
				<view>{{userInfo.Mobile}}</view>
			</view>
			<view>
				<tki-qrcode ref="qrcode" :size="160" :val="qrcodeStr" onval loadMake @result="qrR" />
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
				qrcodeDatabase: '',
				src: '',
				// arrowIcon: util.getImgUrl() + '/images/right_top_arrow.png',
				arrowIcon: '/static/images/right_top_arrow.png',
				showPop: true,
				DealerId: '',
				showBtn: true,
				canvasStyle: '',
				ctx: null
			}
		},
		onLoad(options) {
			// 分享时进入
			if (options && options.AboveDealerId) {
				console.log('AboveDealerId: ', options.AboveDealerId)
				this.src = options.qrcodead
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
			this.draw();
			this.getQrcode()
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
			return {
				title: '纤畅业务系统',
				query: `AboveDealerId=${this.DealerId}&qrcodead=${this.src}&DealerName=${this.userInfo.DealerName}&Mobile=${this.userInfo.Mobile}`
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
				this.qrcodeDatabase = e;
				const systemInfo = uni.getSystemInfoSync()
				const { windowWidth: width, windowHeight: height } = systemInfo
				const imgX = width - 130
				const imgY = height - 130
				this.drawImg(this.ctx, {width, height})
				this.ctx.save()
				this.ctx.drawImage(e, imgX, imgY, 110, 110)
				this.ctx.draw()
			},
			bindSave(e) {
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
			draw () {
				const systemInfo = uni.getSystemInfoSync()
				const { windowWidth: width, windowHeight: height } = systemInfo
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
				});
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
