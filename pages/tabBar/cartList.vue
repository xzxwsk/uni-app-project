<template>
	<view class="uni-padding-wrap uni-common-pb cart_ls">
		<view class="no-data">
			<view class="no-img cart">
				<image style="width: 100%;" :mode="mode" :src="imgSrc" @error="imageError"></image>
			</view>
			<view class="txt"><text>亲，您的购物车还没有宝贝哦~</text></view>
		</view>
		<view class="ls">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgSrc: '/static/images/no_data_d.png',
				mode: 'widthFix'
			}
		},
		methods: {
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
