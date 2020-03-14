<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">消费类别：</text>
				<radio-group class="uni-flex" name="gender" @change="changeConsumeType">
					<label><radio value="0" :checked="billObj.ConsumeType === 0" color="#f23030" />自用</label>
					<label><radio value="1" :checked="billObj.ConsumeType === 1" color="#f23030" />零售</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">日期：</text>
				<input-box ref="billDate" disabled v-model="billObj.BillDate" :inputValue="billObj.BillDate"></input-box>
			</view>
			<view class="input-row">
				<text class="title">商品名称：</text>
				<input-box ref="productName" v-model="billObj.ProductName" :inputValue="billObj.ProductName" placeholder="请输入商品名称"></input-box>
			</view>
			<view class="input-row">
				<text class="title">规格：</text>
				<input-box ref="spec" v-model="billObj.Spec" :inputValue="billObj.Spec" placeholder="请输入商品规格"></input-box>
			</view>
			<view class="input-row">
				<text class="title">计量单位：</text>
				<input-box ref="unitName" v-model="billObj.UnitName" :inputValue="billObj.UnitName" placeholder="请输入计量单位"></input-box>
			</view>
			<view class="input-row">
				<text class="title">数量：</text>
				<input-box ref="qty" v-model="billObj.Qty" :inputValue="billObj.Qty" placeholder="请输入数量"></input-box>
			</view>
			<view class="input-row">
				<text class="title">单价：</text>
				<input-box ref="qty" type="number" v-model="billObj.Price" :inputValue="billObj.Price" placeholder="请输入单价"></input-box>
			</view>
			<view class="input-row">
				<text class="title">金额：</text>
				<input-box ref="qty" type="number" disabled v-model="billObj.Amount" :inputValue="billObj.Amount"></input-box>
			</view>
			<view class="input-row">
				<text class="title">备注：</text>
				<textarea v-model="billObj.Remark" style="padding: 10px 11px; height: 60px;" placeholder="请输入备注信息"/>
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
		computed: mapState(['openid', 'userInfo', 'consumeSelected']),
		data() {
			return {
				edit: false,
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
		onLoad(option) {
			if (option.hasOwnProperty('id')) {
				let id = option.id;
				this.edit = true;
				this.init(id);
			} else {
				this.createDefault();
			}
		},
		methods: {
			createDefault() {
				util.showLoading();
				util.ajax({
					method: 'Businese.BillConsumeDAL.CreateDefault',
					params: {
						ProductIds: this.consumeSelected
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					res.data.result = util.jsonReplace(res.data.result, 'null', '""');
					this.billObj.BillDate = util.formatDate(this.billObj.BillDate, 'yyyy-MM-dd');
					this.billObj = res.data.result;
				});
			},
			init(id) {
				util.ajax({
					method: 'Businese.BillConsumeDAL.GetById',
					params: {
						RecordId: id
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					res.data.result = util.jsonReplace(res.data.result, 'null', '""');
					this.billObj = res.data.result;
					if(this.$refs.dealerCode) {
						this.$refs.dealerCode.setValue(this.billObj.DealerNo);
					}
					if(this.$refs.dealerName) {
						this.$refs.dealerName.setValue(this.billObj.DealerName);
					}
				});
			},
			changeConsumeType() {
				// 消费类别
				this.$set(this.billObj, 'ConsumeType', Number(e.detail.value));
			},
			saveOrder() {
				// this.billObj.BillDate = this.billObj.CreateTime = this.billObj.LastModifyTime = util.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
				util.showLoading();
				util.ajax({
					method: 'Businese.BillLeaveDAL.Create',
					params: {
						Bill: this.billObj
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
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
