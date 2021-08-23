<template>
	<view class="my_subordinate_info">
		<view class="uni-tab-bar">
			<swiper class="swiper-box" :duration="300">
				<swiper-item>
					<view class="con" v-if="tableList.length < 1">
						<view class="no-data">
							<view class="no-img">
								<image style="width: 100%;" mode="widthFix" :src="imgSrc" @error="imageError"></image>
							</view>
							<view class="txt"><text>亲，还没有相关信息哦~</text></view>
						</view>
					</view>
					<block v-else>
						<scroll-view class="list" scroll-x>
							<view class="box">
								<t-table border="0">
									<t-tr font-size="14" color="#000" align="left">
										<t-th style="flex: none; width: 5px;"></t-th>
										<t-th class="th" align="left">时间</t-th>
										<t-th class="th" align="left">摘要</t-th>
										<t-th class="th" align="left">收支金额</t-th>
										<t-th class="th" align="left">预留金额</t-th>
										<t-th class="th" align="left">单据类别</t-th>
										<t-th class="th" align="left">单据编号</t-th>
									</t-tr>
								</t-table>
								<view style="display: flex; font-size: 28upx;" 
									v-for="(item,index) in tableList" :key="item.id"
								>
									<view style="flex: none; width: 10px;"></view>
									<view class="td">{{item.LogTimeStr}}</view>
									<view class="td">{{item.Remark}}</view>
									<view class="td">{{item.AMOUNT}}</view>
									<view class="td">{{item.RESERVEDAMOUNT}}</view>
									<view class="td">{{item.ShowBillType}}</view>
									<view class="td">{{item.BILLCode}}</view>
								</view>
							</view>
							<view v-if="isScroll" class="uni-tab-bar-loading">
								加载更多...
							</view>
						</scroll-view>
					</block>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	// http://ext.dcloud.net.cn/plugin?id=413
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	// https://ext.dcloud.net.cn/plugin?id=220
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
	import {mapState, mapMutations} from 'vuex';
	
	export default {
		components: {
		    inputBox, tTable, tTh, tTr, tTd, customDatePicker
		},
		computed: mapState(['openid', 'userInfo']),
		data() {
			return {
				imgSrc: util.getImgUrl() + '/static/images/no_data_d.png',
				tableList: [],
				isScroll: false,
			}
		},
		onLoad(option) {
			this.init(option.id, option.type);
		},
		methods: {
			init(id, type) {
				util.showLoading();
				util.ajax({
					method: 'Businese.QueryAppDAL.QuerySubAccountDetail',
					params: {
						DealerId: id,
						AcccountType: type
					}
				})
				.then(res => {
					let data = res.data.result;
					data.forEach(item => {
						item.LogTimeStr = util.formatDate(item.LogTime, 'yyyy-MM-dd hh:mm:ss')
					})
					this.tableList = data;
				})
				.finally(() => {
					util.hideLoading();
				})
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
		}
	}
</script>
<style scoped>
	.t-th, .t-td{padding: 3px;}
	.th{flex: none; width: 100px;}
	.td{flex: none; padding: 3px; width: 100px; word-break:break-all; word-wrap: break-word;}
</style>