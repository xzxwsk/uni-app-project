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
			<view class="logout_btn">
				<button type="warn" class="btn" @tap="bindLogout">退出当前帐户</button>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		data() {
			return {
				imgSrcHead: '/static/images/avatar_member.gif',
				modeHead: 'widthFix',
				imgSrc: '/static/images/member_bg.png',
				mode: 'widthFix',
				pages: [					
					{
						name: '收货地址',
						// subName: '显示个人资料，可以修改部分资料(卡号、身份证号、姓名不能修改)',
						url: 'addr/addr',
						icon: 'location-filled'
					},
					{
						name: '密码修改',
						url: 'login/pwd',
						icon: 'refreshempty'
					},
					{
						name: '关于纤畅',
						url: 'about/about',
						icon: 'info'
					},
					{
						name: '联系客服',
						url: 'about/contactus',
						icon: 'gear'
					},
					{
						name: '我的二维码',
						url: 'about/qrcode',
						icon: 'pengyouquan'
					}
				]
			}
		},
		methods: {
			...mapMutations(['logout']),
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			goDetailPage(url) {
				uni.navigateTo({
					url: '/pages/' + url
				});
			},
			bindLogout() {
				util.showLoading();
				util.ajax({
					method: 'SYS.UserDAL.Logoff',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					this.logout();
					console.log(localStorage);
					util.setStorageSync({
						key: 'session_id',
						data: ''
					});
					util.goTab({
						url: '../tabBar/user'
					});
				});
			}
		}
	}
</script>
