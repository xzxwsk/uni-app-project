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
								<view :class="'iconfont receive_icon ' + (item.icon ? ('icon-' + item.icon) : '')"></view>
								<text class="txt">{{ item.name }}</text>
							</view>
							<text v-if="item.subName" class="title sub_txt">{{ item.subName }}</text>
							<!-- <uni-badge text="12" type="error" /> -->
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniBadge from '@/components/uni-badge/uni-badge.vue';
	import {mapState} from 'vuex';
	export default {
		components: {
			uniBadge
		},
		computed: mapState(['hasLogin']),
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
						url: 'order/myReceiveOrder',
						icon: 'activity_fill'
					},
					{
						name: '我收到的付款单',
						url: 'order/myReceivePayOrder',
						icon: 'coupons_fill'
					},
					{
						name: '我收到的退款单',
						url: 'order/myReceiveRefundOrder',
						icon: 'redpacket_fill'
					},
					{
						name: '我收到的注销单',
						url: 'order/myReceiveQuitOrder',
						icon: 'qrcode_fill'
					}
				]
			}
		},
		methods: {
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			goLogin() {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.reLaunch({
								url: '../login/login'
							});
						}
					}
				});
			},
			goDetailPage(url) {
				if (!this.hasLogin) {
					this.goLogin();
					return;
				}
				uni.navigateTo({
					url: '/pages/' + url
				});
			},
		}
	}
</script>
