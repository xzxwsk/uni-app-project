<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title"><text class="price">*</text>退款金额：</text>
				<input-box ref="returnAmount" type="text" :verification="['isNull']" :verificationTip="['退款金额不能为空']" class="input-box" clearable focus v-model="returnAmount" placeholder="请输入退款金额"></input-box>
			</view>
			<view class="input-row">
				<text class="title">付款方式：</text>
				<radio-group class="pay_type" name="payType" @change="changeMoneyType">
					<label class="label"><radio value="3" color="#f23030" :checked="ReturnInfo.PayType === 3" />微信</label>
					<label class="label"><radio value="2" color="#f23030" :checked="ReturnInfo.PayType === 2" />支付宝</label>
					<label class="label"><radio value="1" color="#f23030" :checked="ReturnInfo.PayType === 1" />银行转账</label>
					<label class="label"><radio value="0" color="#f23030" :checked="ReturnInfo.PayType === 0" />现金</label>
				</radio-group>
			</view>
			<block v-if="ReturnInfo.PayType !== 0">
				<view class="input-row" v-if="ReturnInfo.PayType === 1">
					<text class="title">付款方银行：</text>
					<input-box v-model="ReturnInfo.PayBank" placeholder="请输入付款方银行"></input-box>
				</view>
				<view class="input-row">
					<text class="title">付款方帐号：</text>
					<input-box v-model="ReturnInfo.PayAccountNo" :placeholder="placeholder"></input-box>
				</view>
				<view class="input-row" v-if="ReturnInfo.PayType === 1">
					<text class="title">付款方户名：</text>
					<input-box v-model="ReturnInfo.PayAccountName" placeholder="请输入付款方户名"></input-box>
				</view>
				<view class="input-row">
					<text class="title">收款方账户信息：</text>
					<text>{{ReturnInfo.ReceiveAccountInfo}}</text>
				</view>
			</block>
		</view>
		<view class="result">
			<button class="btn" type="warn" @click="saveOrder">核准</button>
		</view>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import util from '@/common/util.js';
	import {mapState} from 'vuex';
	export default {
		components: {
			inputBox
		},
		computed: mapState(['openid', 'userInfo']),
		data() {
			return {
				recordId: '',
				returnAmount: '',
				ReturnInfo : {
				  PayType: 0  /*付款方式*/,
				  ReceiveAccountInfo: ""  /*收款方账户信息*/,
				  PayBank: ""  /*付款银行*/,
				  PayAccountNo: ""  /*付款账户*/,
				  PayAccountName: ""  /*付款户名*/
				} /*退款信息 [PayInfo]*/,
				placeholder: '请输入付款人微信帐号'
			}
		},
		onLoad(option) {
			if (option.hasOwnProperty('id')){
				this.recordId = id;
			}
			if (this.ReturnInfo.PayType === 3) {
				this.ReturnInfo.ReceiveAccountInfo = this.userInfo.MicromsgNo;
			} else if (this.ReturnInfo.PayType === 2) {
				this.ReturnInfo.ReceiveAccountInfo = this.userInfo.AlipayAccNo;
			} else if (this.ReturnInfo.PayType === 1) {
				this.ReturnInfo.ReceiveAccountInfo = this.userInfo.AccountNo;
			} else {
				this.ReturnInfo.ReceiveAccountInfo = '';
			}
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
				this.ReturnInfo.PayType = Number(e.target.value);
				if (e.target.value === '3') {
					this.placeholder = '请输入付款方微信帐号';
					this.ReturnInfo.ReceiveAccountInfo = this.userInfo.MicromsgNo;
				} else if (e.target.value === '2') {
					this.placeholder = '请输入付款方支付宝帐号';
					this.ReturnInfo.ReceiveAccountInfo = this.userInfo.AlipayAccNo;
				} else if (e.target.value === '1') {
					this.placeholder = '请输入付款方银行帐号'
					this.ReturnInfo.ReceiveAccountInfo = this.userInfo.AccountNo;
				} else {
					this.ReturnInfo.ReceiveAccountInfo = '';
				}
			},
			saveOrder() {
				util.showLoading();
				util.ajax({
					method: 'Businese.BillLeaveDAL.ReturnGoodsMoney',
					params: {
						Filter: {
							"RecordId" : this.recordId /* [String]*/,
							"ReturnAmount" : 1.9 /*退款金额 [Decimal]*/,
							"ReturnInfo" : {
							  "PayType": 0  /*付款方式*/,
							  "ReceiveAccountInfo": ""  /*收款方账户信息*/,
							  "PayBank": ""  /*付款银行*/,
							  "PayAccountNo": ""  /*付款账户*/,
							  "PayAccountName": ""  /*付款户名*/
							} /*退款信息 [PayInfo]*/
						}
					},
					tags: {
						usertoken: this.openid
					}
				})
				.then(res => {
					util.hideLoading();
					util.showToast({
						title: '退款成功',
						success() {
							uni.navigateBack();
						}
					});
				});
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
