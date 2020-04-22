<template>
	<view class="about">
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate" @click="onCallPhone">
					<view class="menu_txt">
						<view class="title">客服电话： <text class="a">4008622068</text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from "@/common/util.js";

	export default {
		components: {
		},
		data() {
			return {
			}
		},
		onLoad() {
		},
		methods: {
			onCallPhone() {
				// #ifdef APP-PLUS
					let phoneNo = '4008622068';
					if(this.sysInfo.platform === 'ios') {
						console.log('ios');
						uni.makePhoneCall({
							phoneNumber: phoneNo
						});
					} else {
						console.log('android');
						showToast({
							title: '正在拨打',
							success: function() {
								this.call(phoneNo);
							}.bind(this)
						});
					}
				// #endif
			}
		}
	}
</script>

<style>
</style>
