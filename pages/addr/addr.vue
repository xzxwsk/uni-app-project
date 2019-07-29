<template>
	<view class="uni-padding-wrap uni-common-pb addr_ls">
		<view class="con">
			<view class="no-data">
				<view class="no-img cart">
					<image style="width: 100%;" :mode="mode" :src="imgSrc" @error="imageError"></image>
				</view>
				<view class="txt"><text>亲，您还没有添加地址~</text></view>
			</view>
			<view class="ls">
				
			</view>
		</view>
		<view class="add_btn">
			<button type="warn" @tap="addAddr">添加地址</button>
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
			},
			addAddr() {
				uni.navigateTo({
					url: './addAddr'
				});
			}
		}
	}
</script>
