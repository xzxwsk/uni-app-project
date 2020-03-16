<template>
	<view class="create_pay_order">
		<view :class="['input-group', {'last': index === arr.length-1}]" v-for="(billObj, index) in arr" :key="index">
			<view class="input-row">
				<text class="title">消费类别：</text>
				<radio-group class="uni-flex" name="gender" @change="changeConsumeType(index)">
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
				<input-box type="number" v-model="billObj.Price" :inputValue="billObj.Price" placeholder="请输入单价"></input-box>
			</view>
			<view class="input-row">
				<text class="title">金额：</text>
				<input-box type="number" disabled v-model="billObj.Amount" :inputValue="billObj.Amount"></input-box>
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
		computed: {
			...mapState(['openid', 'userInfo', 'consumeSelected']),
			consumeSelectedId() {
				return this.consumeSelected.map(item => item.ProductId);
			}
		},
		data() {
			return {
				arr: []
			}
		},
		onLoad(option) {
			this.createDefault();
		},
		methods: {
			createDefault() {
				util.showLoading();
				util.ajax({
					method: 'Businese.BillConsumeDAL.CreateDefault',
					params: {
						ProductIds: this.consumeSelectedId
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					res.data.result = util.jsonReplace(res.data.result, 'null', '""');
					res.data.result.forEach(item => {
						item.BillDate = util.formatDate(item.BillDate, 'yyyy-MM-dd');
					});
					
					this.arr = res.data.result;
				});
			},
			changeConsumeType(index) {
				// 消费类别
				this.$set(this.arr[index], 'ConsumeType', Number(e.detail.value));
			},
			saveOrder() {
				util.showLoading();
				// 批量创建
				util.ajax({
					method: 'Businese.BillConsumeDAL.Create',
					params: {
						Bills: this.arr
					},
					tags: {
						usertoken: this.openid
					},
				})
				.then(res => {
					util.hideLoading();
					util.showToast({
						title: '创建消费/零售记录成功',
						success() {
							setTimeout(() => {
								util.goTab({
									url: '../tabBar/user'
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
