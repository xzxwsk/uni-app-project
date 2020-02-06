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
							<input-box v-model="itemLs.searchKey" placeholder="请输入搜索关键字"></input-box>
							<customDatePicker class="date_picker"
								fields="month"
								:start="startDate"
								:end="endDate"
								:value="itemLs.dateValue"
								@change="bindDateChange"
							></customDatePicker>
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
											<text class="gray">日期:</text>{{item.billDateStr}}}<br/>
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
									<view class="ls_item_bottom" v-show="tabIndex === 1">
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
				startDate: '2010-01',
				endDate: '2199-12'
			}
		},
		onLoad() {
			this.getCanRecordPayBill();
			this.getAllData([0, -1, 2]);
			// this.dataArr = this.randomfn();
			// this.displayDataArr = util.deepCopy(this.dataArr);
		},
		onNavigationBarButtonTap(e) {
			if (this.canRecordPayBill) {
				util.goUrl({
					url: './createPayOrder'
				})
			}
		},
		methods: {
			getCanRecordPayBill() {
				util.showLoading();
				util.ajax({
					method: 'Businese.BillPayDAL.CanRecordPayBill',
					params: {},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
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
			async getAllData(arr) {
				// 获取全部状态的数据
				var promiseArray = [];
				arr.forEach(item => {
					promiseArray.push(util.ajax({
						method: 'Businese.BillPayDAL.QueryMyList',
						params: {
							Filter: {
								StartDate: '',
								EndDate: '',
								BillNoLike: '',
								State: item,
								PageIndex: 1,
								PageSize: 20
							}
						},
						tags: {
							usertoken: this.openid
						}
					}));
				});
				await Promise.all(promiseArray)
				.then(values => {
					this.dataArr = [{
						isLoading: false,
						searchKey: '',
						dateValue: '',
						data: [],
						isScroll: false,
						loadingText: '加载更多...',
						renderImage: false
					}];
					values.forEach((item, index) => {
						this.dataArr.push({
							isLoading: false,
							searchKey: '',
							dateValue: '',
							data: [],
							isScroll: false,
							loadingText: '加载更多...',
							renderImage: false
						});
						if (item.data.hasOwnProperty('result')) {
							this.dataArr[index+1].data = item.data.result.data;
						}
					});
				});
				let _arr = [];
				this.dataArr.forEach(item => {
					item.data.forEach(dataItem => {
						dataItem.billDateStr = util.formatDate(dataItem.BillDate, 'yyyy-MM-dd');
						dataItem.accountTypeStr = ['货款', '保证金', '代交保证金'][dataItem.AccountType];
						dataItem.stateStr = ['已取消', '未收款', '', '已收款'][dataItem.State+1];
						dataItem.payTypeStr = ['现金', '银行转账', '支付宝', '微信'][dataItem.PayType];
						_arr = _arr.concat(dataItem);
					});
				});
				this.dataArr[0].data = _arr;
				this.displayDataArr = util.deepCopy(this.dataArr);
			},
			goDetail(index) {
				console.log(index);
			},
			query() {
				let searchKey = this.displayDataArr[this.tabIndex].searchKey;
				let tempArr = [];
				console.log(this.displayDataArr[this.tabIndex].searchKey, this.displayDataArr[this.tabIndex].dateValue);
				this.displayDataArr[this.tabIndex].data = [];
				this.dataArr[this.tabIndex].data.forEach(item => {
					if(item.title.indexOf(searchKey) != -1){
						tempArr.push(item);
					}
				});
				this.displayDataArr[this.tabIndex].data = tempArr;
			},
			loadMore(e) {
				this.displayDataArr[this.tabIndex].isScroll = true;
			},
			bindDateChange(value) {
				this.displayDataArr[this.tabIndex].dateValue = value;
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
				let index;
				if (!e.target.hasOwnProperty('current')) {
					return;
				}
				index = e.target.current;
                this.tabIndex = index;
				if (!this.displayDataArr[index].isLoading) {
					this.addData(index)
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
			},
			async tapTab(e) { //点击tab-bar
				let tabIndex = e.target.dataset.current;
				if (!this.displayDataArr[tabIndex].isLoading) {
					this.addData(tabIndex)
				}
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
