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
							<view class="uni-media-list-text-top">{{value.title}}</view>
							<view class="uni-media-list-text-top sub_txt">计量单位: {{value.num}}</view>
							<view class="uni-media-list-text-top sub_txt">数量: {{value.num}}件</view>
						</view>
						<view class="uni-media-list-text-bottom uni-ellipsis price">￥{{value.price}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-list count">
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate">
					<text class="item-title"><text>订单编号</text></text>
					<text class="item-content"><text>Adfd82dfdfds</text></text>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate">
					<text class="item-title"><text>订货日期</text></text>
					<text class="item-content"><text>2018-05-21</text></text>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate">
					<text class="item-title"><text>商品金额</text></text>
					<text class="item-content"><text class="price">￥{{count.toFixed(2)}}</text></text>
				</view>
			</view>
		</view>
		<view class="result">
			<view class="count b"><text class="price">￥{{(count+freight).toFixed(2)}}</text></view>
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
	export default {
		components: {
			
		},
		data() {
			return {
				addr: {
					name: 'wsk',
					phone: '17341303920',
					detail: '北京北京市东城区sdafdsafd'
				},
				showImg: false,
				orderLs: [],
				count: 111,
				freight: 212
			}
		},
		onLoad() {
			this.orderLs = tpl.slice(0, 2);
			setTimeout(() => {
				this.showImg = true;
			}, 400)
		},
		methods: {
			selectAddr() {
				util.goUrl({
					url: '../addr/addr'
				});
			},
			goMyOrder() {
				util.goUrl({
					url: './myOrder'
				});
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
