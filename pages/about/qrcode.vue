<template>
	<view class="qrimg">
		<tki-qrcode ref="qrcode" :size="600" :val="qrcodeStr" onval loadMake @result="qrR" />
		<!-- <image style="width: 600rpx; height: 600rpx; background-color: #eeeeee;" mode="widthFix" :src="src"
		    @error="imageError"></image> -->
		<view class="btn-row">
			<button type="warn" @tap="bindSave">下载</button>
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
				src: ''
			}
		},
		onLoad() {
			// util.ajax({
			// 	method: 'SYS.DealerDAL.GetQRCode',
			// 	params: {},
			// 	tags: {
			// 		usertoken: this.openid
			// 	}
			// }).then(({ data }) => {
			// 	// console.log(data.result)
			// 	this.src = data.result
			// })
			this.getQrcode()
		},
		methods: {
			async getQrcode() {
				await util.ajax({
					method: 'SYS.UserDAL.GetDealerByToken'
				}).then(res => {
					const { result } = res.data
					console.log('GetDealerByToken: ', res, result)
					this.qrcodeStr = `https://www.zzxianchang.cn/qcdm/${result.DealerId}`
				})
				// this.qrcodeStr = '../user/createEntryOrder?AboveDealerId=' + this.userInfo.DealerId
				console.log(this.qrcodeStr)
			},
			qrR(e) {
				this.qrcodeDatabase = e;
			},
			bindSave(e) {
				this.$refs.qrcode._saveCode();
				return;
				const base64 = this.src;
				const bitmap = new plus.nativeObj.Bitmap("test");
				bitmap.loadBase64Data(base64, function() {
					const url = "_downloads/" + "myqrcode.png";  // url为时间戳命名方式
					bitmap.save(url, {
						overwrite: true,  // 是否覆盖
						quality: 100  // 图片清晰度
					}, (i) => {
						uni.saveImageToPhotosAlbum({
							filePath: url,
							success: function() {
								uni.showToast({
									title: '图片保存成功',
									icon: 'none'
								})
								bitmap.clear()
							}
						});
					}, (e) => {
						uni.showToast({
							title: '图片保存失败',
							icon: 'none'
						})
						bitmap.clear()
					});
				}, (e) => {
					uni.showToast({
						title: '图片保存失败',
						icon: 'none'
					})
					bitmap.clear()
				});
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>

<style>
</style>
