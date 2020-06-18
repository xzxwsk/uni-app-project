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
	import {mapState, mapMutations, mapGetters} from 'vuex';
	export default {
		components: {
			uniBadge
		},
		computed: {
			...mapState(['hasLogin', 'changeNum'])
		},
		data() {
			return {
				imgSrcHead: '/static/images/avatar_member.gif',
				modeHead: 'widthFix',
				imgSrc: '/static/images/member_bg.png',
				mode: 'widthFix',
				isLoad: false,
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
		onLoad() {
			if (!this.isLoad && this.hasLogin && this.changeNum !== null) {
				this.init();
				this.isLoad = true;
			}
		},
		onShow() {
			console.log('order show:', this.isLoad);
			if(this.isLoad) {
				this.reGetChangeNum();
			}
		},
		methods: {
			...mapMutations(['setChangeNum']),
			getMenu() {
				util.showLoading();
				return util.ajax({
					method: 'SYS.DealerDAL.CanPay',
					tags: {
						usertoken: '',
						sessionid: this.sessionId
					}
				});
			},
			showChangeNum(changeNum) {
				if(this.pages.length > 2) {
					this.pages[0].changeNum = changeNum.myOrderChangeNum;
					this.pages[1].changeNum = changeNum.myPayOrderChangeNum;
					this.pages[2].changeNum = changeNum.myRefundOrderChangeNum;
				} else {
					this.pages[0].changeNum = changeNum.myOrderChangeNum;
					this.pages[1].changeNum = changeNum.myRefundOrderChangeNum;
				}
			},
			async init() {
				await this.getMenu()
				.then(res => {
					util.hideLoading();
					if(!res.data.result) {
						this.pages.splice(1, 1);
					}
				});
				this.showChangeNum(this.changeNum);
			},
			async reGetChangeNum() {
				let num = 0;
				let myOrderChangeNum = 0;
				let myPayOrderChangeNum = 0;
				let myRefundOrderChangeNum = 0;
				// 我的订单
				await util.ajax({
					method: 'Businese.OrderDAL.GetChangedListCount',
					params: {
						State: null
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					myOrderChangeNum = res.data.result;
					num += res.data.result;
				});
				// 我的付款单
				await util.ajax({
					method: 'Businese.BillPayDAL.GetChangedListCount',
					params: {
						State: null
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					myPayOrderChangeNum = res.data.result;
					num += res.data.result;
				});
				// 我的退款单
				await util.ajax({
					method: 'Businese.BillPayReturnDAL.GetChangedListCount',
					params: {
						State: null
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					myRefundOrderChangeNum = res.data.result;
					num += res.data.result;
				});
				console.log({
					myOrderChangeNum: 1,
					myPayOrderChangeNum,
					myRefundOrderChangeNum
				});
				this.setChangeNum({
					myOrderChangeNum,
					myPayOrderChangeNum,
					myRefundOrderChangeNum
				});
				if (num > 0) {
					uni.setTabBarBadge({
						index: 2,
						text: String(num)
					});
				}
				this.showChangeNum({
					myOrderChangeNum,
					myPayOrderChangeNum,
					myRefundOrderChangeNum
				});
			},
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
			}
		}
	}
</script>
