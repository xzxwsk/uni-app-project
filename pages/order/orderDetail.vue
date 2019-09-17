<template>
	<view class="order_detail">
		<view class="top">
			<image :src="bg" style="width: 100%;" mode="widthFix"></image>
			<view class="con">
				<text class="state">{{billObj.stateStr}}</text>
				<view class="menu_txt">
					<text class="title">{{ billObj.Address }}</text>
					<text class="title sub_txt">{{ billObj.Remark }}</text>
				</view>
			</view>
		</view>
		<view class="center">
			<scroll-view scroll-y="true" style="width: 100%; height: 100%;">
				<view class="uni-list">
					<view class="uni-list-cell" v-for="(value,key) in billObj.Items" :key="key">
						<view class="uni-media-list">
							<view class="uni-media-list-logo">
								<image v-if="showImg" mode="aspectFit" @error="imageError" :src="value.img"></image>
							</view>
							<view class="uni-media-list-body">
								<view>
									<view class="uni-media-list-text-top">{{value.ProductName}}</view>
									<view class="uni-media-list-text-top sub_txt">计量单位: {{value.UnitName}} &nbsp; &nbsp; 数量: {{value.Qty}}件</view>
									<view class="uni-media-list-text-top sub_txt">商品编号: {{value.ProductCode}}</view>
								</view>
								<view class="uni-media-list-text-bottom uni-ellipsis price">￥{{value.Amount}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-list count">
					<!-- <view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text>商品金额</text></text>
							<text class="item-content"><text>￥{{count.toFixed(2)}}</text></text>
						</view>
					</view> -->
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text class="b">合计金额</text></text>
							<text class="item-content"><text class="price">￥{{(count).toFixed(2)}}</text></text>
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
							<text class="item-content"><text>{{billObj.billDateStr}}</text></text>
						</view>
					</view>
				</view>
				<view class="empty"></view>
			</scroll-view>
		</view>
		<view class="result">
			<button class="btn">取消订单</button>
			<button class="btn" type="warn">确认收货</button>
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
	import bg from "@/static/images/cargo.png";
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			
		},
		computed: mapState(['openid']),
		data() {
			return {
				bg: bg,
				billObj: {
					"Items": []  /*订单明细*/,
					"RecordId": ""  /*单据Id*/,
					"BillCode": ""  /*单据编号*/,
					"BillDate": "2019-09-17T17:07:55.3032242+08:00"  /*单据日期*/,
					"DealerId": ""  /*订货经销商Id*/,
					"DealerCode": ""  /*订货经销商编号*/,
					"DealerName": ""  /*订货经销商姓名*/,
					"Remark": ""  /*备注*/,
					"Address": ""  /*收货地址*/,
					"Amount": 0.0  /*合计金额*/,
					"Creator": ""  /*录入人*/,
					"CreatorName": ""  /*录入人姓名*/,
					"CreateTime": "2019-09-17T17:07:55.3032242+08:00"  /*录入时间*/,
					"LastModifier": ""  /*最后修改人*/,
					"LastModifierName": ""  /*最后修改人姓名*/,
					"LastModifyTime": "2019-09-17T17:07:55.3032242+08:00"  /*最后修改时间*/,
					"StateChanged": false  /*状态是否发生过改变*/,
					"DealerIdSend": ""  /*发货经销商Id*/,
					"DealerCodeSend": ""  /*发货经销商编号*/,
					"DealerNameSend": ""  /*发货经销商姓名*/,
					"FreightInfo": ""  /*发货货运信息*/,
					"TimeStamp": ""  /*时间戳*/,
					"State": 1  /*单据状态*/,
					"ChangeType": 0,
					"IdValues": [
					  ""
					],
					"iState": 1
				},
				state: '待确认收货',
				addr: {
					name: 'wsk',
					phone: '17341303920',
					detail: '北京北京市东城区北京北京市东城区北京北京市东城区北京北京市东城区sdafdsafd'
				},
				showImg: false,
				orderLs: [],
				count: 278,
				freight: 212,
				orderNo: '2019073000000002',
				createOrder: '2019-07-30 10:59:03'
			}
		},
		onLoad(option) {
			if (option.hasOwnProperty('id')){
				let id = option.id;
				this.init(id)
			}
			this.billObj.billDateStr = util.formatDate(this.billObj.BillDate, 'yyyy-MM-dd');
			// this.orderLs = tpl.slice(0, 2);
			// setTimeout(() => {
			// 	this.showImg = true;
			// }, 400)
		},
		methods: {
			init(id) {
				util.ajax({
					method: 'Businese.OrderDAL.GetById',
					params: {
						RecordId: id
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					
				});
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
