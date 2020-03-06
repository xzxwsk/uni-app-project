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
								<view :class="'iconfont ' + (item.icon ? ('icon-' + item.icon) : '')"></view>
								<text class="txt">{{ item.name }}</text>
							</view>
							<text v-if="item.subName" class="title sub_txt">{{ item.subName }}</text>
							<uni-badge :text="item.changeNum" type="error" />
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniBadge from '@/components/uni-badge/uni-badge.vue';
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			uniBadge
		},
		computed: mapState(['hasLogin', 'changeNum']),
		data() {
			return {
				imgSrcHead: '/static/images/avatar_member.gif',
				modeHead: 'widthFix',
				imgSrc: '/static/images/member_bg.png',
				mode: 'widthFix',
				pages: [
					{
						name: '订单',
						// subName: '显示个人资料，可以修改部分资料(卡号、身份证号、姓名不能修改)',
						url: 'order/myOrder',
						icon: 'activity',
						changeNum: 0
					},
					{
						name: '付款单',
						url: 'order/payOrder',
						icon: 'coupons',
						changeNum: 0
					},
					{
						name: '退款单',
						url: 'order/refundOrder',
						icon: 'redpacket',
						changeNum: 0
					}
				]
			}
		},
		mounted() {
			console.log('order mounted');
			this.getMenu();
			console.log(this.hasLogin, this.changeNum);
			if (this.hasLogin && this.changeNum !== null) {
				this.init();
			}
		},
		methods: {
			getMenu() {
				util.showLoading();
				util.ajax({
					method: 'SYS.DealerDAL.CanPay',
					tags: {
						usertoken: '',
						sessionid: this.sessionId
					}
				}).then(res => {
					util.hideLoading();
					if(!res.data.result) {
						this.pages.splice(1, 1);
					}
				});
			},
			init() {
				this.pages[0].changeNum = this.changeNum.myOrderChangeNum;
				this.pages[1].changeNum = this.changeNum.myPayOrderChangeNum;
				this.pages[2].changeNum = this.changeNum.myRefundOrderChangeNum;
			},
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
