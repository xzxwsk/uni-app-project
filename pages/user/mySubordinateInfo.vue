<template>
	<view class="my_subordinate_info">
		<view class="uni-tab-bar">
			<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view class="tab_head">
					<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" :class="tabIndex==index ? 'active' : ''"
					 :id="tab.id" :data-current="index" @click="tapTab">{{tab.name}}</view>
				 </view>
			</scroll-view>
			<swiper :current="tabIndex" class="swiper-box" :duration="300" @change="changeTab">
				<swiper-item>
					<view class="search_box">
						<input-box type="text" style="flex: 1;" clearable focus v-model="searchKey" placeholder="请输入分销商编号或姓名"></input-box>
						<button class="btn" type="warn" @click="query">查询</button>
					</view>
					<view class="con" v-if="tableList.length < 1">
						<view class="no-data">
							<view class="no-img">
								<image style="width: 100%;" mode="widthFix" :src="imgSrc" @error="imageError"></image>
							</view>
							<view class="txt"><text>亲，还没有相关下属哦~</text></view>
						</view>
					</view>
					<block v-else>
						<scroll-view class="list" scroll-y @scrolltolower="loadMore">
							<view class="box">
								<t-table border="0">
									<t-tr font-size="14" color="#000" align="left">
										<t-th style="flex: none; width: 1px;"></t-th>
										<t-th class="th" align="left">编号</t-th>
										<t-th class="th" style="width: 120upx;" align="left">姓名</t-th>
										<t-th class="th" align="left">资金类别</t-th>
										<t-th class="th" style="width: 120upx;" align="left">余额</t-th>
										<t-th style="flex: none;" align="left">操作</t-th>
									</t-tr>
								</t-table>
								<view style="display: flex; font-size: 28upx;" v-for="(item,index) in tableList" :key="item.id"
									:data-subdealerid="item.SubDealerId"
									:data-accounttype="item.AccountType"
									@click="goDetail"
								>
									<view style="flex: none; width: 10px;"></view>
									<view class="td">{{item.SubDealerNo}}</view>
									<view class="td" style="width: 120upx;">{{item.SubDealerName}}</view>
									<view class="td">{{ ['货款', '合规金', '积分'][item.AccountType] }}</view>
									<view class="td" style="width: 120upx;">{{item.Amount}}</view>
									<view class="td"><text class="a">查看明细</text></view>
								</view>
							</view>
							<view v-if="isScroll" class="uni-tab-bar-loading">
								加载更多...
							</view>
						</scroll-view>
					</block>
				</swiper-item>
				<swiper-item>
					<view class="search_box">
						<input-box type="text" clearable focus v-model="searchKey2" placeholder="请输入分销商编号或姓名"></input-box>
						<view class="date_picker_box">
							<customDatePicker class="date_picker"
								fields="month"
								:start="startDate"
								:end="endDate"
								:value="dateValue"
								@change="bindDateChange"
							></customDatePicker>
						</view>
						<button class="btn" type="warn" @click="query2">查询</button>
					</view>
					<view class="con" v-if="tableList2.length < 1">
						<view class="no-data">
							<view class="no-img">
								<image style="width: 100%;" mode="widthFix" :src="imgSrc" @error="imageError"></image>
							</view>
							<view class="txt"><text>亲，还没有相关下属奖金哦~</text></view>
						</view>
					</view>
					<block v-else>
						<scroll-view class="list" scroll-y @scrolltolower="loadMore2">
							<view class="box">
								<t-table border="0">
									<t-tr font-size="14" color="#000" align="left">
										<t-th align="left"><text class="first_col">年月</text></t-th>
										<t-th align="left">编号</t-th>
										<t-th align="left">姓名</t-th>
										<t-th align="left">奖金类别</t-th>
										<t-th align="left">奖金</t-th>
										<!-- <t-th align="left">操作</t-th> -->
									</t-tr>
									<!-- <t-tr font-size="12" color="#5d6f61" align="right" v-for="item in tableList2" :key="item.id">
										<t-td align="left"><text class="first_col">{{item.Year + '-' + item.Month}}</text></t-td>
										
										<t-td align="left">{{item.SubDealerNo}}</t-td>
										<t-td align="left">{{item.SubDealerName}}</t-td>
										<t-td align="left">{{ ['直推', '团队'][item.BonusType] }}</t-td>
										<t-td align="left">{{item.Bonus}}</t-td>
									</t-tr> -->
								</t-table>
								<view style="display: flex; font-size: 28upx;" v-for="(item,index) in tableList2" :key="item.id">
									<view style="flex: 1; word-break:break-all; word-wrap: break-word;"><text class="first_col">{{item.Year + '-' + item.Month}}</text></view>
									<view style="flex: 1; word-break:break-all; word-wrap: break-word;">{{item.SubDealerNo}}</view>
									<view style="flex: 1; word-break:break-all; word-wrap: break-word;">{{item.SubDealerName}}</view>
									<view style="flex: 1; word-break:break-all; word-wrap: break-word;">{{ ['直推', '团队'][item.BonusType] }}</view>
									<view style="flex: 1; word-break:break-all; word-wrap: break-word;">{{item.Bonus}}</view>
								</view>
							</view>
							<view v-if="isScroll2" class="uni-tab-bar-loading">
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
	
	const tableList = [{
	                    id: 0,
	                    name: '001',
	                    age: '张大大',
	                    hobby: '直推'
	                },
	                {
	                    id: 1,
	                    name: '002',
	                    age: '李明明',
	                    hobby: '团队'
	                },
	                {
	                    id: 2,
	                    name: '003',
	                    age: '李东',
	                    hobby: '团队'
	                }
	            ]
		tableList.forEach(function(item, index){
			item.id = index
		});
	
	export default {
		components: {
		    inputBox, tTable, tTh, tTr, tTd, customDatePicker
		},
		computed: mapState(['openid', 'userInfo']),
		data() {
			return {
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				tabBars: [{
					name: '下属账户余额',
					id: 'accountBalance'
				}, {
					name: '下属奖金查询',
					id: 'bonusQuery'
				}],
				imgSrc: util.getImgUrl() + '/static/images/no_data_d.png',
				tableList: [],
				tableList2: [],
				isScroll: false,
				// 货款查询
				searchKey: '',
				// 奖金查询
				searchKey2: '',
				dateValue: '',
				startDate: '2010-01',
				endDate: '2199-12',
				isScroll2: false
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				util.showLoading();
				util.ajax({
					method: 'Businese.QueryAppDAL.QuerySubAccount',
					params: {
						DealerLike: this.searchKey
					},
					tags: {
						usertoken: this.openid
					}
				})
				.then(res => {
					util.hideLoading();
					let data = res.data.result;
					this.tableList = data;
				});
			},
			getList2() {
				let dateValue = this.dateValue.split('-');
				util.showLoading();
				util.ajax({
					method: 'Businese.QueryAppDAL.QuerySubBonus',
					params: {
						Year: Number(dateValue[0]),
						Month: Number(dateValue[1]),
						DealerLike: this.searchKey2
					},
					tags: {
						usertoken: this.openid
					}
				})
				.then(res => {
					util.hideLoading();
					let data = res.data.result;
					console.log('下属的奖金: ', data);
					this.tableList2 = data;
				});
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			async tapTab(e) { //点击tab-bar
				let tabIndex = e.target.dataset.current;
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = tabIndex;
				}
			},
			async changeTab(e) {
				if(!e.target.hasOwnProperty('current')) {
					return;
				}
				let index = e.target.current;
			    this.tabIndex = index;
				if (this.isClickChange) {
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
			
				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].id);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].id),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			paymentGoodsDetail(id) {
				console.log(id);
				// 货款的收支明细
				util.goUrl({
					url: './paymentGoodsDetail'
				})
			},
			loadMore(e) {
				this.isScroll = true;
			},
			bindDateChange(value) {
				console.log('bindDateChange: ', value);
				this.dateValue = value;
				this.getList2();
			},
			loadMore2(e) {
				this.isScroll2 = true;
			},
			query() {
				this.init();
			},
			query2() {
				this.getList2();
			},
			goDetail(e) {
				const {subdealerid, accounttype} = e.currentTarget.dataset
				util.goUrl({
					url: './mySubordinateDetail?id=' + subdealerid + '&type=' + accounttype
				})
			},
		}
	}
</script>
<style scoped>
	.t-th, .t-td{padding: 3px;}
	.th{flex: none; width: 150upx;}
	.td{flex: none; padding: 3px; width: 150upx; word-break:break-all; word-wrap: break-word;}
</style>