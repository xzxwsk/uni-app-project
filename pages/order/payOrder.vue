<template>
	<view class="pay_order">			
		<view class="uni-tab-bar">
			<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view class="tab_head">
					<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" :class="tabIndex==index ? 'active' : ''"
					 :id="tab.id" :data-current="index" @click="tapTab">{{tab.name}}</view>
				 </view>
			</scroll-view>
			<swiper :current="tabIndex" class="swiper-box" :duration="300" @change="changeTab">
				<swiper-item v-for="(itemLs, indexLs) in displayDataArr" :key="indexLs">
					<view class="list">
						<view class="search_box">
							<!-- <input-box v-model="itemLs.searchKey" placeholder="请输入搜索关键字"></input-box> -->
							<view class="date_picker_box">
								<customDatePicker class="date_picker" :ref="'startDate' + indexLs"
									fields="day"
									:start="startDate"
									:end="endDate"
									:value="itemLs.startDateValue"
									@change="bindStartDateChange"
								></customDatePicker>
							</view>
							<view class="date_picker_box">
								<customDatePicker class="date_picker" :ref="'endDate' + indexLs"
									fields="day"
									:start="startDate"
									:end="endDate"
									:value="itemLs.endDateValue"
									@change="bindEndDateChange"
								></customDatePicker>
							</view>
							<button class="btn" type="warn" @click="query">查询</button>
						</view>
						<block v-if="itemLs.data.length<1">
							<view class="no-data">
								<view class="no-img cart">
									<image style="width: 100%;" :mode="mode" :src="imgSrc" @error="imageError"></image>
								</view>
								<view class="txt"><text>亲，还没有相关付款单哦~</text></view>
							</view>
						</block>
						<scroll-view v-else="" class="box" scroll-y @scrolltolower="loadMore">
							<view>
								<view class="ls_item" v-for="(item, index) in itemLs.data" :key="index" @click="goDetail(index)">
									<view class="ls_item_top">
										<text class="title">
											<text class="gray">日期:</text>{{item.billDateStr}}<br/>
											<text class="gray">款项性质:</text>{{item.accountTypeStr}}</text>
										<view class="status">
											<text>{{item.stateStr}}</text>
											<text class="price">￥{{item.Amount}}</text>
										</view>
									</view>
									<view class="ls_item_center">
										<text class="count"><text class="gray">自己帐户:</text>{{item.PayAccountNo}}</text>
										<text class="count"><text class="gray">对方帐户:</text>{{item.ReceiveAccountInfo}}</text>
									</view>
									<view class="ls_item_center">
										<text><text class="gray">付款方式:</text>{{item.payTypeStr}}</text>
										<text class="count"><text class="gray">备注:</text>{{item.Remark}}</text>
									</view>
									<view class="ls_item_bottom" v-show="item.State === 0" @click="bindCancelOrder(item.RecordId)">
										<button class="btn">取消</button>
									</view>
								</view>
							</view>
							<view v-if="itemLs.isScroll" class="uni-tab-bar-loading">
								{{itemLs.loadingText}}
							</view>
						</scroll-view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	// https://ext.dcloud.net.cn/plugin?id=220
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox, customDatePicker
		},
		computed: mapState(['openid']),
		data() {
			return {
				imgSrc: '/static/images/no_data_d.png',
				mode: 'widthFix',
				isLoaded: false,
				canRecordPayBill: false,
				scrollLeft: 0,
				tabIndex: 0,
				dataArr: [],
				displayDataArr: [],
				tabBars: [{
					name: '全部',
					id: 'all'
				}, {
					name: '未收款',
					id: 'guanzhu'
				}, {
					name: '已收款',
					id: 'tuijian'
				}, {
					name: '取消',
					id: 'tiyu'
				}],
				startDate: '2010-01-01',
				endDate: '2199-12-31',
				stateArr: [null, 0, 2, -1]
			}
		},
		onLoad() {
			if (!this.isLoaded) {
				this.init();
				setTimeout(() => {
					this.isLoaded = true;
				}, 1000);
			}
			// this.dataArr = this.randomfn();
			// this.displayDataArr = util.deepCopy(this.dataArr);
		},
		onShow() {
			if (this.isLoaded) {
				this.init();
			}
		},
		onNavigationBarButtonTap(e) {
			if (this.canRecordPayBill) {
				util.goUrl({
					url: './createPayOrder'
				})
			}
		},
		methods: {
			init() {
				let day = util.formatDate(new Date(), 'yyyy-MM-dd');
				let dayArr = day.split('-');
				this.stateArr.forEach(item => {
					this.dataArr.push({
						isLoading: false,
						searchKey: '',
						startDateValue: dayArr[0] + '-' + dayArr[1] + '-' + '01',
						endDateValue: day,
						data: [],
						isScroll: false,
						loadingText: '加载更多...',
						renderImage: false
					});
				});
				this.displayDataArr = util.deepCopy(this.dataArr);
				util.showLoading();
				this.getCanRecordPayBill();
				this.getData(this.stateArr[0]);
			},
			async getCanRecordPayBill() {
				await util.ajax({
					method: 'Businese.BillPayDAL.CanRecordPayBill',
					params: {},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					this.canRecordPayBill = res.data.result;
					// #ifdef APP-PLUS
					console.log(res.data.result);
					let webView = this.$mp.page.$getAppWebview();
					let text = '新增';
					if (!res.data.result) {
						text = ''
						webView.setTitleNViewButtonStyle(0, {
							text: text
						});
					}
					// #endif
				});
			},
			getData(state) {
				let index = this.tabIndex;
				if(this.$refs['startDate' + index]) {
					this.dataArr[index].startDateValue = this.$refs['startDate' + index][0].getValue();
				}
				if(this.$refs['endDate' + index]) {
					this.dataArr[index].endDateValue = this.$refs['endDate' + index][0].getValue();
				}
				util.ajax({
					method: 'Businese.BillPayDAL.QueryMyList',
					params: {
						Filter: {
							StartDate: this.dataArr[index].startDateValue,
							EndDate: this.dataArr[index].endDateValue,
							BillNoLike: '',
							State: state,
							PageIndex: 1,
							PageSize: 20
						}
					},
					tags: {
						usertoken: this.openid
					}
				})
				.then(res => {
					util.hideLoading();
					if (res.data.hasOwnProperty('result')) {
						res.data.result.data.forEach(dataItem => {
							dataItem.billDateStr = util.formatDate(dataItem.BillDate, 'yyyy-MM-dd');
							dataItem.accountTypeStr = ['货款', '保证金', '代交保证金'][dataItem.AccountType];
							dataItem.stateStr = ['已取消', '未收款', '', '已收款'][dataItem.State+1];
							dataItem.payTypeStr = ['现金', '银行转账', '支付宝', '微信'][dataItem.PayType];
						});
						this.dataArr[index].data = res.data.result.data;
						this.displayDataArr[index].data = res.data.result.data;
					}
				});
			},
			goDetail(index) {
				console.log(index);
			},
			query() {
				util.showLoading();
				this.getData(this.stateArr[this.tabIndex]);
			},
			loadMore(e) {
				// this.displayDataArr[this.tabIndex].isScroll = true;
			},
			bindStartDateChange(value) {
				this.displayDataArr.forEach(item => {
					item.startDateValue = value;
				})
			},
			bindEndDateChange(value) {
				this.displayDataArr.forEach(item => {
					item.endDateValue = value;
				})
			},
			bindCancelOrder(RecordId) {
				let me = this;
				util.dialog({
					content: '确定要取消付款吗？',
					success (e) {
						if(e.confirm) {
							util.showLoading();
							util.ajax({
								method: 'Businese.BillPayDAL.Cancel',
								params: {
									RecordId: RecordId
								},
								tags: {
									usertoken: me.openid
								}
							})
							.then(res => {
								util.hideLoading();
								util.showToast({
									title: '取消付款成功',
									success() {
										me.query();
									}
								});
							})
						}
					}
				});
			},
			addData(e) {
				this.displayDataArr[e].isLoading = true;
				this.displayDataArr[e].loadingText = '没有更多了';
				if(this.displayDataArr[e].dateValue === ''){
					this.displayDataArr[e].dateValue = this.displayDataArr[0].dateValue;
				}
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
			async changeTab(e) {
				console.log('changeTab');
				let index;
				if (!e.target.hasOwnProperty('current')) {
					return;
				}
				index = e.target.current;
                this.tabIndex = index;
				// if (!this.displayDataArr[index].isLoading) {
				// 	this.addData(index)
				// }
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
				this.query();
			},
			async tapTab(e) { //点击tab-bar
				console.log('tapTab');
				let tabIndex = e.target.dataset.current;
				// if (!this.displayDataArr[tabIndex].isLoading) {
				// 	this.addData(tabIndex)
				// }
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.tabIndex = tabIndex;
				}
			},
			randomfn() {
				let ary = [];
				for (let i = 0, length = this.tabBars.length; i < length; i++) {
					let aryItem = {
						isLoading: false,
						searchKey: '',
						dateValue: '',
						data: [],
						isScroll: false,
						loadingText: '加载更多...'
					};
					if (i < 1) {
						aryItem.isLoading = true;
						aryItem.loadingText = '没有更多了';
						aryItem.data = list;
					} else {
						aryItem.data = list.filter(item => {
							return item.status === this.tabBars[i].name;
						});
					}
					ary.push(aryItem);
				}
				return ary;
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
