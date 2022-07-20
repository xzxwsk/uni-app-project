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
										<t-th style="flex: none; width: 1px;"></t-th>
										<t-th class="th" align="left">经销商编号</t-th>
										<t-th class="th" align="left">经销商姓名</t-th>
										<t-th class="th" align="left">资金类别</t-th>
										<t-th class="th" align="left">账户余额</t-th>
										<t-th class="th" align="left">操作</t-th>
									</t-tr>
								</t-table>
								<view style="display: flex; font-size: 28upx;" 
									v-for="(item,index) in tableList" :key="item.id"
									:data-dealerid="item.DealerId"
									:data-accounttype="item.AccountType"
									@click="goDetail"
								>
									<view style="flex: none; width: 10px;"></view>
									<view class="td">{{item.DealerNo}}</view>
									<view class="td">{{item.DealerName}}</view>
									<view class="td">{{ ['货款', '合规金', '积分'][item.AccountType] }}</view>
									<view class="td"><text class="a">{{item.AmountCanUse}}</text></view>
									<view class="td"><text class="a">查看明细</text></view>
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
				imgSrc: util.getImgUrl() + '/images/no_data_d.png',
				tableList: [],
				isScroll: false,
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				util.showLoading();
				util.ajax({
					method: 'Businese.QueryAppDAL.QueryMyAccount',
				})
				.then(res => {
					let data = res.data.result;
					this.tableList = data;
				})
				.finally(() => {
					util.hideLoading();
				})
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			goDetail(e) {
				const {dealerid, accounttype} = e.currentTarget.dataset
				util.goUrl({
					url: './myAccountDetail?id=' + dealerid + '&type=' + accounttype
				})
			},
		}
	}
</script>
<style scoped>
	.t-th, .t-td{padding: 3px;}
	.th{flex: none; width: 100px;}
	.td{flex: none; padding: 3px; width: 100px; word-break:break-all; word-wrap: break-word;}
</style>