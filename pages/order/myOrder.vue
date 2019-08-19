<template>
	<view class="uni-tab-bar order">
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
							<view class="txt"><text>亲，还没有相关订单哦~</text></view>
						</view>
					</block>
					<scroll-view v-else class="box" scroll-y @scrolltolower="loadMore">
						<view>
							<view class="ls_item" v-for="(item, index) in itemLs.data" :key="index" @click="goDetail(index)">
								<view class="ls_item_top">
									<!-- <view class="img">
										<image v-if="itemLs.renderImage" :src="item.src" style="width: 100%;" mode="widthFix"></image>
									</view> -->
									<text class="title">{{item.title}}</text>
									<view class="status">
										<text>{{item.status}}</text>
										<text class="price">￥{{item.price}}</text>
									</view>
								</view>
								<view class="ls_item_center">
									<text class="count">共{{item.count}}件商品</text>
									<text>合计：￥{{item.price * item.count}}</text>
								</view>
								<view class="ls_item_bottom">
									<button v-if="tabIndex===5" class="btn">关闭</button>
									<button class="btn">收货确认</button>
									<button class="btn">退货</button>
									<button v-if="tabIndex===4" class="btn">撤销退货</button>
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
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	// https://ext.dcloud.net.cn/plugin?id=220
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
	import util from '@/common/util.js';
	const list = [{
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '未发货',
		count: 1,
		price: 16.28
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '未发货',
		count: 1,
		price: 16.28
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '已发货',
		count: 1,
		price: 16.28
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '已发货',
		count: 1,
		price: 16.28
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '已发货',
		count: 1,
		price: 16.28
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '已收货确认',
		count: 1,
		price: 16.28
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '退货中',
		count: 1,
		price: 16.28
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '已退货确认',
		count: 1,
		price: 16.28
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '已关闭',
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
					name: '未发货',
					id: 'guanzhu'
				}, {
					name: '已发货',
					id: 'tuijian'
				}, {
					name: '已收货确认',
					id: 'tiyu'
				}, {
					name: '退货中',
					id: 'tiyu1'
				}, {
					name: '已退货确认',
					id: 'tiyu2'
				}, {
					name: '已关闭',
					id: 'tiyu3'
				}],
				startDate: '2010-01',
				endDate: '2199-12'
			}
		},
		onLoad(option) {
			this.dataArr = this.randomfn();
			this.displayDataArr = util.deepCopy(this.dataArr);
			setTimeout(()=> {
			    this.displayDataArr[0].renderImage = true;
			}, 300);
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
				let searchKey = this.displayDataArr[this.tabIndex].searchKey;
				console.log(this.displayDataArr[this.tabIndex].searchKey, this.displayDataArr[this.tabIndex].dateValue);
				// let tempArr = [];
				this.displayDataArr[this.tabIndex].data = [];
				// this.dataArr[this.tabIndex].data.forEach(item => {
				// 	if(item.title.indexOf(searchKey) != -1){
				// 		tempArr.push(item);
				// 	}
				// });
				// this.displayDataArr[this.tabIndex].data = tempArr;
				this.displayDataArr[this.tabIndex].data = this.dataArr[this.tabIndex].data.filter(item => {
					let flag = false;
					if(searchKey === ''){
						flag = true;
					} else {
						for(let key in item){
							if(Object.prototype.toString.call(item[key]) === '[object String]' && item[key].indexOf(searchKey) != -1){
							// if(key==='title' && item[key].indexOf(searchKey)!=-1){
								flag = true;
							}
						}
					}
					
					return flag;
				});
			},
			loadMore(e) {
				this.displayDataArr[this.tabIndex].isScroll = true;
			},
			bindDateChange(value) {
				console.log('bindDateChange: ', value, this.tabIndex);
				this.displayDataArr[this.tabIndex].dateValue = value;
			},
			addData(e) {
				this.displayDataArr[e].isLoading = true;
				this.displayDataArr[e].loadingText = '没有更多了';
				if(this.displayDataArr[e].dateValue === ''){
					this.displayDataArr[e].dateValue = this.displayDataArr[0].dateValue;
				}
				setTimeout(()=> {
				    this.displayDataArr[e].renderImage = true;
				}, 300);
				// if (this.dataArr[e].data.length > 30) {
					// this.dataArr[e].loadingText = '没有更多了';
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
				let index = e.target.current;
				if (!index) {
					return;
				}
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
						// aryItem.data = list.slice(0, util.random(4));
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
