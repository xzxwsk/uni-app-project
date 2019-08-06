<template>
	<view class="uni-padding-wrap uni-common-pb">
		<view class="user">
			<view class="uni-list">
				<view
					class="uni-list-cell"
					hover-class="uni-list-cell-hover"
					v-for="(item, key) in pages"
					:key="key"
					:url="item.url"
					@click="goDetailPage(item.url)"
				>
					<view class="uni-list-cell-navigate uni-navigate-right">
						<view class="menu_txt">
							<view class="title">
								<view :class="'uni-icon ' + (item.icon ? ('uni-icon-' + item.icon) : '')"></view>
								<text class="txt">{{ item.name }}</text>
							</view>
							<text v-if="item.subName" class="title sub_txt">{{ item.subName }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgSrcHead: '/static/images/avatar_member.gif',
				modeHead: 'widthFix',
				imgSrc: '/static/images/member_bg.png',
				mode: 'widthFix',
				pages: [
					{
						name: '我收到的订单',
						// subName: '显示个人资料，可以修改部分资料(卡号、身份证号、姓名不能修改)',
						url: 'order/myOrder',
						icon: 'paperplane'
					},
					{
						name: '我收到的付款单',
						url: 'order/myOrder',
						icon: 'location-filled'
					},
					{
						name: '我收到的退款单',
						url: 'order/myOrder',
						icon: 'map'
					}
				]
			}
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
		}
	}
</script>
