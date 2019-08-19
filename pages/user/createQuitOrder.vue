<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">经销商编号：</text>
				<input-box placeholder="请输入经销商编号"></input-box>
			</view>
			<view class="input-row">
				<text class="title">经销商姓名：</text>
				<input-box placeholder="请输入经销商姓名"></input-box>
			</view>
			<view class="input-row">
				<text class="title">注销原因：</text>
				<textarea v-model="reason" style="padding: 10px 11px; height: 60px;" placeholder="请输入注销原因"/>
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
	export default {
		components: {
			inputBox
		},
		data() {
			return {
				reason: ''
			}
		},
		onLoad() {
			
		},
		methods: {
			saveOrder() {
				console.log(this.moneyNature, this.moneyType);
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
