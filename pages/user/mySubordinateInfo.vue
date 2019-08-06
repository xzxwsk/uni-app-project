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
					<view class="con" v-if="false">
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
										<t-th align="left"><text class="first_col">编号</text></t-th>
										<t-th align="left">姓名</t-th>
										<t-th align="left">货款余额</t-th>
										<t-th align="left">操作</t-th>
									</t-tr>
									<t-tr font-size="12" color="#5d6f61" align="right" v-for="item in tableList" :key="item.id">
										<t-td align="left"><text class="first_col">{{ item.name }}</text></t-td>
										<t-td align="left">{{ item.age }}</t-td>
										<t-td align="left">{{ item.hobby }}</t-td>
										<t-td align="left"><text class="a" @click="paymentGoodsDetail(item.id)">收支明细</text></t-td>
									</t-tr>
								</t-table>
							</view>
							<view v-if="isScroll" class="uni-tab-bar-loading">
								加载更多...
							</view>
						</scroll-view>
					</block>
				</swiper-item>
				<swiper-item>
					<view class="con" v-if="false">
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
								<view class="search_box">
									<input-box ref="input1" type="text" clearable focus v-model="userNo" placeholder="请输入会员编号"></input-box>
									<customDatePicker
										fields="month"
										:start="startDate"
										:end="endDate"
										:value="dateValue"
										@change="bindDateChange"
									></customDatePicker>
									<button class="btn" type="warn" @click="query">查询</button>
								</view>
								<t-table border="0">
									<t-tr font-size="14" color="#000" align="left">
										<t-th align="left"><text class="first_col">编号</text></t-th>
										<t-th align="left">姓名</t-th>
										<t-th align="left">货款余额</t-th>
										<t-th align="left">操作</t-th>
									</t-tr>
									<t-tr font-size="12" color="#5d6f61" align="right" v-for="item in tableList" :key="item.id">
										<t-td align="left"><text class="first_col">{{ item.name }}</text></t-td>
										<t-td align="left">{{ item.age }}</t-td>
										<t-td align="left">{{ item.hobby }}</t-td>
										<t-td align="left"><text class="a" @click="paymentGoodsDetail(item.id)">收支明细</text></t-td>
									</t-tr>
								</t-table>
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
	
	const tableList = [{
	                    id: 0,
	                    name: '张三',
	                    age: '19',
	                    hobby: '游泳'
	                },
	                {
	                    id: 1,
	                    name: '李四',
	                    age: '21',
	                    hobby: '绘画'
	                },
	                {
	                    id: 2,
	                    name: '王二',
	                    age: '29',
	                    hobby: '滑板'
	                }
	            ]
		tableList.forEach(function(item, index){
			item.id = index
		});
	
	export default {
		components: {
		    inputBox, tTable, tTh, tTr, tTd, customDatePicker
		},
		data() {
			return {
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				tabBars: [{
					name: '下属帐户余额',
					id: 'accountBalance'
				}, {
					name: '下属奖金查询',
					id: 'bonusQuery'
				}],
				imgSrc: '/static/images/no_data_d.png',
				tableList: tableList,
				isScroll: false,
				// 奖金查询
				userNo: '',
				dateValue: '',
				startDate: '2010-01',
				endDate: '2199-12',
				isScroll2: false
			}
		},
		methods: {
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
				console.log(e.target);
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
				console.log('loadMore: ', e);
				this.isScroll = true;
			},
			bindDateChange(value) {
				console.log('bindDateChange: ', value);
				this.dateValue = value;
			},
			loadMore2(e) {
				console.log('loadMore2: ', e);
				this.isScroll2 = true;
			},
			query() {
				console.log('查询条件：', this.userNo, this.dateValue)
			}
		}
	}
</script>
