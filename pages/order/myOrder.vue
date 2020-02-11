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
						<view class="date_picker_box">
							<customDatePicker class="date_picker" :ref="'startDate' + indexLs"
								fields="month"
								:start="startDate"
								:end="endDate"
								:value="itemLs.startDateValue"
								@change="bindStartDateChange"
							></customDatePicker>
						</view>
						<view class="date_picker_box">
							<customDatePicker class="date_picker" :ref="'endDate' + indexLs"
								fields="month"
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
							<view class="txt"><text>亲，还没有相关订单哦~</text></view>
						</view>
					</block>
					<scroll-view v-else class="box" scroll-y @scrolltolower="loadMore">
						<view>
							<view class="ls_item" v-for="(item, index) in itemLs.data" :key="index" @click="goDetail(item.RecordId)">
								<view class="ls_item_top">
									<!-- <view class="img">
										<image v-if="itemLs.renderImage" :src="item.src" style="width: 100%;" mode="widthFix"></image>
									</view> -->
									<text class="title">下单日期: {{item.billDateStr}}</text>
									<view class="status">
										<text>{{item.stateStr}}</text>
										<text class="price">￥{{item.Amount}}</text>
									</view>
								</view>
								<view class="ls_item_center">
									<!-- <text class="count">共{{item.count}}件商品</text> -->
									<!-- <text>合计：￥{{item.Amount}}</text> -->
									<text>收货地址：{{item.Address}}</text>
								</view>
								<view class="ls_item_bottom">
									<button v-if="item.State===0" class="btn" @click.stop="bindClose(item.RecordId)">关闭</button>
									<button v-if="item.State===1" class="btn" @click.stop="bindConfirmReceive(item.RecordId)">收货确认</button>
									<button v-if="item.State===1" class="btn" @click.stop="bindReturn(index)">退货</button>
									<button v-if="item.State===4" class="btn" @click.stop="bindCancelReturn(item.RecordId)">撤销退货</button>
									<button v-if="item.State===6" class="btn" @click.stop="bindConfirmReturn(item.RecordId)">退款确认</button>
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
		
		<uni-popup ref="popup" type="bottom">
			<view class="pop">
				<button class="uni-icon uni-icon-closeempty close_btn" @click="closePopup"></button>
				<view class="con" style="padding: 30px 0 0; min-height: 100px;">
					<view class="input-group">
						<view class="input-row border">
							<text class="title">退货货运单号：</text>
							<input-box ref="trackingNo" type="text" :verification="['isNull']" :verificationTip="['货运单号不能为空']" class="input-box" clearable focus v-model="trackingNo" placeholder="请输入退货货运单号"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货原因：</text>
							<textarea v-model="reson" style="padding: 10px 11px; height: 60px;" placeholder="请输入退货原因"/>
						</view>
					</view>
				</view>
				<button type="warn" @click="closePopup('confirm')">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	// https://ext.dcloud.net.cn/plugin?id=220
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
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
			inputBox, customDatePicker, uniPopup
		},
		computed: mapState(['openid', 'userInfo']),
		data() {
			return {
				imgSrc: '/static/images/no_data_d.png',
				mode: 'widthFix',
				isLoaded: false,
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
					name: '退款确认',
					id: 'tiyu22'
				}, {
					name: '已关闭',
					id: 'tiyu3'
				}],
				startDate: '2010-01',
				endDate: '2199-12',
				trackingNo: '', // 货运单号
				reson: '', // 退货原因
				curSelected: {}, // 当前选中
				stateArr: [null, 0, 1, 2, 4, 5, 6, -1]
			}
		},
		onLoad(option) {
			console.log('onLoad');
			if (!this.isLoaded) {
				this.init();
				setTimeout(() => {
					this.isLoaded = true;
				}, 1000);
			}
			// this.dataArr = this.randomfn();
			// this.displayDataArr = util.deepCopy(this.dataArr);
			// setTimeout(()=> {
			//     this.displayDataArr[0].renderImage = true;
			// }, 300);
		},
		onShow() {
			console.log('onShow');
			if (this.isLoaded) {
				this.init();
			}
		},
		methods: {
			init() {
				let day = util.formatDate(new Date(), 'yyyy-MM');
				this.stateArr.forEach(item => {
					this.dataArr.push({
						isLoading: false,
						searchKey: '',
						startDateValue: day,
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
					this.displayDataArr[index].startDateValue = this.$refs['startDate' + index][0].getValue();
				}
				if(this.$refs['endDate' + index]) {
					this.displayDataArr[index].endDateValue = this.$refs['endDate' + index][0].getValue();
				}
				let year;
				let month;
				let monthDays;
				let endDate = this.displayDataArr[index].endDateValue;
				let endDateArr = endDate.split('-')
				if(endDate && endDate != '') {
					year = Number(endDateArr[0]);
					month = Number(endDateArr[1]);
					monthDays = util.getMonthDays(year, month);
				}
				util.ajax({
					method: 'Businese.OrderDAL.QueryMyList',
					params: {
						Filter: {
							StartDate: this.displayDataArr[index].startDateValue + '-01',
							EndDate: this.displayDataArr[index].endDateValue + '-' + monthDays,
							BillNoLike: '',
							ProductLike: this.displayDataArr[index].searchKey,
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
							dataItem.stateStr = ['已关闭', '未发货', '已发货', '已收货确认', '', '退货中', '退货确认', '退款确认'][dataItem.State+1];
						});
						this.dataArr[index].data = res.data.result.data;
						this.displayDataArr[index].data = res.data.result.data;
					}
				});
			},
			goDetail(id) {
				// 查看订单详情
				util.goUrl({
					url: './orderDetail?id=' + id + '&type=my'
				});
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
					this.displayDataArr[e].startDateValue = this.displayDataArr[e].startDateValue;
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
				if (index !== 0 && !index) {
					return;
				}
                this.tabIndex = index;
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
				let tabIndex = Number(e.target.dataset.current);
				// if (!this.displayDataArr[tabIndex].isLoading) {
				// 	this.addData(tabIndex)
				// }
				console.log(this.tabIndex, tabIndex);
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.tabIndex = tabIndex;
				}
			},
			bindClose(id) {
				let me = this;
				// 关闭
				util.dialog({
					content: '确定要关闭吗？',
					success (e) {
						if(e.confirm) {
							util.showLoading();
							util.ajax({
								method: 'Businese.OrderDAL.Close',
								params: {
									"OrderId" : id /*订单Id [String]*/
								},
								tags: {
									usertoken: me.openid
								}
							}).then(res => {
								util.hideLoading();
								util.showToast({
									title: '关闭成功',
									success() {
										me.query();
									}
								});
							});
						}
					}
				})
			},
			bindConfirmReceive(id) {
				// 收货确认
				let me = this;
				util.dialog({
					content: '确定收货吗？',
					success (e) {
						if(e.confirm) {
							util.showLoading();
							util.ajax({
								method: 'Businese.OrderDAL.ReceiveConfirm',
								params: {
									"OrderId" : id /*订单Id [String]*/
								},
								tags: {
									usertoken: me.openid
								}
							}).then(res => {
								util.hideLoading();
								util.showToast({
									title: '收货确认成功',
									success() {
										me.query();
									}
								});
							});
						}
					}
				});
			},
			bindReturn(index) {
				// 退货
				this.$refs.popup.open();
				this.curSelected = this.dataArr[this.tabIndex].data[index];
			},
			closePopup(str){
				let me = this;
				if (str === 'confirm') {
					// 退货点击确定
					if (this.$refs.trackingNo.getValue()) {
						this.$refs.popup.close();
						util.showLoading();
						util.ajax({
							method: 'Businese.OrderDAL.Return',
							params: {
								"OrderId" : this.curSelected.RecordId /*订单Id [String]*/,
								"DiliveryInfo" : {
								  "Adress": this.curSelected.Address  /*收货地址*/,
								  "LinkMan": this.curSelected.DealerName  /*联系人*/,
								  "Mobile": this.userInfo.Mobile  /*手机号*/,
								  "TransportCompany": this.curSelected.FreightInfo  /*货运公司*/,
								  "TrackingNo": this.trackingNo  /*运单号*/
								} /*货运信息 [DiliveryInfo]*/,
								"Reson" : this.reson /*退货原因 [String]*/
							},
							tags: {
								usertoken: this.openid
							}
						}).then(res => {
							util.hideLoading();
							util.showToast({
								title: '退货操作成功',
								success() {
									me.query();
								}
							});
						});
					}
				} else {
					this.$refs.popup.close();
				}
			},
			bindCancelReturn(id) {
				// 撤销退货
				let me = this;
				util.dialog({
					content: '确定撤销退货吗？',
					success (e) {
						if(e.confirm) {
							util.showLoading();
							util.ajax({
								method: 'Businese.OrderDAL.ReturnCancel',
								params: {
									"OrderId" : id /*订单Id [String]*/
								},
								tags: {
									usertoken: me.openid
								}
							}).then(res => {
								util.hideLoading();
								util.showToast({
									title: '撤销退货操作成功',
									success() {
										me.query();
									}
								});
							});
						}
					}
				});
			},
			bindConfirmReturn(id) {
				// 确认退款
				let me = this;
				util.dialog({
					content: '确定要确认退款吗？',
					success (e) {
						if(e.confirm) {
							util.showLoading();
							util.ajax({
								method: 'Businese.OrderDAL.PayReturnConfirm',
								params: {
									"OrderId" : id /*订单Id [String]*/
								},
								tags: {
									usertoken: me.openid
								}
							}).then(res => {
								util.hideLoading();
								util.showToast({
									title: '确认退款成功',
									success() {
										me.query();
									}
								});
							});
						}
					}
				});
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
