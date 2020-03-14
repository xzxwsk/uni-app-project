<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">款项性质：</text>
				<radio-group class="uni-flex" name="nature" @change="changeMoneyNature">
					<label><radio value="0" :checked="billObj.AccountType === 0" color="#f23030" />货款</label>
					<label><radio value="1" :checked="billObj.AccountType === 1" color="#f23030" />保证金</label>
				</radio-group>
			</view>
			<view class="input-row" v-if="billObj.AccountType === 2">
				<text class="title">请选择经销商：</text>
				<radio-group class="pay_type" name="repayDealer" @change="changeRepayDealer">
					<label class="label" v-for="(item, index) in repayDealer" :key="index"><radio :value="item.DealerId" :checked="billObj.RepayDealerId === item.DealerId" color="#f23030" />{{item.DealerName}}</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">付款金额：</text>
				<input-box ref="amount" type="number" :disabled="billObj.AccountType === 2" :clearShow="billObj.AccountType !== 2" v-model="billObj.Amount" placeholder="元"></input-box>
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
				repayDealer: [], // 代支付经销商列表
				selectRepayDealer: {},
				billObj: {
					"RecordId": ""  /*单据Id*/,
					"BillCode": ""  /*单据编号*/,
					"BillDate": ""  /*单据日期*/,
					"Amount": 0.0  /*付款金额*/,
					"PayDealerId": ""  /*付款方经销商Id*/,
					"PayDealerCode": ""  /*付款方经销商编号*/,
					"PayDealerName": ""  /*付款方经销商姓名*/,
					"Remark": ""  /*备注*/,
					"AccountType": 0  /*付款类别*/,
					"PayType": 0  /*付款方式*/,
					"ReceiveAccountInfo": ""  /*收款方账户信息*/,
					"PayAccountInfo": ""  /*付款方账户信息*/,
					"PayBank": ""  /*付款银行*/,
					"PayAccountNo": ""  /*付款账户*/,
					"PayAccountName": ""  /*付款户名*/,
					"RcvDealerId": ""  /*收款方经销商Id*/,
					"RcvDealerCode": ""  /*收款方经销商编号*/,
					"RcvDealerName": ""  /*收款方经销商姓名*/,
					"RepayDealerId": ""  /*代付保证金经销商Id*/,
					"RepayDealerCode": ""  /*代付保证金经销商编码*/,
					"RepayDealerName": ""  /*代付保证金经销商名称*/,
					"State": 1  /*State*/,
					"Creator": ""  /*录入人*/,
					"CreatorName": ""  /*录入人姓名*/,
					"CreateTime": "2020-02-11T18:04:24.8193186+08:00"  /*录入时间*/,
					"LastModifier": ""  /*最后修改人*/,
					"LastModifierName": ""  /*最后修改人姓名*/,
					"LastModifyTime": "2020-02-11T18:04:24.8193186+08:00"  /*最后修改时间*/,
					"Auditor": ""  /*审核人*/,
					"AuditorName": ""  /*审核人姓名*/,
					"AuditTime": "2020-02-11T18:04:24.8193186+08:00"  /*审核时间*/,
					"StateChanged": false  /*状态是否发生过改变*/,
					"TimeStamp": ""  /*时间戳*/,
					"ChangeType": 0,
					"IdValues": [
					  ""
					],
					"iState": 1
				}
			}
		},
		onLoad() {
			
		},
		mounted() {
			this.getDefault(0);
		},
		methods: {
			getDefault(accountType) {
				// 生成默认付款单
				util.showLoading();
				util.ajax({
					method: 'Businese.BillPayDAL.CreateDefault',
					params: {
						AccountType: accountType
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					this.billObj = res.data.result;
					if(this.$refs.amount){
						this.$refs.amount.setValue(this.billObj.Amount);
					}
					// this.getRepayDealerLs();
					this.getDefaultPayInfo(accountType);
				});
			},
			getRepayDealerLs() {
				// 获取代支付经销商列表
				util.ajax({
					method: 'Businese.BillPayDAL.GetDepositRepayDealer',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					this.repayDealer = res.data.result;
				});
			},
			getDefaultPayInfo(accountType) {
				util.ajax({
					method: 'Businese.BillPayDAL.GetDefaultPayInfo',
					params: {
						PayType: this.billObj.PayType,
						AccountType: accountType
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
				console.log(this.billObj.AccountType);
				debugger;
				this.getDefault(this.billObj.AccountType);
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
				console.log(this.billObj.AccountType);
				debugger;
				this.getDefaultPayInfo(this.billObj.AccountType);
			},
			changeRepayDealer(e) {
				// 选择代支付经销商
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
			saveOrder() {
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
