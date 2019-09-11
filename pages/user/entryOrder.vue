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
										<view class="title">
											<view><text class="gray">日期:</text>{{item.billDateStr}}</view>
											<view><text class="gray">姓名:</text>{{item.DealerName}}</view>
											<view><text class="gray">保证金:</text><text class="price">￥{{item.price}}</text></view>
											<view><text class="gray">经销商编号:</text>{{item.DealerNo}}</view>
											<view><text class="gray">经销商姓名:</text>{{item.DealerName}}</view>
										</view>
										<view class="status">
											<text>{{item.status}}</text>
										</view>
									</view>
									<view class="ls_item_bottom">
										<button class="btn" @click.stop="del(index)" v-if="item.State !== 1">删除</button><button class="btn" @click.stop="edit(index)" v-if="item.State !== 1">修改</button><button class="btn" @click.stop="goDetail(index)">详情</button>
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
	import noImg from '@/static/images/no_data_d.png';
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	const list = [{
		src: '/static/img/H_023_180@200.JPG',
		title: '水星MW150UH光驱版无线网卡接收器台式机笔记本电脑发射随身wifi',
		status: '申请',
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
		status: '已审核',
		count: 1,
		price: 16.28
	}];
	export default {
		components: {
			inputBox, customDatePicker
		},
		computed: mapState(['hasLogin', 'openid']),
		data() {
			return {
				imgSrc: noImg,
				mode: 'widthFix',
				scrollLeft: 0,
				tabIndex: 0,
				allData: [], // 保存全部
				dataArr: [],
				displayDataArr: [],
				tabBars: [{
					name: '全部',
					id: 'all'
				}, {
					name: '申请',
					id: 'guanzhu'
				}, {
					name: '已审核',
					id: 'tuijian'
				}],
				startDate: '2010-01',
				endDate: '2199-12'
			}
		},
		onLoad() {
			this.init();
		},		
		onNavigationBarButtonTap(e) {
			util.goUrl({
				url: './createEntryOrder'
			})
		},
		methods: {
			init() {
				this.getAllData([0, 1, 2]);
			},
			async getAllData(arr) {
				// 获取全部状态的数据
				var promiseArray = [];
				arr.forEach(item => {
					promiseArray.push(util.ajax({
						method: 'Businese.BillJoinDAL.QueryMyList',
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
						this.dataArr[index+1].data = item.data.result.data;
					});
				});
				let _arr = [];
				this.dataArr.forEach(item => {
					item.data.forEach(dataItem => {
						dataItem.billDateStr = util.formatDate(dataItem.BillDate, 'yyyy-MM-dd');
						_arr = _arr.concat(dataItem);
					});
				});
				this.dataArr[0].data = _arr;
				this.displayDataArr = util.deepCopy(this.dataArr);
			},
			del(index) {
				util.ajax({
					method: 'Businese.BillJoinDAL.Delete',
					params: {
						RecordId: this.displayDataArr[this.tabIndex].data[index].RecordId
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					this.getAllData([0, 1, 2]);
				})
			},
			edit(index) {
				util.goUrl({
					url: './createEntryOrder?id=' + this.displayDataArr[this.tabIndex].data[index].RecordId
				});
			},
			goDetail(index) {
				util.goUrl({
					url: './entryOrderDetail?id=' + this.displayDataArr[this.tabIndex].data[index].RecordId
				});
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
				console.log('bindDateChange: ', value);
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
