<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title"><text class="price">*</text>会员编号：</text>
				<input-box v-model="userNo" placeholder="请输入收款会员编号"></input-box>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>会员姓名：</text>
				<input-box v-model="userName" placeholder="请输入收款会员姓名"></input-box>
			</view>
			<view class="input-row border">
				<text class="title">款项性质：</text>
				<text class="txt">货款</text>
			</view>
			<view class="input-row">
				<text class="title">付款方式：</text>
				<radio-group class="uni-flex" name="gender" @change="changeMoneyType">
					<label><radio value="0" color="#f23030" checked />微信</label>
					<label><radio value="1" color="#f23030" />支付宝</label>
					<label><radio value="2" color="#f23030" />银行转账</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">对方帐号：</text>
				<input-box v-model="account" :placeholder="placeholder"></input-box>
			</view>
			<view class="input-row">
				<text class="title">付款金额：</text>
				<input-box type="number" v-model="amount" placeholder="元"></input-box>
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
				userNo: '',
				userName: '',
				moneyType: '1',
				account: '',
				amount: '',
				placeholder: '请输入收款人微信帐号'
			}
		},
		onLoad() {
			
		},
		methods: {
			changeMoneyNature(e) {
				// 款项性质
				console.log(e.target.value);
				this.moneyNature = e.target.value;
			},
			changeMoneyType(e) {
				// 付款方式
				console.log(e.target.value);
				this.moneyType = e.target.value;
				if (e.target.value === '0') {
					this.placeholder = '请输入收款人微信帐号'
				} else if (e.target.value === '1') {
					this.placeholder = '请输入收款人支付宝帐号'
				} else if (e.target.value === '2') {
					this.placeholder = '请输入收款人银行帐号'
				}
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
