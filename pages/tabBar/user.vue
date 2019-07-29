<template>
	<view class="uni-padding-wrap uni-common-pb">
		<view class="user">
			<view class="top">
				<view class="login_box">
					<view class="login_con">
						<view class="head_img"><image style="width: 100%; height: 100%;" :mode="modeHead" :src="imgSrcHead" @error="imageError"></image></view>
						<view class="txt">
							<navigator url="../login/login" hover-class="navigator-hover">
								<text>登录</text>
							</navigator>
							<text class="split">/</text>
							<navigator url="../login/login" hover-class="navigator-hover">
								<text>注册</text>
							</navigator>
						</view>
					</view>
				</view>
				<view class="bg"><image style="width: 100%; height: 100%;" :mode="mode" :src="imgSrc" @error="imageError"></image></view>
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
						name: '个人资料',
						subName: '显示个人资料，可以修改部分资料(卡号、身份证号、姓名不能修改)',
						url: 'login/login'
					},
					{
						name: '收货地址',
						url: 'addr/addr'
					},
					{
						name: '资金账户',
						url: 'login/login'
					},
					{
						name: '奖金查询',
						url: 'login/login'
					},
					{
						name: '下属未提货资金余额',
						url: 'login/login'
					},
					{
						name: '下属奖金',
						url: 'login/login'
					},
					{
						name: '退出当前帐户',
						url: 'login/login'
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
