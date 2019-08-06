<template>
	<view class="user">
		<view class="top">
			<view class="login_box">
				<view class="login_con">
					<view class="head_img"><image style="width: 100%; height: 100%;" :mode="modeHead" :src="imgSrcHead" @error="imageError"></image></view>
					<view class="txt" v-if="logined">
						<view class="user_info">
							<view class="user_name">wsk</view>
							<text>备注</text>
						</view>
						<view class="uni-icon uni-icon-gear" @click="goMyInfo"></view>
					</view>
					<view class="txt" v-else>
						<navigator url="../login/login" hover-class="navigator-hover">
							<text class="word">登录</text>
						</navigator>
						<text class="split">/</text>
						<navigator url="../login/login" hover-class="navigator-hover">
							<text class="word">注册</text>
						</navigator>
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
			<view class="btn">
				<view>
					<view class="uni-icon uni-icon-paperplane"></view>
				</view>
				我的库存查询
			</view>
			<view class="btn" @click="subordinateInfo">
				<view>
					<view class="uni-icon uni-icon-paperplane"></view>
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
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	export default {
		data() {
			return {
				logined: true,
				imgSrcHead: '/static/images/avatar_member.gif',
				modeHead: 'widthFix',
				imgSrc: '/static/images/member_bg.png',
				mode: 'widthFix',
				pages: [
					{
						name: '会员入职单',
						// subName: '显示个人资料，可以修改部分资料(卡号、身份证号、姓名不能修改)',
						url: 'login/login'
					},
					{
						name: '会员离职单',
						url: 'login/login'
					},
					{
						name: '处罚申请单',
						url: 'login/login'
					}
				]
			}
		},
		onLoad: function (option) {
			console.log('onload option: ', option);
		},
		methods: {
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			goDetailPage(url) {
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
				util.goUrl({
					url: '/pages/user/baseInfo'
				});
			},
			accountBalance() {
				// 帐户余额
				util.dialog({
					title: '帐户余额',
					content: '保证金余额：￥22.11\n   货款余额：￥354.00',
					showCancel: false
				})
			},
			bonus() {
				// 奖金查询
				util.goUrl({
					url: '/pages/user/bonus'
				})
			},
			subordinateInfo() {
				// 下属资料
				util.goUrl({
					url: '/pages/user/mySubordinateInfo'
				})
			},
			login() {
				this.logined = true;
			}
		}
	}
</script>
