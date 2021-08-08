<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title"><text class="price">*</text>收款人会员编号：</text>
				<input-box :inputValue="billObj.RcvDealerCode" disabled :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">收款人会员姓名：</text>
				<input-box :inputValue="billObj.RcvDealerName" disabled :clearShow="false"></input-box>
			</view>
			<view class="input-row border">
				<text class="title">款项性质：</text>
				<radio-group class="uni-flex" name="nature" @change="changeMoneyNature">
					<label><radio value="0" :checked="billObj.AccountType === 0" color="#f23030" disabled />货款</label>
					<label><radio value="1" :checked="billObj.AccountType === 2" color="#f23030" disabled />积分</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">申请金额：</text>
				<input-box ref="applyAmountRef" type="number" disabled :clearShow="false" :inputValue="billObj.ApplyAmount + '元'"></input-box>
			</view>
			<view class="input-row">
				<text class="title">实付金额：</text>
				<input-box ref="amount" type="number" :inputValue="billObj.Amount ? String(billObj.Amount) : ''" v-model="billObj.Amount" placeholder="元"></input-box>
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
			<block v-if="billObj.PayType !== 0">
				<view class="input-row" v-if="billObj.PayType === 1">
					<text class="title">付款方帐号：</text>
					<input-box ref="payAccountNo" v-model="billObj.PayAccountNo" :placeholder="placeholder"></input-box>
				</view>
				<view class="input-row" v-if="billObj.PayType === 1">
					<text class="title">付款方银行：</text>
					<input-box ref="payBank" v-model="billObj.PayBank" placeholder="请输入付款方银行"></input-box>
				</view>
				<view class="input-row" v-if="billObj.PayType === 1">
					<text class="title">付款方户名：</text>
					<input-box ref="payAccountName" v-model="billObj.PayAccountName" placeholder="请输入付款方户名"></input-box>
				</view>
				<view class="input-row">
					<text class="title">对方帐号：</text>
					<text>{{billObj.ReceiveAccountInfo}}</text>
				</view>
			</block>
			<view class="input-row">
				<text class="title">对方联系方式：</text>
				<text>{{billObj.ReceivorInfo}}</text>
			</view>
			<view class="input-row" v-if="billObj.PayType === 2 || billObj.PayType === 3">
				<text class="title">收款码：</text>
				<image mode="aspectFit" class="uni-uploader__img" :src="billObj.PayCodeFileNameStr" :data-src="billObj.PayCodeFileNameStr" @tap="previewImage"></image>
			</view>
		</view>
		<view class="result">
			<button class="btn" :disabled="saving" type="warn" @click="saveOrder">保存</button>
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
		computed: mapState(['openid', 'payRefund']),
		data() {
			return {
				placeholder: '请输入收款人微信帐号',
				placeholder2: '请输入收款人微信帐号',
				repayDealer: [], // 代支付分销商列表
				selectRepayDealer: {},
				saving: false,
				billObj: {
					"RecordId": ""  /*单据Id*/,
					"BillCode": ""  /*单据编号*/,
					"BillDate": "2021-08-07T21:31:25.2279456+08:00"  /*单据日期*/,
					"ApplyAmount": 0.0  /*申请金额*/,
					"Amount": 0.0  /*付款金额*/,
					"RcvDealerId": ""  /*收款方经销商Id*/,
					"RcvDealerCode": ""  /*收款方经销商编号*/,
					"RcvDealerName": ""  /*收款方经销商姓名*/,
					"AccountType": 0  /*付款类别*/,
					"PayType": 0  /*付款方式*/,
					"ReceiveAccountInfo": ""  /*收款方账户信息*/,
					"PayBank": ""  /*付款银行*/,
					"PayAccountNo": ""  /*付款账户*/,
					"PayAccountName": ""  /*付款户名*/,
					"Remark": ""  /*备注*/,
					"State": 1  /*State*/,
					"Creator": ""  /*录入人*/,
					"CreatorName": ""  /*录入人姓名*/,
					"CreateTime": "2021-08-07T21:31:25.2279456+08:00"  /*录入时间*/,
					"LastModifier": ""  /*最后修改人*/,
					"LastModifierName": ""  /*最后修改人姓名*/,
					"LastModifyTime": "2021-08-07T21:31:25.2279456+08:00"  /*最后修改时间*/,
					"Auditor": ""  /*审核人*/,
					"AuditorName": ""  /*审核人姓名*/,
					"AuditTime": "2021-08-07T21:31:25.2279456+08:00"  /*审核时间*/,
					"StateChanged": false  /*状态是否发生过改变*/,
					"PayDealerId": ""  /*付款方经销商Id*/,
					"PayDealerCode": ""  /*付款方经销商编号*/,
					"PayDealerName": ""  /*付款方经销商姓名*/,
					"TimeStamp": ""  /*时间戳*/,
					"ChangeType": 0,
					"IdValues": [
						""
					],
					"iState": 1
				}
			}
		},
		mounted() {
			console.log('option: ', this.payRefund)
			this.getDefault();
		},
		methods: {
			getDefault() {
				for (let key in this.billObj) {
					if (this.payRefund[key]) {
						this.billObj[key] = this.payRefund[key]
					}
				}
				console.log('ref: ', this.$refs.applyAmountRef, this.billObj.ApplyAmount + '元')
				this.$refs.applyAmountRef.setValue(this.billObj.ApplyAmount + '元');
			},
			getRepayDealerLs() {
				// 获取代支付分销商列表
				util.ajax({
					method: 'Businese.BillPayDAL.GetDepositRepayDealer',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					this.repayDealer = res.data.result;
				});
			},
			// 付款单获取默认支付信息
			getDefaultPayInfo(accountType) {
				util.ajax({
					method: 'Businese.BillPayDAL.GetDefaultPayInfo',
					params: {
						PayType: this.billObj.PayType,
						AccountType: accountType,
						Amount: this.billObj.Amount
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					res.data.result = util.jsonReplace(res.data.result, 'null', '""');
					this.billObj.PayAccountNo = res.data.result.PayAccountNo;
					this.billObj.payBank = res.data.result.payBank;
					this.billObj.PayAccountName = res.data.result.PayAccountName;
					this.billObj.ReceiveAccountInfo = res.data.result.ReceiveAccountInfo;
					this.billObj.ReceivorInfo = res.data.result.ReceivorInfo;
					this.billObj.PayCodeFileNameStr = util.getBaseUrl() + 'files/downloadfile?filename=' + this.billObj.PayCodeFileName;
					if (this.$refs.payAccountNo) {
						this.$refs.payAccountNo.setValue(res.data.result.PayAccountNo);
					}
					if (this.$refs.payBank) {
						this.$refs.payBank.setValue(res.data.result.PayBank);
					}
					if (this.$refs.payAccountName) {
						this.$refs.payAccountName.setValue(res.data.result.PayAccountName);
					}
				});
			},
			changeMoneyNature(e) {
				// 款项性质
				this.billObj.AccountType = Number(e.target.value);
				this.getDefault();
				/* 
				if(this.billObj.AccountType === 2) {
					if(this.$refs.amount && this.selectRepayDealer.Amount) {
						this.$refs.amount.setValue(this.selectRepayDealer.Amount);
						this.billObj.Amount = this.selectRepayDealer.Amount;
					}
				}
				 */
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
				// 付款单获取默认支付信息
				this.getDefaultPayInfo(this.billObj.AccountType);
			},
			changeRepayDealer(e) {
				// 选择代支付分销商
				let selectRepayDealer = this.repayDealer.find(item => {
					return item.DealerId = e.target.value;
				})
				this.billObj.RepayDealerId = selectRepayDealer.DealerId
				this.billObj.RepayDealerCode = selectRepayDealer.DealerCode
				this.billObj.RepayDealerName = selectRepayDealer.DealerName
				this.billObj.Amount = selectRepayDealer.Amount;
				this.selectRepayDealer = selectRepayDealer;
				if(this.$refs.amount) {
					this.$refs.amount.setValue(selectRepayDealer.Amount);
				}
			},
			previewImage(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: 0,
					urls: [current]
				})
			},
			saveOrder() {
				let me = this;
				this.saving = true;
				this.billObj.Amount = Number(this.billObj.Amount);
				for(let key in this.billObj) {
					if (typeof this.billObj[key] === 'string') {
						this.billObj[key] = this.billObj[key].trim();
					}
				}
				util.showLoading();
				util.ajax({
					method: 'Businese.BillPayDAL.Create',
					params: {
						Bill: this.billObj
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					util.showToast({
						title: '创建付款单成功',
						success() {
							setTimeout(() => {
								me.saving = false;
								util.goUrl({
									url: '../order/payOrder'
								});
							}, 1000);
						}
					});
				}).catch(e => {
					console.log(e)
					me.saving = false;
				})
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
