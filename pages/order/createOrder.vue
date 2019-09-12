<template>
	<view class="create_order">			
		<view class="uni-list-cell-navigate uni-navigate-right">
			<view class="menu_txt">
				<text class="title">{{ addr.name + ' ' + addr.phone }}</text>
				<text class="title sub_txt" @click="selectAddr">{{ addr.detail }}</text>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell" v-for="(value,key) in orderLs" :key="key">
				<view class="uni-media-list">
					<view class="uni-media-list-logo">
						<image v-if="showImg" mode="aspectFit" @error="imageError" :src="value.img"></image>
					</view>
					<view class="uni-media-list-body">
						<view>
							<view class="uni-media-list-text-top">{{value.Name}}</view>
							<view class="uni-media-list-text-top sub_txt">计量单位: {{value.UnitName}}</view>
							<view class="uni-media-list-text-top sub_txt">数量: {{value.num}}件</view>
						</view>
						<view class="uni-media-list-text-bottom uni-ellipsis price">￥{{value.Amount}}</view>
					</view>
				</view>
			</view>
		</view>
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
					<text class="item-content"><text>{{billObj.BillDate}}</text></text>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate">
					<text class="item-title"><text>商品金额</text></text>
					<text class="item-content"><text class="price">￥{{billObj.Amount}}</text></text>
				</view>
			</view>
		</view>
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
	
	import util from '@/common/util.js';
	import defaultImg from '@/static/img/2X1_1.jpg';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			
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
				this.orderLs.forEach(item => {
					item.num = Number(item.num);
					item.img = (item.hasOwnProperty('SmallImageBase64') && item.SmallImageBase64 !== null && item.SmallImageBase64 !== ' ') ? ('data:image/jpeg;base64,' + item.SmallImageBase64) : defaultImg;
				});
			} else {
				// 商品详情进入结算
				let obj = {};
				for(let key in option) {
					obj[key] = option[key] !== 'null' ? option[key] : obj[key];
				}
				obj.num = Number(obj.num);
				obj.img = (obj.hasOwnProperty('SmallImageBase64') && obj.SmallImageBase64 !== null && obj.SmallImageBase64 !== ' ') ? ('data:image/jpeg;base64,' + obj.SmallImageBase64) : defaultImg;
				this.orderLs.push(obj);
			}			
			this.init();
		},
		methods: {
			init() {
				console.log('购买商品列表：', this.orderLs);
				if (this.orderLs.length < 1) {
					this.orderLs = tpl.slice(0, 2);
				}				
				let amount = 0; // 总金额
				this.orderLs.forEach(item => {
					item.Amount = Number(((item.FactPrice || 0) * (item.num || 1)).toFixed(2));
					amount += item.Amount; // 总金额
					item.DtlId = '';
					item.CartItemId = item.CartItemId || '';
					item.ProductCode = item.ProductCode || item.Code;
					item.ProductName = item.ProductName || item.Name;
					item.UnitName = item.UnitName || item.Unit;
					item.Qty = item.num;
					item.Price = item.FactPrice;
				});
				this.billObj.Amount = amount;
				this.billObj.Items = this.billObj.Items.concat(this.orderLs);
				this.billObj.BillDate = util.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
				this.billObj.CreateTime = this.billObj.LastModifyTime = this.billObj.BillDate;
				this.billObj.DealerId = this.userInfo.DealerId;
				this.billObj.DealerCode = this.userInfo.DealerNo;
				this.billObj.DealerName = this.userInfo.DealerName;
				this.billObj.Address = this.addr.detail;
				this.billObj.Creator = this.userInfo.DealerId;
				this.billObj.CreatorName = this.userInfo.DealerName;
				this.billObj.LastModifier = this.userInfo.DealerId;
				this.billObj.LastModifierName = this.userInfo.DealerName;
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
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
