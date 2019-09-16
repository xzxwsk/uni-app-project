<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">经销商编号：</text>
				<input-box ref="dealerCode" v-model="billObj.DealerCode" placeholder="请输入经销商编号"></input-box>
			</view>
			<view class="input-row">
				<text class="title">经销商姓名：</text>
				<input-box ref="dealerName" v-model="billObj.DealerName" placeholder="请输入经销商姓名"></input-box>
			</view>
			<view class="input-row">
				<text class="title">注销原因：</text>
				<textarea v-model="billObj.Remark" style="padding: 10px 11px; height: 60px;" placeholder="请输入注销原因"/>
			</view>
		</view>
		<view class="result">
			<button class="btn" type="warn" @click="saveOrder">确认</button>
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
				billObj: {
					"RecordId": ""  /*单据Id*/,
				    "BillCode": ""  /*单据编号*/,
					"BillDate": ""  /*单据日期*/,
					"DealerId": ""  /*经销商Id*/,
					"DealerCode": ""  /*经销商编号*/,
					"DealerName": ""  /*经销商姓名*/,
					"Remark": ""  /*备注*/,
					"State": 1  /*State*/,
					"Creator": ""  /*录入人*/,
					"CreatorName": ""  /*录入人姓名*/,
					"CreateTime": ""  /*录入时间*/,
				    "LastModifier": ""  /*最后修改人*/,
					"LastModifierName": ""  /*最后修改人姓名*/,
					"LastModifyTime": ""  /*最后修改时间*/,
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
			this.$nextTick(() => {
				this.$refs.dealerCode.setValue(this.userInfo.DealerNo);
				this.$refs.dealerName.setValue(this.userInfo.DealerName);
			})
		},
		methods: {
			saveOrder() {
				// this.billObj.BillDate = this.billObj.CreateTime = this.billObj.LastModifyTime = util.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
				util.ajax({
					method: 'Businese.BillLeaveDAL.Create',
					params: {
						Bill: this.billObj
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.showToast({
						title: '创建注销单成功',
						success() {
							setTimeout(() => {
								util.goUrl({
									url: '../user/quitOrder'
								});
							}, 1000);
						}
					});
				})
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
