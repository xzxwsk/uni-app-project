<template>
	<view class="order_detail">
		<view class="top">
			<image :src="bg" style="width: 100%;" mode="widthFix"></image>
			<view class="con">
				<text class="state">{{state}}</text>
				<view class="menu_txt">
					<text class="title">{{ addr.name + ' ' + addr.phone }}</text>
					<text class="title sub_txt">{{ addr.detail }}</text>
				</view>
			</view>
		</view>
		<view class="center">
			<scroll-view scroll-y="true" style="width: 100%; height: 100%;">
				<view class="uni-list">
					<view class="uni-list-cell" v-for="(value,key) in orderLs" :key="key">
						<view class="uni-media-list">
							<view class="uni-media-list-logo">
								<image v-if="showImg" mode="aspectFit" @error="imageError" :src="value.img"></image>
							</view>
							<view class="uni-media-list-body">
								<view>
									<view class="uni-media-list-text-top">{{value.title}}</view>
									<view class="uni-media-list-text-top sub_txt">计量单位: {{value.num}} &nbsp; &nbsp; 数量: {{value.num}}件</view>
									<view class="uni-media-list-text-top sub_txt">商品编号: {{value.num}}</view>
								</view>
								<view class="uni-media-list-text-bottom uni-ellipsis price">￥{{value.price}}</view>
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
							<text class="item-content"><text>{{orderNo}}</text></text>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text class="item-title"><text>订货日期</text></text>
							<text class="item-content"><text>{{createOrder}}</text></text>
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
	export default {
		components: {
			
		},
		data() {
			return {
				bg: bg,
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
		onLoad() {
			this.orderLs = tpl.slice(0, 2);
			setTimeout(() => {
				this.showImg = true;
			}, 400)
		},
		methods: {			
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
