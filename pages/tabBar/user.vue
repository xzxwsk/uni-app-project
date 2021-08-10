<template>
	<view class="user">
		<view class="top">
			<view class="login_box">
				<view class="login_con">
					<view class="head_img"><image style="width: 100%; height: 100%;" :mode="modeHead" :src="wxUserInfo.avatarUrl || imgSrcHead" @error="imageError" @click="updateHeadImg"></image></view>
					<view class="txt" v-if="hasLogin">
						<view class="user_info">
							<view class="user_name">{{userInfo.DealerName || wxUserInfo.nickName}}</view>
							<text>{{userInfo.Remark || ''}}</text>
						</view>
						<view class="uni-icon uni-icon-gear" @click="goMyInfo"></view>
					</view>
					<view class="txt" v-else>
						<navigator url="../login/login" hover-class="navigator-hover">
							<text class="word">登录</text>
						</navigator>
						<!-- <text class="split">/</text>
						<navigator url="../login/reg" hover-class="navigator-hover">
							<text class="word">注册</text>
						</navigator> -->
					</view>
				</view>
			</view>
			<view class="bg"><image style="width: 100%; height: 100%;" :mode="mode" :src="imgSrc" @error="imageError"></image></view>
		</view>
		<view class="btn_box">
			<view class="btn" @click="baseInfo">
				<view>
					<view class="uni-icon uni-icon-contact"></view>
				</view>
				基本信息
			</view>
			<view class="btn" @click="accountBalance">
				<view>
					<view class="uni-icon uni-icon-starhalf"></view>
				</view>
				我的帐户余额
			</view>
			<view class="btn" @click="bonus">
				<view>
					<view class="uni-icon uni-icon-paperplane"></view>
				</view>
				我的奖金查询
			</view>
			<view class="btn" @click="stock">
				<view>
					<view class="uni-icon uni-icon-navigate"></view>
				</view>
				我的库存查询
			</view>
			<view class="btn" @click="cunsume">
				<view>
					<view class="uni-icon uni-icon-list"></view>
				</view>
				消费/零售记录
			</view>
			<view class="btn" @click="subordinateInfo">
				<view>
					<view class="uni-icon uni-icon-upload"></view>
				</view>
				我的下属资料
			</view>
		</view>
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
						<text class="title">{{ item.name }}</text>
						<text v-if="item.subName" class="title sub_txt">{{ item.subName }}</text>
						<uni-badge :text="item.changeNum" type="error" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import uniBadge from '@/components/uni-badge/uni-badge.vue';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			uniBadge
		},
		computed: mapState(['hasLogin', 'userInfo', 'wxUserInfo', 'changeNum', 'openid']),
		data() {
			return {
				onLoadFlag: false,
				imgSrcHead: util.getImgUrl() + "/static/images/avatar_member.gif",
				modeHead: 'widthFix',
				imgSrc: util.getImgUrl() + "/static/images/member_bg.png",
				mode: 'widthFix',
				pages: [
					{
						name: '分销商加盟单',
						// subName: '显示个人资料，可以修改部分资料(卡号、身份证号、姓名不能修改)',
						url: 'user/entryOrder',
						changeNum: 0,
					},
					{
						name: '分销商注销单',
						url: 'user/quitOrder',
						changeNum: 0,
					},
					{
						name: '处罚申请单',
						url: 'user/punishOrder',
						changeNum: 0,
					}
				]
			}
		},
		onLoad (option) {
			console.log('wxUserInfo: ', this.wxUserInfo)
			if (!this.onLoadFlag) {
				if (this.hasLogin && this.changeNum === null) {
					this.getChangeNum();
				} else {
					this.getCurPageChangeNum();
				}
				this.onLoadFlag = true;
			}
		},
		onShow () {
			console.log('show user');
			if (this.onLoadFlag) {
				console.log(this.hasLogin, this.changeNum)
				if (this.hasLogin && this.changeNum === null) {
					this.getChangeNum();
				} else {
					this.getCurPageChangeNum();
				}
			}
		},
		methods: {
			...mapMutations(['setChangeNum']),
			async getChangeNum() {
				let num = 0;
				let myOrderChangeNum = 0;
				let myPayOrderChangeNum = 0;
				let myRefundOrderChangeNum = 0;
				// 我的订单
				util.showLoading();
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
				this.getCurPageChangeNum();
			},
			async getCurPageChangeNum() {
				// 分销商加盟单
				await util.ajax({
					method: 'Businese.BillJoinDAL.GetChangedListCount',
					params: {
						State: null
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					this.pages[0].changeNum = res.data.result;
				});
				// 分销商注销单
				await util.ajax({
					method: 'Businese.BillLeaveDAL.GetChangedListCount',
					params: {
						State: null
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					this.pages[1].changeNum = res.data.result;
				});
				// 处罚申请单
				await util.ajax({
					method: 'Businese.BillPenalizationDAL.GetChangedListCount',
					params: {
						State: null
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					this.pages[2].changeNum = res.data.result;
				});
			},
			goLogin() {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					// showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.reLaunch({
								url: '../login/login'
							});
						}
					}
				});
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			updateHeadImg() {
				// this.chooseImage();
			},
			async chooseImage() {
				uni.chooseImage({
					sourceType: ['album'],
					sizeType: ['compressed'],
					count: 1,
					success: res => {
						this.imgSrcHead = res.tempFilePaths[0];
					}
				});
			},
			goDetailPage(url) {
				if (!this.hasLogin) {
					this.goLogin();
					return;
				}
				util.goUrl({
					url: '/pages/' + url
				});
			},
			goMyInfo() {
				// 个人设置
				util.goUrl({
					url: '/pages/user/myInfo'
				});
			},
			baseInfo() {
				if (!this.hasLogin) {
					this.goLogin();
					return;
				}
				util.goUrl({
					url: '/pages/user/baseInfo'
				});
			},
			accountBalance() {
				if (!this.hasLogin) {
					this.goLogin();
					return;
				}
				util.showLoading();
				util.ajax({
					method: 'Businese.QueryAppDAL.QueryMyAccount',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					let data = res.data.result;
					console.log('帐户余额: ', res.data);
					let str = '';
					data.forEach(item => {
						if (str !== '') {
							str += '\n\n';
						}
						str += '类别： ' + ['货款','保证金','积分'][item.AccountType] + '\n分销商名称：' + item.DealerName + '\n余额：' + item.Amount + '\n预留金额：' + item.ReservedAmount + '\n可用余额：' + item.AmountCanUse;
					});
					// 帐户余额
					util.dialog({
						title: '帐户余额',
						content: str || '余额：￥0',
						showCancel: false
					});
				});
			},
			bonus() {
				if (!this.hasLogin) {
					this.goLogin();
					return;
				}
				// 奖金查询
				util.goUrl({
					url: '/pages/user/bonus'
				})
			},
			stock() {
				if (!this.hasLogin) {
					this.goLogin();
					return;
				}
				// 库存查询
				util.goUrl({
					url: '/pages/user/stock'
				})
			},
			cunsume() {
				if (!this.hasLogin) {
					this.goLogin();
					return;
				}
				// 消费/零售记录
				util.goUrl({
					url: '/pages/user/consumeRecord'
				})
			},
			subordinateInfo() {
				if (!this.hasLogin) {
					this.goLogin();
					return;
				}
				// 下属资料
				util.goUrl({
					url: '/pages/user/mySubordinateInfo'
				})
			}
		}
	}
</script>
