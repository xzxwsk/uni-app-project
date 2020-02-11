<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title"><text class="price">*</text>会员编号：</text>
				<input-box v-model="billObj.RcvDealerCode" placeholder="请输入收款会员编号"></input-box>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>会员姓名：</text>
				<input-box v-model="billObj.RcvDealerName" placeholder="请输入收款会员姓名"></input-box>
			</view>
			<view class="input-row border">
				<text class="title">款项性质：</text>
				<text class="txt">{{billObj.accountTypeStr}}</text>
			</view>
			<view class="input-row">
				<text class="title">付款方式：</text>
				<radio-group class="pay_type" name="payType" @change="changeMoneyType">
					<label class="label"><radio value="3" color="#f23030" :checked="billObj.PayType === 3" />微信</label>
					<label class="label"><radio value="2" color="#f23030" :checked="billObj.PayType === 2" />支付宝</label>
					<label class="label"><radio value="1" color="#f23030" :checked="billObj.PayType === 1" />银行转账</label>
					<label class="label"><radio value="0" color="#f23030" :checked="billObj.PayType === 0" />现金</label>
				</radio-group>
			</view>
			<view class="input-row" v-if="billObj.PayType != 0">
				<text class="title">付款方帐号：</text>
				<input-box v-model="billObj.PayAccountNo" :placeholder="placeholder"></input-box>
			</view>
			<view class="input-row" v-if="billObj.PayType != 0">
				<text class="title">对方帐号：</text>
				<input-box v-model="billObj.ReceiveAccountInfo" :placeholder="placeholder"></input-box>
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
		computed: mapState(['openid', 'userInfo']),
		data() {
			return {
				placeholder: '请输入付款人微信帐号',
				billObj: {
				  "RecordId": ""  /*单据Id*/,
				  "BillCode": ""  /*单据编号*/,
				  "BillDate": "2019-09-19T11:24:51.9472886+08:00"  /*单据日期*/,
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
				  "CreateTime": ""  /*录入时间*/,
				  "LastModifier": ""  /*最后修改人*/,
				  "LastModifierName": ""  /*最后修改人姓名*/,
				  "LastModifyTime": ""  /*最后修改时间*/,
				  "Auditor": ""  /*审核人*/,
				  "AuditorName": ""  /*审核人姓名*/,
				  "AuditTime": ""  /*审核时间*/,
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
		onLoad(option) {
			if (option.hasOwnProperty('id')){
				let id = option.id;
				this.init(id)
			}
			this.billObj.billDateStr = util.formatDate(this.billObj.BillDate, 'yyyy-MM-dd');
			this.billObj.accountTypeStr = ['货款', '保证金', '代交保证金'][this.billObj.AccountType];
		},
		methods: {
			init(id) {
				// 获取详情
				util.showLoading();
				util.ajax({
					method: 'Businese.OrderDAL.GetById',
					params: {
						RecordId: id
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					this.billObj = res.data.result;
				});
			},
			changeMoneyNature(e) {
				// 款项性质
				console.log(e.target.value);
				this.moneyNature = e.target.value;
			},
			changeMoneyType(e) {
				// 付款方式
				let val = Number(e.target.value);
				this.billObj.PayType = val;
				if (val === 3) {
					this.placeholder = '请输入付款人微信帐号'
				} else if (val === 2) {
					this.placeholder = '请输入付款人支付宝帐号'
				} else if (val === 1) {
					this.placeholder = '请输入付款人银行帐号'
				}
			},
			saveOrder() {
				let me = this;
				util.showLoading();
				util.ajax({
					method: 'Businese.BillPayReturnDAL.Create',
					params: {
						Bill: this.billObj
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					util.showToast({
						title: '新建退款单成功',
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
