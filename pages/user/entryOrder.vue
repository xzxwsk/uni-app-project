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
				<swiper-item v-for="(itemLs, indexLs) in dataArr" :key="indexLs">
					<view class="list">
						<view class="search_box">
							<customDatePicker
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
											<view><text class="gray">日期:</text>2012-12-05</view>
											<view><text class="gray">姓名:</text>大</view>
											<view><text class="gray">保证金:</text><text class="price">￥{{item.price}}</text></view>
											<view><text class="gray">经销商编号:</text>df348209834</view>
											<view><text class="gray">经销商姓名:</text>顾大有</view>
										</view>
										<view class="status">
											<text>{{item.status}}</text>
										</view>
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
		status: '已审核',
		count: 1,
		price: 16.28
	},{
		src: '/static/img/H_023_180@200.JPG',
		title: '水星MW150UH光驱版无线网卡接收器台式机笔记本电脑发射随身wifi',
		status: '取消',
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
				renderImage: false,
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
				isScroll: false,
				loadingText: '加载更多...',
				dateValue: '',
				searchKey: '',
				startDate: '2010-01',
				endDate: '2199-12',
				ls: list
			}
		},
		onLoad() {
			this.dataArr = this.randomfn();
			setTimeout(()=> {
			    this.dataArr[0].renderImage = true;
			}, 300);
		},		
		onNavigationBarButtonTap(e) {
			util.goUrl({
				url: './createEntryOrder'
			})
		},
		methods: {
			goDetail(index) {
				// 查看订单详情
				console.log(index);
				util.goUrl({
					url: './orderDetail'
				});
			},
			query() {
				console.log(this.dataArr[this.tabIndex].searchKey, this.dataArr[this.tabIndex].dateValue);
			},
			loadMore(e) {
				this.dataArr[this.tabIndex].isScroll = true;
			},
			bindDateChange(value) {
				console.log('bindDateChange: ', value);
				this.dataArr[this.tabIndex].dateValue = value;
			},
			addData(e) {
				this.dataArr[e].isLoading = true;
				this.dataArr[e].data = list.slice(0, util.random(4));
				setTimeout(()=> {
				    this.dataArr[e].renderImage = true;
				}, 300);
				// if (this.dataArr[e].data.length > 30) {
				// 	this.dataArr[e].loadingText = '没有更多了';
				// 	return;
				// }
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
				if (!this.dataArr[index].isLoading) {
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
				if (!this.dataArr[tabIndex].isLoading) {
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
						aryItem.data = list.slice(0, util.random(4));
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
