<template>
	<view class="uni-padding-wrap uni-common-pb cart_ls">
		<view class="no-data" v-if="cartLs.length < 1">
			<view class="no-img cart">
				<image style="width: 100%;" :mode="mode" :src="imgSrc" @error="imageError"></image>
			</view>
			<view class="txt"><text>亲，您的购物车还没有宝贝哦~</text></view>
			<view class="txt a"><navigator open-type="switchTab" animation-type="pop-in" animation-duration="300" url="./index">去逛逛</navigator></view>
		</view>
		<block v-else>
			<scroll-view scroll-y="true" style="width: 100%; height: 100%;">
				<view class="uni-list">
					<view :class="'uni-list-cell' + item.hoverClass" v-for="(item, index) in cartLs" :key="index" @tap="goDetail(index)" @touchstart="hoverClass(index)" @touchend="hoverClassEnd(index)">				
						<view class="uni-media-list">
							<radio class="radio" @touchstart.stop="unEvent" @tap.stop="checkboxChange(index)" :value="item.title" :checked="item.selected" />
							<image class="uni-media-list-logo" mode="aspectFit" :src="item.img" @error="imageError"></image>
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top">{{ item.title }}</view>
								<view class="uni-media-list-text-bottom">
									<text class="price">${{ item.price.toFixed(2) }}</text>
									<view class="num" @touchstart.stop="unEvent" @tap.stop="unEvent">
										<button class="btn" @tap.stop="reduce(index)">-</button>
										<input class="ipt" type="number" v-model="item.num"></input>
										<button class="btn" @tap.stop="add(index)">+</button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>		
			<view class="result">
				<label class="radio"><radio :checked="allSelect" />全选</label>
				<view class="count b">合计：<text class="price">￥{{countPrice.toFixed(2)}}</text></view>
				<button class="btn" type="primary">去结算</button>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgSrc: '/static/images/no_data_d.png',
				mode: 'widthFix',
				allSelect: false,
				countPrice: 0,
				cartLs: [{
					selected: false,
					img: '/static/img/H_二品峨眉毛峰_9X10_1.jpg',
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
					img: '/static/img/H_二品峨眉毛峰_9X10_1.jpg',
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
				}]
			}
		},
		onLoad() {
			uni.setTabBarBadge({
				index: 2,
				text: '12'
			});
			// #ifdef APP-PLUS
			let webView = this.$mp.page.$getAppWebview();
			webView.setTitleNViewButtonStyle(0, {  
				text: 'hello',  
			});  
			// #endif 
			
			// this.cartLs = [];
			// uni.showTabBarRedDot({
			// 	index: 2
			// });
		},
		methods: {
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			checkboxChange(index) {
				console.log('checkboxChange: ', index);
				this.$set(this.cartLs[index], 'selected', !this.cartLs[index]['selected']);
			},
			goDetail(index) {
				console.log('goDetail: ', index);
			},
			unEvent() {},
			reduce(index) {
				this.$set(this.cartLs[index], 'num', Number(this.cartLs[index]['num'])-1);
			},
			add(index) {
				this.$set(this.cartLs[index], 'num', Number(this.cartLs[index]['num'])+1);
			},
			hoverClass(index) {
				console.log('hoverClass');
				this.$set(this.cartLs[index], 'hoverClass', ' uni-list-cell-hover');
			},
			hoverClassEnd(index) {
				console.log('hoverClassEnd');
				this.$set(this.cartLs[index], 'hoverClass', '');
			}
		}
	}
</script>
