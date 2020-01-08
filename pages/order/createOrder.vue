<template>
	<view class="create_order">			
		<view class="uni-list-cell-navigate uni-navigate-right">
			<view class="menu_txt">
				<text class="title">{{ addr.name + ' ' + addr.phone }}</text>
				<text class="title sub_txt" @click="selectAddr">{{ addr.detail }}</text>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell" v-for="(value,key) in billObj.Items" :key="key">
				<view class="uni-media-list">
					<!-- <view class="uni-media-list-logo">
						<image v-if="showImg" mode="aspectFit" @error="imageError" :src="value.img"></image>
					</view> -->
					<view class="uni-media-list-body">
						<view>
							<view class="uni-media-list-text-top">{{value.ProductName}}</view>
							<view class="uni-media-list-text-top sub_txt">计量单位: {{value.UnitName}}</view>
							<view class="uni-media-list-text-top sub_txt">数量: {{value.Qty}}件</view>
						</view>
						<view class="uni-media-list-text-bottom uni-ellipsis price">￥{{value.Amount}}</view>
					</view>
				</view>
			</view>
		</view>
		<scroll-view class="box" scroll-y>
			<view class="uni-list count">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>订单编号</text></text>
						<text class="item-content"><text>{{billObj.BillCode}}</text></text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>订货日期</text></text>
						<text class="item-content"><text>{{billObj.BillDateStr}}</text></text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>商品金额</text></text>
						<text class="item-content"><text class="price">￥{{billObj.Amount}}</text></text>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<text class="item-title"><text>是否付款</text></text>
						<radio @tap="onIsPayChange" color="#f23030" :value="billObj.IsPay ? 'true' : 'false'" :checked="billObj.IsPay" />
					</view>
				</view>
				<block v-if="billObj.IsPay">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text>付款方式</text></text>
							<radio-group class="pay_type" name="payType" @change="changeMoneyType">
								<label class="label"><radio value="3" :checked="billObj.PayType === 3" color="#f23030" />微信</label>
								<label class="label"><radio value="2" :checked="billObj.PayType === 2" color="#f23030" />支付宝</label>
								<label class="label"><radio value="1" :checked="billObj.PayType === 1" color="#f23030" />银行转账</label>
								<label class="label"><radio value="0" :checked="billObj.PayType === 0" color="#f23030" />现金</label>
							</radio-group>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text>收款方账户</text></text>
							<input-box v-model="billObj.ReceiveAccountInfo" disabled></input-box>
						</view>
					</view>
					<block v-if="billObj.PayType === 1">
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="item-title"><text>付款银行</text><text style="color: #f33;">*</text></text>
								<input-box v-model="billObj.PayBank" placeholder="请输入付款银行"></input-box>
							</view>
						</view>
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="item-title"><text>付款户名</text><text style="color: #f33;">*</text></text>
								<input-box v-model="billObj.PayAccountName" placeholder="请输入付款方户名"></input-box>
							</view>
						</view>
					</block>
					<block v-if="billObj.PayType !== 0">
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="item-title"><text>付款方账户</text><text style="color: #f33;">*</text></text>
								<input-box v-model="billObj.PayAccountNo" :placeholder="placeholder"></input-box>
							</view>
						</view>
						<view class="uni-list-cell">
							<view class="uni-list-cell-navigate">
								<text class="item-title"><text>付款方账户信息</text></text>
								<input-box v-model="billObj.PayAccountInfo" placeholder="请输入付款方账户信息"></input-box>
							</view>
						</view>
					</block>
				</block>
			</view>
		</scroll-view>
		<view class="result">
			<view class="count b"><!-- <text class="price">￥{{(count+freight).toFixed(2)}}</text> --></view>
			<button class="btn" type="warn" @click="goMyOrder">生成订单</button>
		</view>
	</view>
</template>

<script>
	const tpl = [{
		selected: false,
		img: '/static/img/H_9X10_1.jpg',
		title: '春·明前茶·4月5日  ,碧螺春,四品002,218g',
		price: 130.00,
		num: 1,
		hoverClass: ''
	},{
		selected: false,
		img: '/static/img/H_027_1.jpg',
		title: '飘雪·五品·027  54 * 4g/袋（共54袋）',
		price: 148.00,
		num: 1,
		hoverClass: ''
	},{
		selected: false,
		img: '/static/img/H_023_180@200.JPG',
		title: '绿·碧螺春·五品·023  54 * 4g/袋（共54袋）',
		price: 139.00,
		num: 1,
		hoverClass: ''
	},{
		selected: false,
		img: '/static/img/H_9X10_1.jpg',
		title: '春·明前茶·4月5日  ,碧螺春,四品002,218g',
		price: 130.00,
		num: 1,
		hoverClass: ''
	},{
		selected: false,
		img: '/static/img/H_027_1.jpg',
		title: '飘雪·五品·027  54 * 4g/袋（共54袋）',
		price: 148.00,
		num: 1,
		hoverClass: ''
	},{
		selected: false,
		img: '/static/img/H_023_180@200.JPG',
		title: '绿·碧螺春·五品·023  54 * 4g/袋（共54袋）',
		price: 139.00,
		num: 1,
		hoverClass: ''
	}];
	
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import util from '@/common/util.js';
	import defaultImg from '@/static/img/2X1_1.jpg';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox
		},
		computed: mapState(['openid', 'userInfo']),
		data() {
			return {
				addr: {
					name: '',
					phone: '',
					detail: '请选择收获地址'
				},
				showImg: false,
				placeholder: '请输入收款人微信账号',
				orderLs: [],
				// freight: 212,
				billObj: {
				  "Items": []  /*订单明细*/,
				  "RecordId": ""  /*单据Id*/,
				  "BillCode": ""  /*单据编号*/,
				  "BillDate": ""  /*单据日期*/,
				  "DealerId": ""  /*订货经销商Id*/,
				  "DealerCode": ""  /*订货经销商编号*/,
				  "DealerName": ""  /*订货经销商姓名*/,
				  "Remark": ""  /*备注*/,
				  "Address": ""  /*收货地址*/,
				  "Amount": 0.0  /*合计金额*/,
				  "Creator": ""  /*录入人*/,
				  "CreatorName": ""  /*录入人姓名*/,
				  "CreateTime": ""  /*录入时间*/,
				  "LastModifier": ""  /*最后修改人*/,
				  "LastModifierName": ""  /*最后修改人姓名*/,
				  "LastModifyTime": ""  /*最后修改时间*/,
				  "StateChanged": false  /*状态是否发生过改变*/,
				  "DealerIdSend": ""  /*发货经销商Id*/,
				  "DealerCodeSend": ""  /*发货经销商编号*/,
				  "DealerNameSend": ""  /*发货经销商姓名*/,
				  "FreightInfo": ""  /*发货货运信息*/,
				  "ReturnTime": "2020-01-07T21:03:16.6363625+08:00"  /*退货发起时间*/,
				  "ReturnReason": ""  /*退货原因*/,
				  "ReturnFreightInfo": ""  /*退货货运信息*/,
				  "ReturnConfirmTime": "2020-01-07T21:03:16.6363625+08:00"  /*退货确认时间*/,
				  "SendTime": "2020-01-07T21:03:16.6363625+08:00"  /*发货时间*/,
				  "ReceiveConfirmTime": "2020-01-07T21:03:16.6363625+08:00"  /*收货确认时间*/,
				  "IsPay": false  /*是否付款*/,
				  "IsPayReturn": false  /*是否退款*/,
				  "PayType": 0  /*付款方式*/,
				  "ReceiveAccountInfo": ""  /*收款方账户信息*/,
				  "PayBank": ""  /*付款银行*/,
				  "PayAccountNo": ""  /*付款账户*/,
				  "PayAccountName": ""  /*付款户名*/,
				  "PayAccountInfo": ""  /*付款方账户信息*/,
				  "TimeStamp": ""  /*时间戳*/,
				  "State": 0  /*单据状态*/,
				  "ChangeType": 0,
				  "IdValues": [
					""
				  ],
				  "iState": 1
				} /*订单 [Order]*/
			}
		},
		onLoad(option) {
			// 获取商品详情
			if (option.hasOwnProperty('obj')) {
				// 购物车进入结算
				this.orderLs = JSON.parse(option.obj);
				// this.orderLs.forEach(item => {
				// 	item.img = (item.hasOwnProperty('SmallImageBase64') && item.SmallImageBase64 !== null && item.SmallImageBase64 !== ' ') ? ('data:image/jpeg;base64,' + item.SmallImageBase64) : defaultImg;
				// });
				this.init();
			} else if (option.hasOwnProperty('id')) {
				// 商品详情进入结算
				this.init(option.id);
			}
		},
		methods: {
			async init(id) {
				if(id) {
					// 商品详情进入结算
					let CartItemIds = this.orderLs.map(item => item.Id);
					await util.ajax({
						method: 'Businese.OrderDAL.CreateDefaultByProductId',
						params: {
							ProductIds: [id]
						},
						tags: {
							usertoken: this.openid
						}
					}).then(res => {
						let data = res.data.result;
						console.log('生成默认订单：', data);
						this.billObj = data;
					});
				} else {
					console.log('购买商品列表：', this.orderLs);
					// 生成默认订单
					let CartItemIds = this.orderLs.map(item => item.Id);
					await util.ajax({
						method: 'Businese.OrderDAL.CreateDefault',
						params: {
							CartItemIds: CartItemIds
						},
						tags: {
							usertoken: this.openid
						}
					}).then(res => {
						let data = res.data.result;
						console.log('生成默认订单：', data);
						this.billObj = data;
					});
				}
				this.billObj.BillDateStr = util.formatDate(this.billObj.BillDate, 'yyyy-MM-dd');;
				setTimeout(() => {
					this.showImg = true;
				}, 400);
			},
			selectAddr() {
				util.goUrl({
					url: '../addr/addr?mode=select'
				});
			},
			goMyOrder() {
				if (this.addr.name === '' && this.addr.phone === '') {
					util.showToast({
						title: '请选择收货地址'
					});
					return;
				}
				this.billObj.Address = this.addr.detail;
				if (this.billObj.PayType === 1) {
					if (this.billObj.PayBank === '' || this.billObj.PayAccountName === '') {
						util.showToast({
							title: '请输入付款银行和付款户名'
						});
						return;
					}
				}
				if (this.billObj.PayType !== 0) {
					if (this.billObj.PayAccountNo === '') {
						util.showToast({
							title: '请输入付款账户'
						});
						return;
					}
				}
				// 生成订单
				util.ajax({
					method: 'Businese.OrderDAL.Create',
					params: {
						Bill: this.billObj
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					// util.goUrl({
					// 	url: './myOrder'
					// });
					util.showToast({
						title: '订单创建成功',
						success() {
							setTimeout(() => {
								uni.navigateBack();
							}, 1000);
						}
					});
				});
			},
			onIsPayChange(e){
				this.$set(this.billObj, 'IsPay', !this.billObj.IsPay);
			},
			changeMoneyType(e) {
				// 付款方式
				this.billObj.PayType = Number(e.target.value);
				if (e.target.value === '3') {
					this.placeholder = '请输入付款人微信账号';
				} else if (e.target.value === '2') {
					this.placeholder = '请输入付款人支付宝账号';
				} else if (e.target.value === '1') {
					this.placeholder = '请输入付款人银行账号';
				}
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
