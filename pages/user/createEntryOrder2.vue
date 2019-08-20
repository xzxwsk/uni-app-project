<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">身份证号：</text>
				<input-box placeholder="身份证号"></input-box>
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
				<text class="title">手机：</text>
				<input-box placeholder="手机"></input-box>
			</view>
			<view class="input-row">
				<text class="title">EMAIL：</text>
				<input-box placeholder="EMAIL"></input-box>
			</view>
			<view class="input-row">
				<text class="title">紧急联系人：</text>
				<input-box placeholder="紧急联系人"></input-box>
			</view>
			<view class="input-row">
				<text class="title">联系人电话：</text>
				<input-box placeholder="联系人电话"></input-box>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<input-box type="password" displayable v-model="password" placeholder="请输入密码"></input-box>
			</view>
			<view class="input-row">
				<text class="title">确认密码：</text>
				<input-box type="password" displayable v-model="password" placeholder="请再次输入密码"></input-box>
			</view>
		</view>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :pickerValueDefault="pickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-picker>
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
	import mpvuePicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import cityData from '@/common/city.data-3.js';
	export default {
		components: {
			inputBox, customDatePicker, mpvuePicker
		},
		data() {
			return {
				dateValue: '',
				startDate: '1900-01',
				endDate: '2199-12',
				protocal: false,
				frontImg: frontImg,
				backImg: backImg,
				pickerValueArray: [],
				mode: '',
				deepLength: 0,
				pickerValueDefault: [],
			}
		},
		onLoad() {
			
		},
		onNavigationBarButtonTap(e) {
			util.goUrl({
				url: './createEntryOrder3'
			});
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
				util.goUrl({
					url: './protocal'
				});
			},
			selectArea() {
				this.pickerValueArray = cityData;
				this.mode = 'multiLinkageSelector';
				this.deepLength = 3;
				this.pickerValueDefault = [22, 0, 1];
				this.$refs.mpvuePicker.show();
			},
			changeStatus() {
				//单据状态
			},
			changeMarriage() {
				// 婚否
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
				
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
