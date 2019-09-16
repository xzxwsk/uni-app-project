<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">款项性质：</text>
				<radio-group class="uni-flex" name="nature" @change="changeMoneyNature">
					<label><radio value="0" :checked="billObj.AccountType === 0" color="#f23030" />货款</label>
					<label><radio value="1" :checked="billObj.AccountType === 1" color="#f23030" />保证金</label>
					<label><radio value="2" :checked="billObj.AccountType === 2" color="#f23030" />代交保证金</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">付款方式：</text>
				<radio-group class="pay_type" name="payType" @change="changeMoneyType">
					<label class="label"><radio value="3" :checked="billObj.PayType === 3" color="#f23030" />微信</label>
					<label class="label"><radio value="2" :checked="billObj.PayType === 2" color="#f23030" />支付宝</label>
					<label class="label"><radio value="1" :checked="billObj.PayType === 1" color="#f23030" />银行转账</label>
					<label class="label"><radio value="0" :checked="billObj.PayType === 0" color="#f23030" />现金</label>
				</radio-group>
			</view>
			<view class="input-row" v-if="billObj.PayType !== 0">
				<text class="title">付款方帐号：</text>
				<input-box v-model="billObj.PayAccountNo" :placeholder="placeholder"></input-box>
			</view>
			<view class="input-row" v-if="billObj.PayType !== 0">
				<text class="title">对方帐号：</text>
				<text>{{billObj.ReceiveAccountInfo}}</text>
			</view>
			<view class="input-row">
				<text class="title">付款金额：</text>
				<input-box type="number" v-model="billObj.Amount" placeholder="元"></input-box>
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
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox
		},
		computed: mapState(['openid']),
		data() {
			return {
				placeholder: '请输入收款人微信帐号',
				placeholder2: '请输入收款人微信帐号',
				billObj: {}
			}
		},
		onLoad() {
			
		},
		mounted() {
			this.getDefault();
		},
		methods: {
			getDefault() {
				// 生成默认付款单
				util.ajax({
					method: 'Businese.BillPayDAL.CreateDefault',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					console.log('默认付款单：', res);
					this.billObj = res.data.result;
				});
			},
			changeMoneyNature(e) {
				// 款项性质
				this.billObj.AccountType = Number(e.target.value);
			},
			changeMoneyType(e) {
				// 付款方式
				this.billObj.PayType = Number(e.target.value);
				if (e.target.value === '3') {
					this.placeholder = '请输入付款人微信帐号';
					this.placeholder2 = '请输入收款人微信帐号';
				} else if (e.target.value === '2') {
					this.placeholder = '请输入付款人支付宝帐号';
					this.placeholder2 = '请输入收款人支付宝帐号';
				} else if (e.target.value === '1') {
					this.placeholder = '请输入付款人银行帐号';
					this.placeholder2 = '请输入收款人银行帐号';
				}
			},
			saveOrder() {
				this.billObj.Amount = Number(this.billObj.Amount);
				for(let key in this.billObj) {
					if (typeof this.billObj[key] === 'string') {
						this.billObj[key] = this.billObj[key].trim();
					}
				}
				util.ajax({
					method: 'Businese.BillPayDAL.Create',
					params: {
						Bill: this.billObj
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					console.log('创建付款单：', res);
					util.showToast({
						title: '创建付款单成功',
						success() {
							setTimeout(() => {
								util.goUrl({
									url: '../order/payOrder'
								});
							}, 1000);
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
