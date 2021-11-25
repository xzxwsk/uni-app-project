<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title"><text class="price">*</text>会员编号：</text>
				<picker style="flex: 1;" @change="bindPickerChange" range-key="str" :range="idLs">
					<view class="uni-list-cell-navigate uni-navigate-bottom"
						:style="{color: selId !== '' ? '' : '#999'}"
					>{{selId !== '' ? idLs[selId].DealerNo : '请选择会员编号'}}</view>
				</picker>
				<!-- <input-box v-model="billObj.PayDealerCode" placeholder="请输入付款会员编号" @input="getNameOfCode"></input-box> -->
			</view>
			<view class="input-row">
				<text class="title">会员姓名：</text>
				<input-box ref="payDealerName" v-model="billObj.PayDealerName" placeholder="请输入付款会员姓名" disabled :clearShow="false"></input-box>
			</view>
			<view class="input-row border">
				<text class="title">款项性质：</text>
				<!-- <text class="txt">{{billObj.accountTypeStr}}</text> -->
				<radio-group class="pay_type" name="payType" 
					style="justify-content: flex-start;"
				>
					<label class="label" 
						v-for="(item, index) in kxxzTypeArr"
						:key="index"
						@click="changeKxxzType"
					><radio :value="item.value" color="#f23030" :checked="selectKxxzType === item.value"  />{{item.txt}}</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">申请金额：</text>
				<input-box ref="applyAmountRef" type="number" v-model="billObj.ApplyAmount" placeholder="元"></input-box>
			</view>
			<view class="input-row">
				<text class="title">可用积分：</text>
				<div style="flex: 1; display: flex; padding: 0 10px 0 0;">
					<span style="flex: 1; padding: 0 0 0 10px;">{{billObj.PayDealerId ? idLs[selId].AmountCanUse : 0}}</span>
					<button class="btn" type="warn" @click="onAll" style="width: 200rpx; height: 30px; line-height: 30px; font-size: 16px;" :disabled="!this.billObj.PayDealerId">全部提现</button>
				</div>
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
				selectKxxzType: '',
				kxxzTypeArr: [
					// {txt: '货款', value: '0'},
					{txt: '积分', value: '2'}
				],
				idLs: [], // 经销商可选列表
				selId: '', // 选中项
				billObj: {
					"RecordId": ""  /*单据Id*/,
				    "BillCode": ""  /*单据编号*/,
				    "BillDate": "2021-08-08T09:28:22.6174426+08:00"  /*单据日期*/,
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
				    "CreateTime": "2021-08-08T09:28:22.6174426+08:00"  /*录入时间*/,
				    "LastModifier": ""  /*最后修改人*/,
				    "LastModifierName": ""  /*最后修改人姓名*/,
				    "LastModifyTime": "2021-08-08T09:28:22.6174426+08:00"  /*最后修改时间*/,
				    "Auditor": ""  /*审核人*/,
				    "AuditorName": ""  /*审核人姓名*/,
				    "AuditTime": "2021-08-08T09:28:22.6174426+08:00"  /*审核时间*/,
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
			} else {
				this.initDefault();
			}
			// 获取经销商编号列表
			this.getIdLs()
		},
		methods: {
			init(id) {
				// 获取详情
				util.showLoading();
				util.ajax({
					method: 'Businese.BillPayReturnDAL.GetById',
					params: {
						RecordId: id
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					this.billObj = res.data.result;
					this.billObj.billDateStr = util.formatDate(this.billObj.BillDate, 'yyyy-MM-dd');
					this.billObj.accountTypeStr = ['货款', '合规金', '积分'][this.billObj.AccountType];
				});
			},
			initDefault() {
				util.showLoading();
				util.ajax({
					method: 'Businese.BillPayReturnDAL.CreateDefault',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					this.billObj = res.data.result;
					this.billObj.billDateStr = util.formatDate(this.billObj.BillDate, 'yyyy-MM-dd');
					this.billObj.accountTypeStr = ['货款', '合规金', '积分'][this.billObj.AccountType];
				});
			},
			// 获取经销商编号列表
			getIdLs() {
				util.ajax({
					method: 'Businese.QueryAppDAL.QueryMyAccountBonus',
				}).then(res => {
					const { result } = res.data
					console.log('getIdLs: ', result)
					result.forEach(item => {
						item.str = item.DealerNo + '  ' + item.DealerName
					})
					this.idLs = result
				})
			},
			// 选中经销商
			bindPickerChange(e) {
				console.log('bindPickerChange: ', e)
				const { value } = e.detail
				this.selId = value
				// 带出名称，金额
				this.billObj.PayDealerId = this.idLs[value].DealerId 
				this.billObj.PayDealerCode = this.idLs[value].DealerNo
				this.billObj.PayDealerName = this.idLs[value].DealerName 
				this.$refs.payDealerName.setValue(this.idLs[value].DealerName)
				this.selectKxxzType = '2'
			},
			// 全部提现
			onAll() {
				if (this.selId !== '') {
					this.billObj.ApplyAmount = this.idLs[this.selId].AmountCanUse 
					this.$refs.applyAmountRef.setValue(this.idLs[this.selId].AmountCanUse)
				}
			},
			getNameOfCode(e) {
				// 通过分销商编号获取姓名
				util.ajax({
					method: 'SYS.DealerDAL.GetByCode',
					params: {
						Code: e
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					if (res.data.hasOwnProperty('result')) {
						this.billObj.PayDealerId = res.data.result.DealerId;
						this.billObj.PayDealerCode = res.data.result.DealerNo;
						this.billObj.PayDealerName = res.data.result.DealerName;
						this.$refs.payDealerName.setValue(res.data.result.DealerName);
					} else {
						this.billObj.PayDealerId = '';
						this.billObj.PayDealerCode = '';
						this.billObj.PayDealerName = '';
						this.$refs.payDealerName.setValue('');
					}
				});
			},
			// 修改款项性质
			changeKxxzType(e) {
				let value = this.selectKxxzType
				if (value === '') {
					value = this.kxxzTypeArr[0].value
				}
				console.log('value: ', value, e)
				this.billObj.AccountType = value
				this.selectKxxzType = value
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
				console.log('PayDealerId： ', this.billObj.PayDealerId);
				if (!this.billObj.PayDealerId) {
					util.showToast({
						title: '请先选择会员编号'
					})
					return
				}
				if (!this.billObj.ApplyAmount === '') {
					util.showToast({
						title: '请输入申请金额'
					})
					return
				}
				this.billObj.ApplyAmount = Number(this.billObj.ApplyAmount)
				if (isNaN(this.billObj.ApplyAmount)) {
					this.billObj.ApplyAmount = 0
				}
				if (this.selectKxxzType !== '') {
					this.billObj.AccountType = Number(this.selectKxxzType)
				}
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
							const pages = getCurrentPages()
							if (pages.length >= 2) {
								const prevPage = pages[pages.length-2]
								if (prevPage) {
									prevPage.$vm.init()
									uni.navigateBack();
								}
							}
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
<style scoped>
/deep/ .uni-list-cell-navigate.uni-navigate-bottom:after{
	font-size: 25px;
}
</style>