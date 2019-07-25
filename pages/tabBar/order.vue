<template>
	<view class="uni-padding-wrap uni-common-pb">
		<view class="user">			
			<view>
				<view>不带校验</view>
				<input-box></input-box>
				<input-box leftText="用户名:"></input-box>
				<input-box rightText="发送验证码"></input-box>
				<view>带校验</view>
				<input-box ref="input1" :verification="['isNull','isPhoneNum']" :verificationTip="['手机号码不能为空','请输入正确的手机号']" placeholder="请输入手机号码" maBtm="10" maxLength="11"></input-box>
				<input-box ref="input2" type="password" :verification="['isNull','isChineseEnlishAndNumber']" :verificationTip="['密码不能为空','']"  placeholder="请输入密码" maBtm="10"></input-box>
				<button @click="onerification">校验</button>
			</view>			
			</view>
		</view>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	export default {
		components: {inputBox},
		data() {
			return {}
		},
		methods: {
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			goDetailPage(url) {
				uni.navigateTo({
					url: '/pages/' + url
				});
			},
			onerification(){
				if(this.$refs.input1.getValue() && this.$refs.input2.getValue()){
					uni.showToast({
						icon: 'none',
						title: '校验通过',
						// #ifdef MP-WEIXIN
						duration: 2000,
						// #endif
						// mask: true
					});
				}
			}
		}
	}
</script>
