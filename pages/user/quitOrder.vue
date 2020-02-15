<template>
	<view class="quit_order">			
		<view class="uni-tab-bar">
			<block v-for="(itemLs, indexLs) in dataArr" :key="indexLs">
				<view class="list">
					<block v-if="itemLs.data.length<1">
						<view class="no-data">
							<view class="no-img cart">
								<image style="width: 100%;" :mode="mode" :src="imgSrc" @error="imageError"></image>
							</view>
							<view class="txt"><text>亲，还没有相关付款单哦~</text></view>
						</view>
					</block>
					<view v-else="" class="box">
						<view>
							<view class="ls_item" v-for="(item, index) in itemLs.data" :key="index" @click="goDetail(item.RecordId)">
								<view class="ls_item_top">
									<view class="title">
										<view><text class="gray">日期:</text>{{item.billDateStr}}</view>
										<view><text class="gray">姓名:</text>{{item.CreatorName}}</view>
										<view><text class="gray">保证金:</text><text class="price">￥{{item.price}}</text> &nbsp; &nbsp; <text class="gray mgl10">退款方式:</text><text>{{item.payType}}</text></view>
										<view><text class="gray">经销商编号:</text>{{item.DealerCode}}</view>
										<view><text class="gray">经销商姓名:</text>{{item.DealerName}}</view>
										<view><text class="gray">注销原因:</text>{{item.Remark}}</view>
									</view>
									<view class="status">
										<text>{{item.status}}</text>
									</view>
								</view>
								<view class="ls_item_bottom">
									<button v-if="item.State === 0" class="btn" @click="bindDel(item.RecordId)">删除</button>
									<button v-if="item.State === 1" class="btn" @click="bindConfirm(item.RecordId)">确认退款</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import util from '@/common/util.js';
	import noImg from '@/static/images/no_data_d.png';
	import {mapState, mapMutations} from 'vuex';
	const list = [{
		src: '/static/img/H_023_180@200.JPG',
		title: '水星MW150UH光驱版无线网卡接收器台式机笔记本电脑发射随身wifi',
		status: '已审核',
		payType: '微信',
		count: 1,
		price: 16.28
	}];
	export default {
		components: {
			inputBox
		},
		computed: mapState(['openid']),
		data() {
			return {
				imgSrc: noImg,
				mode: 'widthFix',
				scrollLeft: 0,
				tabIndex: 0,
				dataArr: [],
				renderImage: false,
				tabBars: [{
					name: '全部',
					id: 'all'
				}, {
					name: '已退货款',
					id: 'guanzhu'
				}, {
					name: '已审核',
					id: 'tuijian'
				}, {
					name: '已确认退款',
					id: 'tiyu'
				}],
				isScroll: false,
				loadingText: '加载更多...',
				dateValue: '',
				searchKey: '',
				startDate: '2010-01-01',
				endDate: '2199-12-31',
				ls: list
			}
		},
		onLoad() {
			this.init();
			// this.dataArr = this.randomfn();
			// setTimeout(()=> {
			//     this.dataArr[0].renderImage = true;
			// }, 300);
		},		
		onNavigationBarButtonTap(e) {
			util.goUrl({
				url: './createQuitOrder'
			})
		},
		methods: {
			init() {
				this.getAllData([0, 1, 2, 3, 4]);
			},
			async getAllData(arr) {
				util.showLoading();
				// 获取全部状态的数据
				var promiseArray = [];
				arr.forEach(item => {
					promiseArray.push(util.ajax({
						method: 'Businese.BillLeaveDAL.QueryMyList',
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
					util.hideLoading();
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
						if(item.data.hasOwnProperty('result')) {
							this.dataArr[index+1].data = item.data.result.data;
						}
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
				this.dataArr.splice(1);
			},
			bindDel(RecordId) {
				util.showLoading();
				let me = this;
				util.ajax({
					method: 'Businese.BillLeaveDAL.Cancel',
					params: {
						RecordId: RecordId
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					util.showToast({
						title: '删除注销单成功',
						success() {
							me.init();
						}
					});
				});
			},
			bindConfirm(RecordId) {
				// (5)	退款确认：注销单审核后，可以进行退款确认操作。确认退款后，经销商成为注销状态，不能再登录系统，不能再进行任何操作
				util.showLoading();
				util.ajax({
					method: 'Businese.OrderDAL.PayReturnConfirm',
					params: {
						"OrderId" : RecordId /*订单Id [String]*/
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					this.logout();
					util.goTab({
						url: '../tabBar/user'
					});
				});
			},
			goDetail(id) {
				// 查看订单详情
				console.log(index);
				util.goUrl({
					url: './orderDetail?id=' + id
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
				for (let i = 0, length = 1; i < length; i++) {
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
						aryItem.data = list.slice(0, util.random(1));
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
