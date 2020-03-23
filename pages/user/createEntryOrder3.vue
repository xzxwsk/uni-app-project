<template>
	<view class="create_pay_order">
		<view class="box">
			<view class="input-group">
				<view class="input-row">
					<text class="title"><text class="price">*</text>开户银行：</text>
					<input-box ref="bank" v-model="billObj.Bank" placeholder="开户银行"></input-box>
				</view>
				<view class="input-row">
					<text class="title"><text class="price">*</text>银行帐号：</text>
					<input-box ref="accountNo" v-model="billObj.AccountNo" placeholder="银行帐号"></input-box>
				</view>
				<view class="input-row">
					<text class="title"><text class="price">*</text>户名：</text>
					<input-box ref="accountName" v-model="billObj.AccountName" placeholder="户名"></input-box>
				</view>
				<view class="input-row">
					<text class="title">支付宝帐号：</text>
					<input-box ref="alipayAccNo" v-model="billObj.AlipayAccNo" placeholder="支付宝帐号"></input-box>
				</view>
				<view class="input-row">
					<text class="title">微信帐号：</text>
					<input-box ref="micromsgNo" v-model="billObj.MicromsgNo" placeholder="微信帐号"></input-box>
				</view>
				<view class="input-row">
					<text class="title">备注：</text>
					<input-box ref="remark" v-model="billObj.Remark" placeholder="备注信息"></input-box>
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
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox
		},
		computed: mapState(['billJoinDAL']),
		data() {
			return {
				protocal: false,
				billObj: {}
			}
		},
		onLoad(option) {
			this.billObj = this.billJoinDAL;
			console.log('3: ', this.billObj)
		},
		mounted() {
			this.$nextTick(() => {
				// 初始化显示值
				this.setInfo();				
			});
		},
		methods: {
			...mapMutations(['setBillJoinDAL']),
			setInfo() {
				this.$refs.bank.setValue(this.billObj.Bank);
				this.$refs.accountNo.setValue(this.billObj.AccountNo);
				this.$refs.accountName.setValue(this.billObj.AccountName);
				this.$refs.alipayAccNo.setValue(this.billObj.AlipayAccNo);
				this.$refs.micromsgNo.setValue(this.billObj.MicromsgNo);
				this.$refs.remark.setValue(this.billObj.Remark);
			},
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
				let arr = ['Sex', 'State', 'ChangeType', 'iState'];
				for(let key in this.billObj) {
					if (arr.indexOf(key) !== -1) {
						this.billObj[key] = Number(this.billObj[key]);
					} else if (key === 'HasMarried' || key === 'StateChanged') {
						this.billObj[key] = eval(this.billObj[key]);
					} else if (key === 'IdValues') {
						this.billObj[key] = this.billObj[key];
					} else if(util.getType(this.billObj[key]) === 'string'){
						this.billObj[key] = this.billObj[key].trim();
					} else {
						this.billObj[key] = this.billObj[key] || ''
					}
				}
				util.showLoading();
				let method = 'Businese.BillJoinDAL.Create';
				let title = '创建成功';
				if (this.billObj.RecordId !== '') {
					method = 'Businese.BillJoinDAL.Update';
					title = '修改成功';
				}
				if(this.billObj.BirthDay === '请选择日期') {
					this.billObj.BirthDay = '';
				}
				console.log('this.billObj: ', this.billObj);
				util.ajax({
					method: method,
					params: {
						Bill: this.billObj
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					this.setBillJoinDAL(null);
					util.showToast({
						title: title,
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
