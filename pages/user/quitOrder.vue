<template>
	<view class="quit_order">			
		<view class="uni-tab-bar">
			<view class="list">
				<block v-if="dataArr.length<1">
					<view class="no-data">
						<view class="no-img cart">
							<image style="width: 100%;" mode="widthFix" :src="imgSrc" @error="imageError"></image>
						</view>
						<view class="txt"><text>亲，还没有相关注销单哦~</text></view>
					</view>
				</block>
				<view v-else class="box">
					<view class="ls_item" v-for="(item, index) in dataArr" :key="index">
						<view class="ls_item_top" @click="goDetail(item.RecordId)">
							<view class="title">
								<view><text class="gray">日期:</text>{{item.billDateStr}}</view>
								<view><text class="gray">姓名:</text>{{item.DealerName}}</view>
								<view class="return_info" v-for="(subItem, subIndex) in item.PayReturnItems" :key="subIndex" v-if="item.State === 2 || item.State === 3">
									<view><text class="gray">金额:</text><text class="price">￥{{subItem.Amount}}</text> &nbsp; &nbsp; <text class="gray mgl10">退款方式:</text><text>{{subItem.PayTypeStr}}</text></view>
									<view><text class="gray">退款分销商编号:</text>{{subItem.DealerCode}}</view>
									<view><text class="gray">退款分销商姓名:</text>{{subItem.DealerName}}</view>
									<view><text class="gray">退款类型:</text>{{['货款','保证金','代交保证金'][subItem.AccountType]}}</view>
									<view><text class="gray">付款账户:</text>{{subItem.PayAccountNo}}</view>
									<block v-if="subItem.PayType === 1">
										<view><text class="gray">付款银行:</text>{{subItem.PayBank}}</view>
										<view><text class="gray">付款户名:</text>{{subItem.PayAccountName}}</view>
									</block>
									<view><text class="gray">收款账户信息:</text>{{subItem.ReceiveAccountInfo}}</view>
								</view>
								<view><text class="gray">注销原因:</text>{{item.Remark}}</view>
							</view>
							<view class="status">
								<text>{{item.status}}</text>
							</view>
						</view>
						<view class="ls_item_bottom" v-if="item.State === 0 || item.State === 2">
							<button v-if="item.State === 0" class="btn" @click="bindDel(item.RecordId)">删除</button>
							<button v-if="item.State === 2" class="btn" @click="bindConfirm(item.RecordId)">确认退款</button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import util from '@/common/util.js';
	import noImg from '@/static/images/no_data_d.png';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox
		},
		computed: mapState(['openid', 'userInfo']),
		data() {
			return {
				imgSrc: noImg,
				dataArr: [{
					"RecordId": ""  /*单据Id*/,
					"BillCode": ""  /*单据编号*/,
					"BillDate": "2020-02-15T14:12:51.1542856+08:00"  /*单据日期*/,
					"DealerId": ""  /*分销商Id*/,
					"DealerCode": ""  /*分销商编号*/,
					"DealerName": ""  /*分销商姓名*/,
					"Remark": ""  /*备注*/,
					"State": 1  /*State*/,
					"Creator": ""  /*录入人*/,
					"CreatorName": ""  /*录入人姓名*/,
					"CreateTime": "2020-02-15T14:12:51.1542856+08:00"  /*录入时间*/,
					"LastModifier": ""  /*最后修改人*/,
					"LastModifierName": ""  /*最后修改人姓名*/,
					"LastModifyTime": "2020-02-15T14:12:51.1542856+08:00"  /*最后修改时间*/,
					"StateChanged": false  /*状态是否发生过改变*/,
					"TimeStamp": ""  /*时间戳*/,
					"ChangeType": 0,
					"IdValues": [
					  ""
					],
					"iState": 1,
					"PayReturnItems": [
					  {
						"DtlId": ""  /*FId*/,
						"RecordId": ""  /*单据Id*/,
						"AccountType": 0  /*退款类别*/,
						"Amount": 0.0  /*退款金额*/,
						"DealerId": ""  /*退款分销商Id*/,
						"DealerCode": ""  /*退款分销商编号*/,
						"DealerName": ""  /*退款分销商名称*/,
						"PayType": 0  /*退款方式*/,
						"ReceiveAccountInfo": ""  /*收款方账户信息*/,
						"PayBank": ""  /*付款银行*/,
						"PayAccountNo": ""  /*付款账户*/,
						"PayAccountName": ""  /*付款户名*/,
						"Creator": ""  /*录入人*/,
						"CreatorName": ""  /*录入人姓名*/,
						"CreateTime": "2020-02-15T14:12:51.1542856+08:00"  /*录入时间*/,
						"ChangeType": 0
					  }
					]
				}]
			}
		},
		onLoad() {
			this.init();
		},		
		onNavigationBarButtonTap(e) {
			util.goUrl({
				url: './createQuitOrder'
			})
		},
		methods: {
			...mapMutations(['logout']),
			init() {
				this.getData();
			},
			getData(arr) {
				util.showLoading();
				util.ajax({
					method: 'Businese.BillLeaveDAL.QueryMyList',
					params: {
						Filter: {
							StartDate: '',
							EndDate: '',
							BillNoLike: '',
							State: null,
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
					if(res.data.hasOwnProperty('result')) {
						res.data.result.data.forEach(item => {
							item.billDateStr = util.formatDate(item.BillDate, 'yyyy-MM-dd');
							item.status = ['已取消', '申请', '已退货款', '已退保证金', '已收款确认', '退货款中'][item.State + 1];
							item.PayReturnItems.forEach(subItem => {
								subItem.PayTypeStr = ['现金', '银行转账', '支付宝', '微信'][subItem.PayType];
							});
						});
						this.dataArr = res.data.result.data;
						console.log(this.dataArr)
						console.log(this.userInfo)
					}
				});
				
			},
			bindDel(RecordId) {
				let me = this;
				util.dialog({
					content: '确定要删除吗？',
					success (e) {
						if(e.confirm) {
							util.showLoading();
							util.ajax({
								method: 'Businese.BillLeaveDAL.Cancel',
								params: {
									RecordId: RecordId
								},
								tags: {
									usertoken: me.openid
								}
							}).then(res => {
								util.hideLoading();
								util.showToast({
									title: '删除注销单成功',
									success() {
										setTimeout(() => {
											me.init();
										}, 1000);
									}
								});
							});
						}
					}
				});
			},
			bindConfirm(RecordId) {
				// (5)	退款确认：注销单审核后，可以进行退款确认操作。确认退款后，分销商成为注销状态，不能再登录系统，不能再进行任何操作
				util.showLoading();
				util.ajax({
					method: 'Businese.BillLeaveDAL.Confirm',
					params: {
						"RecordId" : RecordId /*订单Id [String]*/
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
				console.log(id);
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
