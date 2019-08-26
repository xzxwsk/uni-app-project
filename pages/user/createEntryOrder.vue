<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">单据编号：</text>
				<input-box disabled inputValue="sdfuserNodfgd" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">单据日期：</text>
				<input-box disabled inputValue="2018-08-12" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">经销商编号：</text>
				<input-box disabled inputValue="sdfuserNodfgd" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">姓名：</text>
				<input-box placeholder="请输入姓名"></input-box>
			</view>
			<view class="input-row">
				<text class="title">生日：</text>
				<customDatePicker class="search_box"
					fields="day"
					:start="startDate"
					:end="endDate"
					:value="birthdayValue"						
				></customDatePicker>
			</view>
			<view class="input-row">
				<text class="title">性别：</text>
				<radio-group class="uni-flex" name="gender" @change="changeMoneyNature">
					<label><radio value="0" checked color="#f23030" />男</label>
					<label><radio value="1" color="#f23030" />女</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">婚否：</text>
				<radio-group class="uni-flex" name="marriage" @change="changeMarriage">
					<label><radio value="0" checked color="#f23030" />是</label>
					<label><radio value="1" color="#f23030" />否</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">学历：</text>
				<input-box placeholder="请输入学历"></input-box>
			</view>
			<view class="input-row">
				<text class="title">籍贯：</text>
				<view class="input_box" @tap="selectArea">
					<input class="ipt" type="text" disabled v-model="area" placeholder="请选择籍贯地址"></input>
					<view class="uni-icon uni-icon-arrowright"></view>
				</view>
			</view>
			<view class="input-row">
				<text class="title">家庭地址：</text>
				<input-box placeholder="请输入详细地址"></input-box>
			</view>
			<view class="input-row">
				<text class="title">邮编：</text>
				<input-box placeholder="邮编"></input-box>
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
				birthdayValue: '',
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
				url: './createEntryOrder2'
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
