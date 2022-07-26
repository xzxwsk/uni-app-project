<template>
	<view class="qrimg">
		<view style="flex: 1;">
			<image style="width: 680rpx; height: 100%;: #eeeeee;" mode="aspectFill" :src="src"
		    @error="imageError"></image>
		</view>
		<view class="qr_info">
			<view class="qr_user_info">
				<view>
					<view>{{userInfo.DealerName}}</view>
					<view>{{userInfo.Mobile}}</view>
				</view>
				<view>广告词</view>
			</view>
			<tki-qrcode ref="qrcode" :size="200" :val="qrcodeStr" onval loadMake @result="qrR" />
		</view>
	
		<view class="btn-row">
			<button type="warn" @tap="bindSave" class="btn">下载二维码</button>
			<button type="primary" open-type="share" class="btn">分享给朋友</button>
			<button type="primary" @tap="bindShareMessage" class="btn">分享到朋友圈</button>
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
				DealerId: ''
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
				query: 'AboveDealerId=' + this.DealerId
			}
		},
		methods: {
			async getQrcode() {
				await util.ajax({
					method: 'SYS.UserDAL.GetDealerByToken'
				}).then(res => {
					const { result } = res.data
					console.log('GetDealerByToken: ', res, result)
					this.qrcodeStr = `https://www.zzxianchang.cn/qcdm/${result.DealerId}`
					this.DealerId = result.DealerId
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
			bindShareFriend() {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 0,
					href: "http://uniapp.dcloud.io/",
					title: "uni-app分享",
					summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
					imageUrl: "https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/d8590190-4f28-11eb-b680-7980c8a877b8.png",
					success: function (res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function (err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			},
			bindShareMessage() {
				// uni.showShareMenu({
				// 	title: "uni-app分享",
				// 	content: '内容',
				// 	path: '/pages/about/qrcode',
				// 	success () {
				// 		console.log('success');
				// 	},
				// 	fail (err) {
				// 		console.log('err: ', err);
				// 	}
				// })
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
