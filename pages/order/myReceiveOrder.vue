<template>
	<view class="order">
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
							<input-box v-model="itemLs.searchKeyNo" placeholder="请输入搜索关键字"></input-box>
							<!-- <input-box style="width: 200upx;" v-model="itemLs.searchKeyName" placeholder="姓名"></input-box> -->
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
						<scroll-view v-else="" class="box" scroll-y @scrolltolower="loadMore">
							<view>
								<view class="ls_item" v-for="(item, index) in itemLs.data" :key="index" @click="goDetail(item.RecordId)">
									<view class="ls_item_top">
										<!-- <view class="img">
											<image v-if="itemLs.renderImage" :src="item.src" style="width: 100%;" mode="widthFix"></image>
										</view> -->
										<text class="title">订单编号: {{item.BillCode}}</text>
										<view class="status">
											<text>{{item.stateStr}}</text>
											<text class="price">￥{{item.Amount}}</text>
										</view>
									</view>
									<view class="ls_item_center">
										<text class="count">订货日期：{{item.billDateStr}}</text>
									</view>
									<view class="ls_item_center">
										<text class="count">会员编号：{{item.DealerCode}}</text>
										<text class="count">姓名：{{item.DealerName}}</text>
									</view>
									<view class="ls_item_bottom">
										<button class="btn" v-if="item.State === 0 || item.status === '未发货'" @click.stop="bindSend(index)">发货</button>
										<button class="btn" v-if="item.State === 4 || item.status === '退货中'" @click.stop="bindReturnConfirm(index)">退货确认</button>
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
		<uni-popup ref="popup" type="bottom">
			<!-- 发货 -->
			<view class="pop">
				<button class="uni-icon uni-icon-closeempty close_btn" @click="closePopup"></button>
				<view class="con" style="padding: 30px 0 0; min-height: 100px;">
					<view class="input-group">
						<view class="input-row border">
							<text class="title">货运单号：</text>
							<input-box ref="trackingNo" type="text" :verification="['isNull']" :verificationTip="['货运单号不能为空']" class="input-box" clearable focus v-model="trackingNo" placeholder="请输入货运单号"></input-box>
						</view>
						<view class="input-row border">
							<text class="title">快递公司：</text>
							<input-box ref="transportCompany" type="text" class="input-box" clearable focus v-model="transportCompany" placeholder="请输入货运公司"></input-box>
						</view>
						<block v-if="curSelected.IsPay">
							<view class="input-row border">
								<text class="title">付款方式：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="['现金', '银行转账', '支付宝', '微信'][curSelected.PayType]"></input-box>
							</view>
							<view class="input-row border">
								<text class="title">付款方账户信息：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="curSelected.PayAccountInfo"></input-box>
							</view>
							<view class="input-row border">
								<text class="title">收款方账户信息：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="curSelected.ReceiveAccountInfo"></input-box>
							</view>
							<view class="input-row border">
								<text class="title">付款金额：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="curSelected.Amount"></input-box>
							</view>
						</block>
					</view>
				</view>
				<button type="warn" v-if="!curSelected.IsPay" @click="closePopup('confirm')">确定</button>
				<view class="btn_group" v-else>
					<button type="warn" @click="closePopup('receiveConfirm')">确认收款</button>
					<button @click="closePopup()">取消</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup2" type="bottom">
			<view class="pop">
				<button class="uni-icon uni-icon-closeempty close_btn" @click="closePopup2"></button>
				<view class="con" style="padding: 30px 0 0; min-height: 100px;">
					<view class="input-group">
						<view class="input-row border">
							<text class="title">退货货运信息：</text>
							<input-box ref="trackingNo2" type="text" class="input-box" :clearShow="false" v-model="trackingNo2" disabled></input-box>
						</view>
						<view class="input-row border">
							<text class="title">退货原因：</text>
							<textarea v-model="reson" class="text_area" disabled />
						</view>
						<block v-if="curSelected.IsPay">
							<view class="input-row border">
								<text class="title">是否退款：</text>
								<radio @tap="onIsPayReturnChange" color="#f23030" :value="curSelected.IsPayReturn ? 'true' : 'false'" :checked="curSelected.IsPayReturn" />
							</view>
							<view class="input-row border">
								<text class="title">收款方账户信息：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="curSelected.PayAccountInfo"></input-box>
							</view>
							<view class="input-row border">
								<text class="title">付款方账户信息：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="curSelected.ReceiveAccountInfo"></input-box>
							</view>
							<view class="input-row border">
								<text class="title">退款金额：</text>
								<input-box type="text" class="input-box" :clearShow="false" disabled :inputValue="curSelected.Amount"></input-box>
							</view>
						</block>
					</view>
				</view>
				<!-- 如果是在订单上付款，这在退货确认时，需要弹出窗口录入退款信息。未选中是否退款，不能点击确定 -->
				<button type="warn" :disabled="curSelected.IsPay && !curSelected.IsPayReturn" @click="closePopup2('confirm')">确定</button>
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
	import {
		mapState,
		mapMutations
	} from 'vuex';
	const list = [{
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '未发货',
		count: 1,
		price: 16.28,
		IsPay: true,
		IsPayReturn: true
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '已发货',
		count: 1,
		price: 16.28,
		IsPay: true,
		IsPayReturn: true
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '已收货确认',
		count: 1,
		price: 16.28,
		IsPay: true,
		IsPayReturn: true
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '退货中',
		count: 1,
		price: 16.28,
		IsPay: true,
		IsPayReturn: true
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '已确认退货',
		count: 1,
		price: 16.28,
		IsPay: true,
		IsPayReturn: true
	}, {
		src: '/static/img/H_023_180@200.JPG',
		title: '下单日期：2019-05-22',
		status: '已关闭',
		count: 1,
		price: 16.28,
		IsPay: true,
		IsPayReturn: true
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
					name: '已退款确认',
					id: 'tiyu3'
				}, {
					name: '已关闭',
					id: 'tiyu4'
				}],
				startDate: '2010-01',
				endDate: '2199-12',
				transportCompany: '', // 货运公司
				trackingNo: '', // 发货货运单号
				trackingNo2: '', // 退货货运信息
				reson: '', // 退货原因
				curSelected: {}, // 当前选中
				stateArr: [null, 0, 1, 2, 4, 5, 6, -1]
			}
		},
		onLoad() {
			// this.dataArr = this.randomfn();
			// this.displayDataArr = util.deepCopy(this.dataArr);
			if (!this.isLoaded) {
				this.init();
				setTimeout(() => {
					this.isLoaded = true;
				}, 1000);
			}
		},
		onShow() {
			if (this.isLoaded) {
				this.init();
			}
		},
		mounted() {
			// this.$refs.popup2.open();
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
					method: 'Businese.OrderDAL.QueryReceivedList',
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
							dataItem.accountTypeStr = ['货款', '保证金', '代交保证金'][item.AccountType]
							dataItem.stateStr = ['已关闭', '未发货', '已发货', '已收货确认', '', '退货中', '退货确认'][dataItem.State + 1];
							dataItem.payTypeStr = ['已取消', '未收款', '', '已收款'][dataItem.PayType];
						});
						this.dataArr[index].data = res.data.result.data;
						this.displayDataArr[index].data = res.data.result.data;
					}
				});
			},
			goDetail(id) {
				// 查看订单详情
				util.goUrl({
					url: './orderDetail?id=' + id
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
				if (this.displayDataArr[e].dateValue === '') {
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
				let index = e.target.current;
				if (!index) {
					return;
				}
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
			bindSend(index) {
				// 发货弹窗
				this.$refs.popup.open();
				this.curSelected = this.dataArr[this.tabIndex].data[index];
			},
			sendOrder() {
				// 发货
				let me = this;
				util.ajax({
					method: 'Businese.OrderDAL.Send',
					params: {
						"OrderId" : me.curSelected.RecordId /*订单Id [String]*/,
						"DiliveryInfo" : {
						  "Adress": me.curSelected.Address  /*收货地址*/,
						  "LinkMan": me.curSelected.DealerName  /*联系人*/,
						  "Mobile": me.curSelected.Mobile  /*手机号*/,
						  "TransportCompany": me.curSelected.FreightInfo  /*货运公司*/,
						  "TrackingNo": me.trackingNo  /*运单号*/
						} /*货运信息 [DiliveryInfo]*/,
					},
					tags: {
						usertoken: me.openid
					}
				}).then(res => {
					util.hideLoading();
					util.showToast({
						title: '发货成功',
						success() {
							me.query();
						}
					});
				});
			},
			closePopup(str){
				let me = this;
				// 对于付款的订单，需要弹出窗口，显示付款方式、付款方账户信息、收款方账户信息，付款金额(等于订单金额)，确认收款和取消按钮。必须确认收款才能发货。
				if (str === 'confirm') {
					// 发货点击确定
					if (this.$refs.trackingNo.getValue() && this.$refs.transportCompany.getValue()) {
						this.$refs.popup.close();
						util.dialog({
							content: '确定发货吗？',
							success (e) {
								if(e.confirm) {
									util.showLoading();
									me.sendOrder();
								}
							}
						});
					}
				} else if (str === 'receiveConfirm') {
					// 发货弹窗确认收款
					if (this.$refs.trackingNo.getValue() && this.$refs.transportCompany.getValue()) {
						this.$refs.popup.close();
						util.showLoading();
						util.ajax({
							method: 'Businese.BillPayDAL.ReceiveConfirm',
							params: {
								RecordId: this.curSelected.RecordId
							},
							tags: {
								usertoken: this.openid
							}
						}).then(res => {
							this.sendOrder();
						});
					}
				} else {
					this.$refs.popup.close();
				}
			},
			bindReturnConfirm(index) {
				// 退货确认
				this.$refs.popup2.open();
				this.curSelected = this.dataArr[this.tabIndex].data[index];
			},
			closePopup2(str){
				let me = this;
				let params = {
					"OrderId" : this.curSelected.RecordId /*订单Id [String]*/,
					"PayReturn" : false /*是否退款 [Boolean]*/
				};
				if (this.curSelected.IsPay) {
					params.PayReturn = this.curSelected.IsPayReturn;
				}
				if (str === 'confirm') {
					// 退货点击确定
					this.$refs.popup2.close();
					util.showLoading();
					util.ajax({
						method: 'Businese.OrderDAL.ReturnConfirm',
						params: params,
						tags: {
							usertoken: this.openid
						}
					}).then(res => {
						util.hideLoading();
						util.showToast({
							title: '退货操作成功',
							success() {
								me.init();
							}
						});
					});
				} else {
					this.$refs.popup2.close();
				}
			},
			onIsPayReturnChange(e) {
				this.$set(this.curSelected, 'IsPayReturn', !this.curSelected.IsPayReturn);
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
