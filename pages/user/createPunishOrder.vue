<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">经销商编号：</text>
				<input-box placeholder="经销商编号"></input-box>
			</view>
			<view class="input-row">
				<text class="title">经销商姓名：</text>
				<input-box placeholder="经销商姓名"></input-box>
			</view>
			<view class="input-row">
				<text class="title">处罚类别：</text>
				<radio-group class="uni-flex" name="gender" @change="changeMoneyNature">
					<label><radio value="0" checked color="#f23030" />类别一</label>
					<label><radio value="1" color="#f23030" />类别二</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">处罚说明：</text>
				<textarea style="padding: 10px 11px; height: 60px;" placeholder="请输入处罚说明"/>
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
