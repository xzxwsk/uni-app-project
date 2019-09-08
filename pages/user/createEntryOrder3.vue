<template>
	<view class="create_pay_order">
		<view class="box">
			<view class="input-group">
				<view class="input-row">
					<text class="title">开户银行：</text>
					<input-box v-model="billObj.Bank" placeholder="开户银行"></input-box>
				</view>
				<view class="input-row">
					<text class="title">银行帐号：</text>
					<input-box v-model="billObj.AccountNo" placeholder="银行帐号"></input-box>
				</view>
				<view class="input-row">
					<text class="title">户名：</text>
					<input-box v-model="billObj.AccountName" placeholder="户名"></input-box>
				</view>
				<view class="input-row">
					<text class="title">支付宝帐号：</text>
					<input-box v-model="billObj.AlipayAccNo" placeholder="支付宝帐号"></input-box>
				</view>
				<view class="input-row">
					<text class="title">微信帐号：</text>
					<input-box v-model="billObj.MicromsgNo" placeholder="微信帐号"></input-box>
				</view>
				<view class="input-row">
					<text class="title">备注：</text>
					<input-box v-model="billObj.Remark" placeholder="备注信息"></input-box>
				</view>
				<view class="input-row">
					<radio class="protocal" value="0" @click="bindProtocal" color="#f23030" :checked="protocal" /><label @click="bindToProtocal" class="a">同意许可条款</label>
				</view>
			</view>
		</view>
		<view class="result">
			<button class="btn" type="warn" :disabled="!protocal" @click="saveOrder">保存</button>
		</view>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import util from '@/common/util.js';
	export default {
		components: {
			inputBox
		},
		data() {
			return {
				protocal: false,
				billObj: {
					"RecordId": '',
					"BillCode": '',
					"BillDate": '',
					"AboveDealerId": '',
					"DealerNo": "",
					"DealerName": '',
					"BirthDay": '',
					"NativePlace": '',
					"IDCardNo": '',
					"Sex": 0,
					"HasMarried": false,
					"SpouseName": '',
					"SpouseIDCard": '',
					"EducationLevel": '',
					"HomeAddress": '',
					"PostCode": '',
					"Tel": '',
					"Email": '',
					"Mobile": '',
					"LinkMan": '',
					"LinkManTel": '',
					"Relationship": '',
					"Bank": '',
					"AccountNo": '',
					"AccountName": '',
					"AlipayAccNo": '',
					"MicromsgNo": '',
					"Password": '',
					"Remark": '',
					"DealerId": '',
					"State": 0,
					"Creator": '',
					"CreatorName": '',
					"CreateTime": '',
					"LastModifier": '',
					"LastModifierName": '',
					"LastModifyTime": '',
					"Auditor": '',
					"AuditorName": '',
					"AuditTime": '',
					"StateChanged": false,
					"TimeStamp": '',
					"IDCardNo_FrontImage": '',
					"IDCardNo_BackImage": '',
					"ChangeType": 0,
					"IdValues": [
						''
					],
					"iState": 0
				}
			}
		},
		onLoad(option) {
			for(let key in this.billObj) {
				if (key !== 'IdValues') {
					this.billObj[key] = option[key] !== 'null' ? option[key] : this.billObj[key];
				}
			}
		},
		methods: {
			bindDateChange(value) {
				console.log('bindDateChange: ', value);
				this.dateValue = value;
			},
			bindProtocal() {
				// 许可条款
				this.protocal = !this.protocal;
			},
			bindToProtocal(e) {
				// 查看许可条款
				util.goUrl({
					url: './protocal'
				});
			},
			saveOrder() {
				console.log(this.billObj);
				util.showLoading();
				util.ajax({
					method: 'Businese.BillJoinDAL.Create',
					params: {
						Bill: this.billObj
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.showToast({
						title: '创建成功',
						success() {
							setTimeout(() => {
								util.goUrl({
									url: '../user/entryOrder'
								});
							}, 1000);
						}
					});
				});
			}
		}
	}
</script>
