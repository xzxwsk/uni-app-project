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
								<view class="txt"><text>亲，还没有相关加盟单哦~</text></view>
							</view>
						</block>
						<scroll-view v-else="" class="box" scroll-y @scrolltolower="loadMore">
							<view>
								<view class="ls_item" v-for="(item, index) in itemLs.data" :key="index" @click="goDetail(item.RecordId)">
									<view class="ls_item_top">
										<view class="title">
											<view><text class="gray">日期:</text>{{item.billDateStr}}</view>
											<view><text class="gray">商品编号:</text>{{item.ProductCode}}</view>
											<view><text class="gray">商品名称:</text>{{item.ProductName}}</view>
											<view><text class="gray">规格:</text>{{item.Spec}}</view>
											<view><text class="gray">计量单位:</text>{{item.UnitName}}</view>
											<view><text class="gray">数量:</text>{{item.Qty}}</view>
											<view><text class="gray">单价:</text>{{item.Price}}</view>
											<view><text class="gray">消费类别:</text>{{['自用', '零售'][item.ConsumeType]}}</view>
											<view><text class="gray">备注:</text>{{item.Remark}}</view>
										</view>
										<view class="status">
											<text>{{item.stateStr}}</text>
										</view>
									</view>
									<view class="ls_item_bottom">
										<button class="btn" @click.stop="del(item.RecordId)" v-if="item.State === 0">取消</button>
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
					name: '正常',
					id: 'guanzhu'
				}, {
					name: '已取消',
					id: 'tuijian2'
				}],
				startDate: '2010-01-01',
				endDate: '2199-12-31',
				stateArr: [null, 0, -1]
			}
		},
		onLoad() {
			this.init();
		},		
		onNavigationBarButtonTap(e) {
			util.goUrl({
				url: './createConsume'
			})
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
						renderImage: false,
					});
				});
				this.displayDataArr = util.deepCopy(this.dataArr);
				this.getData(this.stateArr[0]);
			},
			getData(state) {
				util.showLoading();
				let index = this.tabIndex;
				if(this.$refs['startDate' + index]) {
					this.dataArr[index].startDateValue = this.$refs['startDate' + index][0].getValue();
				}
				if(this.$refs['endDate' + index]) {
					this.dataArr[index].endDateValue = this.$refs['endDate' + index][0].getValue();
				}
				util.ajax({
					method: 'Businese.BillConsumeDAL.QueryMyList',
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
							dataItem.stateStr = ['取消', '正常', '审核中', '已审核', '已完成'][dataItem.State+1];
						});
						this.dataArr[index].data = res.data.result.data;
						this.displayDataArr[index].data = res.data.result.data;
					}
				});
			},
			del(id) {
				let me = this;
				util.dialog({
					content: '确定要取消吗？',
					success (e) {
						if(e.confirm) {
							util.showLoading();
							util.ajax({
								method: 'Businese.BillConsumeDAL.Delete',
								params: {
									RecordId: id
								},
								tags: {
									usertoken: me.openid
								}
							}).then(res => {
								util.hideLoading();
								util.showToast({
									title: '取消成功',
									success() {
										setTimeout(() => {
											me.query();
										}, 1000);
									}
								});
							});
						}
					}
				});
			},
			edit(id) {
				util.goUrl({
					url: './createConsume?id=' + id
				});
			},
			goDetail(id) {
				console.log('detail id: ', id);
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
			addData(e) {
				this.displayDataArr[e].isLoading = true;
				this.displayDataArr[e].loadingText = '没有更多了';
				if(this.displayDataArr[e].startDateValue === ''){
					this.displayDataArr[e].startDateValue = this.displayDataArr[0].startDateValue;
				}
				if(this.displayDataArr[e].endDateValue === ''){
					this.displayDataArr[e].endDateValue = this.displayDataArr[0].endDateValue;
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
				this.query();
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
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
