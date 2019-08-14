<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">日期：</text>
				<customDatePicker
					fields="month"
					:start="startDate"
					:end="endDate"
					:value="dateValue"
					@change="bindDateChange"
				></customDatePicker>
			</view>
			<view class="input-row">
				<text class="title">会员编号：</text>
				<input-box placeholder="会员编号"></input-box>
			</view>
			<view class="input-row">
				<text class="title">会员姓名：</text>
				<input-box placeholder="会员姓名"></input-box>
			</view>
			<view class="input-row">
				<text class="title">保证金：</text>
				<input-box type="number" placeholder="元"></input-box>
			</view>
			<view class="input-row">
				<text class="title">姓名：</text>
				<input-box placeholder="元"></input-box>
			</view>
		</view>
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
			}
		},
		onLoad() {
			
		},
		methods: {
			bindDateChange(value) {
				console.log('bindDateChange: ', value);
				this.dateValue = value;
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
