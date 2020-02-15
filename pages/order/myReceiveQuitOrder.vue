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
							<!-- <input-box style="width: 200upx;" v-model="itemLs.searchKeyNo" placeholder="经销商编号"></input-box>
							<input-box style="width: 200upx;" v-model="itemLs.searchKeyName" placeholder="姓名"></input-box> -->
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
								<view class="txt"><text>亲，还没有相关注销单哦~</text></view>
							</view>
						</block>
						<scroll-view v-else="" class="box" scroll-y @scrolltolower="loadMore">
							<view>
								<view class="ls_item" v-for="(item, index) in itemLs.data" :key="index" @click="goDetail(index)">
									<view class="ls_item_top">
										<text class="title">
											<text class="gray">日期:</text>{{item.billDateStr}}
										</text>
										<view class="status">
											<text>{{item.stateStr}}</text>
										</view>
									</view>
									<view class="ls_item_top">
										<view class="title">
											<view><text class="gray">经销商编号:</text>{{item.DealerCode}}</view>
											<view><text class="gray">姓名:</text>{{item.DealerName}}</view>
											<view><text class="gray">注销原因:</text>{{item.Remark}}</view>
										</view>
									</view>
									<view class="ls_item_center">
										<text v-if="item.PayReturnItems.length > 0"><text class="gray">退款方式:</text>{{item.payTypeStr}}</text>
										<!-- <text class="count"><text class="gray">备注:</text>{{item.Remark}}</text> -->
									</view>
									<view class="ls_item_bottom" v-if="item.State === 0">
										<button class="btn" @click="bindApproval(item.RecordId)">退货款</button>
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
	const list = [{
		src: '/static/img/H_023_180@200.JPG',
		title: '水星MW150UH光驱版无线网卡接收器台式机笔记本电脑发射随身wifi',
		status: '申请',
		count: 1,
		price: 16.28
	},{
		src: '/static/img/H_023_180@200.JPG',
		title: '水星MW150UH光驱版无线网卡接收器台式机笔记本电脑发射随身wifi',
		status: '已退货款',
		count: 1,
		price: 16.28
	},{
		src: '/static/img/H_023_180@200.JPG',
		title: '水星MW150UH光驱版无线网卡接收器台式机笔记本电脑发射随身wifi',
		status: '已审核',
		count: 1,
		price: 16.28
	},{
		src: '/static/img/H_023_180@200.JPG',
		title: '水星MW150UH光驱版无线网卡接收器台式机笔记本电脑发射随身wifi',
		status: '已确认收款',
		count: 1,
		price: 16.28
	}];
	export default {
		components: {
			inputBox, customDatePicker
		},
		data() {
			return {
				imgSrc: '/static/images/no_data_d.png',
				mode: 'widthFix',
				scrollLeft: 0,
				tabIndex: 0,
				dataArr: [],
				displayDataArr: [],
				tabBars: [{
					name: '全部',
					id: 'all'
				}, {
					name: '申请',
					id: 'guanzhu'
				}, {
					name: '已退货款',
					id: 'guanzhu1'
				}, {
					name: '已退保证金',
					id: 'guanzhu2'
				}, {
					name: '已确认收款',
					id: 'tiyu'
				}, {
					name: '退货款中',
					id: 'guanzhu3'
				}],
				startDate: '2010-01-01',
				endDate: '2199-12-31',
				stateArr: [null, 0, 1, 2, 3, 4, -1]
			}
		},
		onLoad() {
			// this.dataArr = this.randomfn();
			// this.displayDataArr = util.deepCopy(this.dataArr);
			this.init();
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
				this.getData(this.stateArr[0]);
			},
			getData(state) {
				let index = this.tabIndex;
				if(this.$refs['startDate' + index]) {
					this.dataArr[index].startDateValue = this.$refs['startDate' + index][0].getValue();
				}
				if(this.$refs['endDate' + index]) {
					this.dataArr[index].endDateValue = this.$refs['endDate' + index][0].getValue();
				}
				util.showLoading();
				util.ajax({
					method: 'Businese.BillLeaveDAL.QueryReceivedList',
					params: {
						Filter: {
							StartDate: this.dataArr[index].startDateValue,
							EndDate: this.dataArr[index].endDateValue,
							BillNoLike: '',
							State: state,
							PageIndex: 1,
							PageSize: 20,
							SortFields: ''
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
							dataItem.stateStr = ['已取消', '申请', '已退货款', '已退保证金', '已收款确认', '退货款中'][dataItem.State + 1];
							if(dataItem.PayReturnItems.length > 0) {
								dataItem.payTypeStr = ['现金', '银行转账', '支付宝', '微信'][dataItem.PayReturnItems[0].PayType];
							}
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
			bindApproval(id){
				// 核准				
				util.goUrl({
					url: './approval?id=' + id
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
						searchKeyNo: '',
						searchKeyName: '',
						dateValue: '',
						data: [],
						isScroll: false,
						loadingText: '加载更多...',
						renderImage: false
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
