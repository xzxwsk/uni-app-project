<template>
	<view class="create_pay_order">
		<scroll-view class="box" scroll-y>
			<view class="input-group">
				<view class="input-row">
					<text class="title">日期：</text>
					<customDatePicker class="search_box"
						fields="month"
						:start="startDate"
						:end="endDate"
						:value="dateValue"
						@change="bindDateChange"
					></customDatePicker>
				</view>
				<view class="input-row">
					<text class="title">会员编号：</text>
					<input-box disabled inputValue="sdfuserNodfgd" :clearShow="false" placeholder="会员编号"></input-box>
				</view>
				<view class="input-row">
					<text class="title">会员姓名：</text>
					<input-box placeholder="会员姓名"></input-box>
				</view>
				<view class="input-row">
					<text class="title">密码：</text>
					<input-box placeholder="密码"></input-box>
				</view>
				<view class="input-row">
					<text class="title">确认密码：</text>
					<input-box placeholder="确认密码"></input-box>
				</view>
				<view class="input-row">
					<text class="title">保证金：</text>
					<input-box type="number" placeholder="元"></input-box>
				</view>
				<view class="input-row">
					<text class="title">姓名：</text>
					<input-box placeholder="元"></input-box>
				</view>
				<view class="input-row">
					<text class="title">身份证正面照：</text>
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<view class="uni-uploader__file" v-if="frontImg != ''">
								<image class="uni-uploader__img" :src="frontImg" :data-src="frontImg" @tap="previewImage"></image>
							</view>
							<view class="uni-uploader__input-box">
								<view class="uni-uploader__input" @tap="chooseImage"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="input-row">
					<text class="title">身份证反面照：</text>
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<view class="uni-uploader__file" v-if="backImg != ''">
								<image class="uni-uploader__img" :src="backImg" :data-src="backImg" @tap="previewImage"></image>
							</view>
							<view class="uni-uploader__input-box">
								<view class="uni-uploader__input" @tap="chooseImage2"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="input-row">
					<radio class="protocal" value="0" @click="bindProtocal" color="#f23030" :checked="protocal" /><label @click="bindToProtocal">同意许可条款</label>
				</view>
			</view>
		</scroll-view>
		<view class="result">
			<button class="btn" type="warn" @click="saveOrder">保存</button>
		</view>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	// https://ext.dcloud.net.cn/plugin?id=220
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
	import util from '@/common/util.js';
	import frontImg from '@/static/img/H_027_1.jpg';
	import backImg from '@/static/img/H_9X10_1.jpg';
	export default {
		components: {
			inputBox, customDatePicker
		},
		data() {
			return {
				moneyNature: '0',
				amount: '',
				moneyType: '1',
				account: '',
				placeholder: '请输入收款人微信帐号',
				dateValue: '',
				startDate: '2010-01',
				endDate: '2199-12',
				protocal: false,
				frontImg: frontImg,
				backImg: backImg
			}
		},
		onLoad() {
			
		},
		methods: {
			bindDateChange(value) {
				console.log('bindDateChange: ', value);
				this.dateValue = value;
			},
			bindProtocal() {
				// 许可条款
				this.protocal = !this.protocal;
			},
			bindToProtocal(e) {
				// 查看许可条款
			},
			previewImage(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: [this.frontImg]
				})
			},
			async chooseImage() {
				uni.chooseImage({
					sourceType: ['album', 'camera'],
					sizeType: ['compressed'],
					count: 1,
					success: res => {
						console.log(res);
						this.frontImg = res.tempFilePaths[0];
					}
				});
			},			
			previewImage2(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: [this.backImg]
				})
			},
			async chooseImage2() {
				uni.chooseImage({
					sourceType: ['album', 'camera'],
					sizeType: ['compressed'],
					count: 1,
					success: res => {
						console.log(res);
						this.backImg = res.tempFilePaths[0];
					}
				});
			},
			saveOrder() {
				console.log(this.moneyNature, this.moneyType);
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
