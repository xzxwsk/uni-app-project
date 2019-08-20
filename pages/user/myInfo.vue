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
				<button type="warn" class="btn">退出当前帐户</button>
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
						name: '收货地址',
						// subName: '显示个人资料，可以修改部分资料(卡号、身份证号、姓名不能修改)',
						url: 'addr/addr',
						icon: 'location-filled'
					},
					{
						name: '密码修改',
						url: 'login/pwd',
						icon: 'paperplane'
					},
					{
						name: '清除缓存',
						url: 'about/about',
						icon: 'paperplane'
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
