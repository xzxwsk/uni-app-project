<template>
	<view class="create_pay_order">
		<view class="box">
			<view class="input-group">
				<view class="input-row">
					<text class="title">开户银行：</text>
					<input-box placeholder="开户银行"></input-box>
				</view>
				<view class="input-row">
					<text class="title">银行帐号：</text>
					<input-box placeholder="银行帐号"></input-box>
				</view>
				<view class="input-row">
					<text class="title">户名：</text>
					<input-box placeholder="户名"></input-box>
				</view>
				<view class="input-row">
					<text class="title">支付宝帐号：</text>
					<input-box placeholder="支付宝帐号"></input-box>
				</view>
				<view class="input-row">
					<text class="title">微信帐号：</text>
					<input-box placeholder="微信帐号"></input-box>
				</view>
				<view class="input-row">
					<text class="title">备注：</text>
					<input-box placeholder="备注信息"></input-box>
				</view>
				<view class="input-row">
					<radio class="protocal" value="0" @click="bindProtocal" color="#f23030" :checked="protocal" /><label @click="bindToProtocal">同意许可条款</label>
				</view>
			</view>
		</view>
		<view class="result">
			<button class="btn" type="warn" @click="saveOrder">保存</button>
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
