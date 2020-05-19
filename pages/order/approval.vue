<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">退款金额：</text>
				<input-box ref="returnAmount" type="text" :clearShow="false" disabled :inputValue="curPayReturnItems.Amount" v-model="curPayReturnItems.Amount" class="input-box"></input-box>
			</view>
			<block v-for="(item, index) in curPayReturnItems" :key="index">
				<view class="input-row">
					<text class="title">付款方式：</text>
					<radio-group class="pay_type" name="payType" :data-index="index" @change="changeMoneyType">
						<label class="label"><radio value="3" color="#f23030" :checked="item.PayType === 3" />微信</label>
						<label class="label"><radio value="2" color="#f23030" :checked="item.PayType === 2" />支付宝</label>
						<label class="label"><radio value="1" color="#f23030" :checked="item.PayType === 1" />银行转账</label>
						<label class="label"><radio value="0" color="#f23030" :checked="item.PayType === 0" />现金</label>
					</radio-group>
				</view>
				<block v-if="item.PayType !== 0">
					<view class="input-row" v-if="item.PayType === 1">
						<text class="title">付款方银行：</text>
						<input-box :ref="'payBank' + index" :inputValue="item.PayBank" v-model="item.PayBank" placeholder="请输入付款方银行"></input-box>
					</view>
					<view class="input-row">
						<text class="title">付款方帐号：</text>
						<input-box :ref="'payAccountNo' + index" :inputValue="item.PayAccountNo" v-model="item.PayAccountNo" :placeholder="placeholder"></input-box>
					</view>
					<view class="input-row" v-if="item.PayType === 1">
						<text class="title">付款方户名：</text>
						<input-box :ref="'payAccountName' + index" :inputValue="item.PayAccountName" v-model="item.PayAccountName" placeholder="请输入付款方户名"></input-box>
					</view>
					<view class="input-row">
						<text class="title">收款方账户信息：</text>
						<text class="info">{{item.ReceiveAccountInfo}}</text>
					</view>
				</block>
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
				curPayReturnItems: [
				  {
					"DtlId": ""  /*FId*/,
					"RecordId": ""  /*单据Id*/,
					"AccountType": 0  /*退款类别*/,
					"Amount": 0.0  /*退款金额*/,
					"DealerId": ""  /*退款分销商Id*/,
					"DealerCode": ""  /*退款分销商编号*/,
					"DealerName": ""  /*退款分销商名称*/,
					"PayType": 0  /*退款方式*/,
					"ReceiveAccountInfo": ""  /*收款方账户信息*/,
					"PayBank": ""  /*付款银行*/,
					"PayAccountNo": ""  /*付款账户*/,
					"PayAccountName": ""  /*付款户名*/,
					"Creator": ""  /*录入人*/,
					"CreatorName": ""  /*录入人姓名*/,
					"CreateTime": "2020-02-15T14:12:51.1542856+08:00"  /*录入时间*/,
					"ChangeType": 0
				  }
				],
				billObj: {
					"RecordId": ""  /*单据Id*/,
					"BillCode": ""  /*单据编号*/,
					"BillDate": "2020-02-15T14:12:51.1542856+08:00"  /*单据日期*/,
					"DealerId": ""  /*分销商Id*/,
					"DealerCode": ""  /*分销商编号*/,
					"DealerName": ""  /*分销商姓名*/,
					"Remark": ""  /*备注*/,
					"State": 1  /*State*/,
					"Creator": ""  /*录入人*/,
					"CreatorName": ""  /*录入人姓名*/,
					"CreateTime": "2020-02-15T14:12:51.1542856+08:00"  /*录入时间*/,
					"LastModifier": ""  /*最后修改人*/,
					"LastModifierName": ""  /*最后修改人姓名*/,
					"LastModifyTime": "2020-02-15T14:12:51.1542856+08:00"  /*最后修改时间*/,
					"StateChanged": false  /*状态是否发生过改变*/,
					"TimeStamp": ""  /*时间戳*/,
					"ChangeType": 0,
					"IdValues": [
					  ""
					],
					"iState": 1,
					"PayReturnItems": [
					  {
						"DtlId": ""  /*FId*/,
						"RecordId": ""  /*单据Id*/,
						"AccountType": 0  /*退款类别*/,
						"Amount": 0.0  /*退款金额*/,
						"DealerId": ""  /*退款分销商Id*/,
						"DealerCode": ""  /*退款分销商编号*/,
						"DealerName": ""  /*退款分销商名称*/,
						"PayType": 0  /*退款方式*/,
						"ReceiveAccountInfo": ""  /*收款方账户信息*/,
						"PayBank": ""  /*付款银行*/,
						"PayAccountNo": ""  /*付款账户*/,
						"PayAccountName": ""  /*付款户名*/,
						"Creator": ""  /*录入人*/,
						"CreatorName": ""  /*录入人姓名*/,
						"CreateTime": "2020-02-15T14:12:51.1542856+08:00"  /*录入时间*/,
						"ChangeType": 0
					  }
					]
				},
				placeholder: '请输入付款人微信帐号'
			}
		},
		onLoad(option) {
			if (option.hasOwnProperty('id')){
				this.init(option.id);
			}
		},
		methods: {
			init(id) {
				util.showLoading();
				util.ajax({
					method: 'Businese.BillLeaveDAL.GetById',
					params: {
						RecordId: id
					},
					tags: {
						usertoken: this.openid
					}
				})
				.then(res => {
					util.hideLoading();
					console.log('this.userInfo: ', this.userInfo);
					
					res.data.result = util.jsonReplace(res.data.result, 'null', '""');
					this.billObj = res.data.result;
					this.curPayReturnItems = this.billObj.PayReturnItems.filter(item => {
						return item.DealerId === this.userInfo.DealerId && item.AccountType === 0;
					});
					if (this.curPayReturnItems[0].PayType === 3) {
						this.curPayReturnItems[0].ReceiveAccountInfo = this.userInfo.MicromsgInfo;
						if(this.$refs['payAccountNo' + 0]) {
							this.$refs['payAccountNo' + 0].setValue(this.userInfo.MicromsgNo);
						}
					} else if (this.curPayReturnItems[0].PayType === 2) {
						this.curPayReturnItems[0].ReceiveAccountInfo = this.userInfo.AlipayInfo;
						if(this.$refs['payAccountNo' + 0]) {
							this.$refs['payAccountNo' + 0].setValue(this.userInfo.AlipayAccNo);
						}
					} else if (this.curPayReturnItems[0].PayType === 1) {
						this.curPayReturnItems[0].ReceiveAccountInfo = this.userInfo.BankInfo;
						if(this.$refs['payAccountNo' + 0]) {
							this.$refs['payAccountNo' + 0].setValue(this.userInfo.AccountNo);
						}
					} else {
						this.curPayReturnItems[0].ReceiveAccountInfo = '';
					}
					if(this.$refs['returnAmount']) {
						this.$refs['returnAmount'].setValue(this.curPayReturnItems[0].Amount);
					}
					if(this.$refs['payBank' + 0]) {
						this.$refs['payBank' + 0].setValue(this.userInfo.Bank);
					}
					if(this.$refs['payAccountName' + 0]) {
						this.$refs['payAccountName' + 0].setValue(this.userInfo.AccountName);
					}
				});
			},
			changeMoneyType(e) {
				console.log(this.$refs);
				// 付款方式
				let index = Number(e.currentTarget.dataset.index);
				this.curPayReturnItems[index].PayType = Number(e.target.value);
				this.$nextTick(() => {
					if (e.target.value === '3') {
						this.placeholder = '请输入付款方微信帐号';
						this.curPayReturnItems[0].ReceiveAccountInfo = this.userInfo.MicromsgInfo;
						if(this.$refs['payAccountNo' + 0]) {
							this.$refs['payAccountNo' + 0][0].setValue(this.userInfo.MicromsgNo);
						}
					} else if (e.target.value === '2') {
						this.placeholder = '请输入付款方支付宝帐号';
						this.curPayReturnItems[0].ReceiveAccountInfo = this.userInfo.AlipayInfo;
						if(this.$refs['payAccountNo' + 0]) {
							this.$refs['payAccountNo' + 0][0].setValue(this.userInfo.AlipayAccNo);
						}
					} else if (e.target.value === '1') {
						this.placeholder = '请输入付款方银行帐号';
						this.curPayReturnItems[0].ReceiveAccountInfo = this.userInfo.BankInfo;
						if(this.$refs['payAccountNo' + 0]) {
							this.$refs['payAccountNo' + 0][0].setValue(this.userInfo.AccountNo);
						}
						if(this.$refs['payBank' + 0]) {
							this.$refs['payBank' + 0][0].setValue(this.userInfo.Bank);
						}
						if(this.$refs['payAccountName' + 0].length) {
							this.$refs['payAccountName' + 0][0].setValue(this.userInfo.AccountName);
						}
					} else {
						this.curPayReturnItems[0][0].ReceiveAccountInfo = '';
					}
				});
			},
			saveOrder() {
				util.showLoading();
				util.ajax({
					method: 'Businese.BillLeaveDAL.ReturnGoodsMoney',
					params: {
						"RecordId" : this.billObj.RecordId /* [String]*/,
						"ReturnAmount" : this.curPayReturnItems[0].Amount /*退款金额 [Decimal]*/,
						"ReturnInfo" : {
						  "PayType": this.curPayReturnItems[0].PayType  /*付款方式*/,
						  "ReceiveAccountInfo": this.curPayReturnItems[0].ReceiveAccountInfo  /*收款方账户信息*/,
						  "PayBank": this.curPayReturnItems[0].PayAccountNo  /*付款银行*/,
						  "PayAccountNo": this.curPayReturnItems[0].PayAccountNo  /*付款账户*/,
						  "PayAccountName": this.curPayReturnItems[0].PayAccountName  /*付款户名*/
						} /*退款信息 [PayInfo]*/
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
