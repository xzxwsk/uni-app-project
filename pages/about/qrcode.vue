<template>
	<view class="qrimg">
		<view style="flex: 1;">
			<image style="width: 100%; height: 100%;" mode="scaleToFill" :src="src"
		    @error="imageError"></image>
		</view>
		<view class="btn-row" v-if="showBtn">
			<button type="warn" @tap="bindSave" class="btn">下载二维码</button>
			<button type="primary" open-type="share" class="btn">分享给朋友</button>
			<button type="primary" @tap="bindShareMessage" class="btn">分享到朋友圈</button>
		</view>
		<view class="qr_info box">
			<view class="qr_user_info">
				<view>{{userInfo.DealerName}}</view>
				<view>{{userInfo.Mobile}}</view>
			</view>
			<tki-qrcode ref="qrcode" :size="160" :val="qrcodeStr" onval loadMake @result="qrR" />
		</view>
		
		<view v-if="showPop" @click="showPop = false">
			<view class="mask"></view>
			<view class="share_prompt">
				<image :src="arrowIcon" mode="widthFix" style="width: 200rpx;"></image>
				<view><text>请点击右上角按钮，点击“分享到朋友圈”</text></view>
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
				showPop: false,
				DealerId: '',
				showBtn: true
			}
		},
		onLoad(options) {
			// 分享进入时
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
			this.getQrcode()
		},
		onShareAppMessage (res) {
			if (res.from === 'button') {// 来自页面内分享按钮
			    console.log(res)
			}
			return {
			    title: '纤畅业务系统',
			    path: '/pages/user/createQuickReg?AboveDealerId=' + this.DealerId
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
					console.log('GetDealerByToken: ', res, result)
					this.qrcodeStr = `https://www.zzxianchang.cn/qcdm/${result.DealerId}`
					this.DealerId = result.DealerId
				})
			},
			qrR(e) {
				this.qrcodeDatabase = e;
			},
			bindSave(e) {
				this.draw()
				// this.$refs.qrcode._saveCode();
				// return;
				// const base64 = this.src;
				// const bitmap = new plus.nativeObj.Bitmap("test");
				// bitmap.loadBase64Data(base64, function() {
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
				// 	});
				// }, (e) => {
				// 	uni.showToast({
				// 		title: '图片保存失败',
				// 		icon: 'none'
				// 	})
				// 	bitmap.clear()
				// })
			},
			draw () {
				const systemInfo = wx.getSystemInfoSync()
				console.log('systemInfo: ', systemInfo)
				const { width, height } = systemInfo.safeArea
				const offscreenCanvas = uni.createOffscreenCanvas({
					type: '2d',
					width,
					height
				})
				console.log('offscreenCanvas: ', offscreenCanvas)
				const getContext = offscreenCanvas.getContext('2d')
				getContext.drawImage(this.qrcodeDatabase, 0, 0, width, height);
				
			},
			bindShareMessage() {
				this.showPop = true
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>

<style>
</style>
