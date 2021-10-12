<template>
	<view class="uni-tab-bar order">
		<!-- <view :style="{height: systemInfo.statusBarHeight}"></view> -->
		<nav-bar title="我的订单" leftIcon="arrowleft" statusBar :leftIconSize="26" @click-left="onReturn" backgroundColor="#f8f8f8" :border="false"></nav-bar>
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
						<view class="date_picker_box" style="width: 115upx;">
							<customDatePicker class="date_picker" :ref="'startDate' + indexLs"
								fields="month"
								:start="startDate"
								:end="endDate"
								:value="itemLs.startDateValue"
								@change="bindStartDateChange"
							></customDatePicker>
						</view>
						<view class="date_picker_box" style="width: 115upx;">
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
								<view class="ls_item_center">
									<text>确认收货时间：{{item.receiveConfirmTimeStr}}</text>
								</view>
								<view class="ls_item_bottom">
									<button v-if="item.State===0" class="btn" @click.stop="bindClose(item.RecordId)">关闭</button>
									<button v-if="item.State===1" class="btn" @click.stop="bindConfirmReceive(item.RecordId)">收货确认</button>
									<!--2010-02-13 qq消息 退货就只在详情中显示, 因为是非常规操作-->
									<!-- <button v-if="item.State===1" class="btn" @click.stop="bindReturn(index)">退货</button> -->
									<button v-if="item.State===4" class="btn" @click.stop="bindCancelReturn(item.RecordId)">撤销退货</button>
									<button v-if="item.State===5 && item.IsPay" class="btn" @click.stop="bindConfirmReturn(item.RecordId)">退款确认</button>
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
							<text class="title">退货货运信息：</text>
							<input-box ref="freightInfo" type="text" class="input-box" :clearShow="false" clearable focus v-model="curSelected.FreightInfo" placeholder=""></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货运单号：</text>
							<input-box ref="trackingNo" type="text" :verification="['isNull']" :verificationTip="['运单号不能为空']" class="input-box" clearable focus v-model="trackingNo" placeholder="请输入退货运单号"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">联系人：</text>
							<input-box ref="linkMan" type="text" class="input-box" clearable focus v-model="addr.PersonName" placeholder="请输入退货联系人"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">手机号：</text>
							<input-box ref="mobile" type="text" class="input-box" clearable focus v-model="addr.Mobile" placeholder="请输入退货人手机号"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">收货地址：</text>
							<input-box ref="addr" type="text" class="input-box" clearable focus v-model="addr.Address" placeholder="请输入退货收货地址"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货货运公司：</text>
							<input-box ref="company" type="text" class="input-box" clearable focus v-model="company" placeholder="请输入退货货运公司"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货原因：</text>
							<textarea style="padding: 10px 11px; height: 60px;" v-model="curSelected.ReturnReason" placeholder="请输入退货原因"/>
						</view>
					</view>
				</view>
				<button type="warn" @click="closePopup('confirm')">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import NavBar from '@/components/uni-nav-bar/uni-nav-bar';
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	// https://ext.dcloud.net.cn/plugin?id=220
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	const list = [];
	export default {
		components: {
			NavBar, inputBox, customDatePicker, uniPopup
		},
		computed: mapState(['openid', 'userInfo']),
		data() {
			return {
				systemInfo: '',
				imgSrc: util.getImgUrl() + '/static/images/no_data_d.png',
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
				addr: {
					PersonName: '',
					Mobile: '',
					Address: ''
				},
				trackingNo: '', // 货运单号
				company: '', // 退货货运公司
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
			
			this.systemInfo = uni.getSystemInfoSync()
			console.log('systemInfo: ', this.systemInfo);
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
		onBackPress(e) {
		    console.log("监听返回按钮事件: ", e);
		    this.onReturn()
		    // 此处一定姚要return为true，否则页面不会返回到指定路径
		    return true;
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
							dataItem.receiveConfirmTimeStr = util.formatDate(dataItem.ReceiveConfirmTime, 'yyyy-MM-dd');
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
				let winWidth = this.systemInfo.windowWidth,
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
			onReturn() {
				util.goTab({
				    url: '../tabBar/order'
				})
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
			getDefaultAddr() {
				return util.ajax({
					method: 'Businese.OrderDAL.GetReturnLinkInfo',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					this.addr.Address = res.data.result.Adress;
					this.addr.PersonName = res.data.result.LinkMan;
					this.addr.Mobile = res.data.result.Mobile;
				});
			},
			async bindReturn(index) {
				// 2010-02-13 qq消息 退货就只在详情中显示, 因为是非常规操作
				// 退货
				this.curSelected = this.dataArr[this.tabIndex].data[index];
				util.showLoading();
				// 先获取默认地址
				await this.getDefaultAddr();
				// 判断是否可以退货
				util.ajax({
					method: 'Businese.OrderDAL.CanReturn',
					params: {
						OrderId: this.curSelected.RecordId
					},
					tags: {
						usertoken: this.openid
					}
				})
				.then(res => {
					util.hideLoading();
					if(!res.data.result) {
						util.dialog({
							content: '该单据不能退货',
							showCancel: false
						});
					} else {
						this.$refs.popup.open();
						setTimeout(() => {
							if(this.$refs.linkMan) {
								this.$refs.linkMan.setValue(this.addr.PersonName);
							}
							if(this.$refs.mobile) {
								this.$refs.mobile.setValue(this.addr.Mobile);
							}
							if(this.$refs.addr) {
								this.$refs.addr.setValue(this.addr.Address);
							}
							if(this.$refs.freightInfo) {
								this.$refs.freightInfo.setValue(this.curSelected.FreightInfo);
							}
						}, 500);
					}
				});
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
								  "Adress": this.addr.Address  /*收货地址*/,
								  "LinkMan": this.addr.PersonName  /*联系人*/,
								  "Mobile": this.addr.Mobile  /*手机号*/,
								  "TransportCompany": this.company  /*货运公司*/,
								  "TrackingNo": this.trackingNo  /*运单号*/
								} /*货运信息 [DiliveryInfo]*/,
								"Reson" : this.curSelected.ReturnReason /*退货原因 [String]*/
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
					content: '你确定收到退款了吗？',
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
