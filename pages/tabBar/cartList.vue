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
					<view :class="'uni-list-cell' + item.hoverClass" v-for="(item, index) in cartLs" :key="index" @click="goDetail(index)" @touchstart="hoverClass(index)" @touchend="hoverClassEnd(index)">				
						<view class="uni-media-list">
							<radio class="radio" v-show="titleBtn==='完成'" color="#f23030" @click.stop="checkboxChange(index)" :value="item.title" :checked="item.selected" />
							<image class="uni-media-list-logo" mode="aspectFit" :src="item.img" @error="imageError"></image>
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top">{{ item.ProductName }}</view>
								<view class="uni-media-list-text-bottom">
									<text class="price">${{ item.Price.toFixed(2) }}</text>
									<view class="num">
										<button class="btn" @click.stop="reduce(index)">-</button>
										<input class="ipt" @click.stop="unEvent" type="number" v-model="item.Qty"></input>
										<button class="btn" @click.stop="add(index)">+</button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="result">
				<label class="radio"><radio color="#f23030" :checked="allSelect" @click="onAllSelect" />全选</label>
				<block v-if="titleBtn === '删除'">
					<view class="count b">合计：<text class="price">￥{{countPrice.toFixed(2)}}</text></view>
					<button class="btn" @click="toIndex">继续购物</button>
					<button class="btn" type="warn" @click="toPay">去结算</button>
				</block>
				<block v-else>
					<view class="count b"></view>
					<button class="btn" type="default">加入收藏</button>
					<button class="btn" type="warn" @click="bindDel">删除</button>
				</block>
			</view>
		</block>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	import defaultImg from '@/static/img/H_9X10_1.jpg';
	export default {
		computed: mapState(['hasLogin', 'openid']),
		data() {
			return {
				titleBtn: '删除',
				imgSrc: '/static/images/no_data_d.png',
				mode: 'widthFix',
				allSelect: false,
				countPrice: 0,
				getCartLs: [], // 保存取出来的源列表
				cartLs: [ // 显示列表
					// {
					// 	selected: false,
					// 	img: '/static/img/H_9X10_1.jpg',
					// 	title: '春·明前茶·4月5日  ,碧螺春,四品002,218g',
					// 	price: 130.00,
					// 	num: 1,
					// 	hoverClass: ''
					// },{
					// 	selected: false,
					// 	img: '/static/img/H_027_1.jpg',
					// 	title: '飘雪·五品·027  54 * 4g/袋（共54袋）',
					// 	price: 148.00,
					// 	num: 1,
					// 	hoverClass: ''
					// },{
					// 	selected: false,
					// 	img: '/static/img/H_023_180@200.JPG',
					// 	title: '绿·碧螺春·五品·023  54 * 4g/袋（共54袋）',
					// 	price: 139.00,
					// 	num: 1,
					// 	hoverClass: ''
					// },{
					// 	selected: false,
					// 	img: '/static/img/H_9X10_1.jpg',
					// 	title: '春·明前茶·4月5日  ,碧螺春,四品002,218g',
					// 	price: 130.00,
					// 	num: 1,
					// 	hoverClass: ''
					// },{
					// 	selected: false,
					// 	img: '/static/img/H_027_1.jpg',
					// 	title: '飘雪·五品·027  54 * 4g/袋（共54袋）',
					// 	price: 148.00,
					// 	num: 1,
					// 	hoverClass: ''
					// },{
					// 	selected: false,
					// 	img: '/static/img/H_023_180@200.JPG',
					// 	title: '绿·碧螺春·五品·023  54 * 4g/袋（共54袋）',
					// 	price: 139.00,
					// 	num: 1,
					// 	hoverClass: ''
					// }
				]
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			// let webView = this.$mp.page.$getAppWebview();
			// webView.setTitleNViewButtonStyle(0, {  
			// 	text: 'hello',  
			// });  
			// #endif 
			
			// this.cartLs = [];
			// uni.showTabBarRedDot({
			// 	index: 2
			// });
		},
		onShow() {
			this.getLs();
		},
		onNavigationBarButtonTap(e) {
			if(this.titleBtn === '删除') {
				// 选择状态
				this.titleBtn = '完成';
			} else {
				// 已选择
				this.titleBtn = '删除';
				// if (this.allSelect) {
				// 	// 全选状态 清空
				// 	util.ajax({
				// 		method: 'Businese.CartDAL.ClearCart',
				// 		params: {},
				// 		tags: {
				// 			usertoken: this.openid
				// 		}
				// 	}).then(res => {
				// 		util.showToast({
				// 			title: '清空成功'
				// 		});
				// 		this.cartLs = [];
				// 	});
				// 	return;
				// }
				// 批量删除选中
				let selectedArr = this.getSelectedArr();
				if (selectedArr.length > 0) {
					this.deleteLs(selectedArr);
				}
			}
			// #ifdef APP-PLUS
			let webView = this.$mp.page.$getAppWebview();
			webView.setTitleNViewButtonStyle(0, {
				text: this.titleBtn
			});
			// #endif 
			// let pages = getCurrentPages(); 
			// let page = pages[pages.length - 1]; 
			// let currentWebview = page.$getAppWebview()
			// currentWebview.setTitleNViewButtonStyle(0, {text:"删除"});
		},
		methods: {
			getLs() {
				util.ajax({
					method: 'Businese.CartDAL.GetUserCart',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					console.log('购物车列表：', res);
					this.getCartLs = res.data.result;
					let ls = res.data.result.map((item, index) => {
						let tempObj = JSON.parse(JSON.stringify(item));
						tempObj.selected = false;
						tempObj.img = defaultImg;
						tempObj.hoverClass = '';
						return tempObj;
					});
					this.cartLs = ls;
					this.allSelect = false;
					if (this.cartLs.length > 0) {
						this.titleBtn = '删除';
					} else {
						this.titleBtn = '';
					}
					// #ifdef APP-PLUS
					let webView = this.$mp.page.$getAppWebview();
					webView.setTitleNViewButtonStyle(0, {  
						text: this.titleBtn  
					});  
					// #endif 
				});
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			checkboxChange(index) {
				console.log('checkboxChange: ', index);
				this.$set(this.cartLs[index], 'selected', !this.cartLs[index]['selected']);
				this.$nextTick(() => {
					let selectedArr = this.getSelectedArr();
					if(this.cartLs.length > 0 && selectedArr.length === this.cartLs.length) {
						this.allSelect = true;
					} else {
						this.allSelect = false;
					}
				});
			},
			getSelectedArr() {
				let me = this;
				// 获取选中列表
				return this.cartLs.map((item, index) => {
					if(item.selected) {
						return me.getCartLs[index];
					}
					return false;
				});
			},
			goDetail(index) {
				util.goUrl({
					url: '../product/productDetail?id=' + this.getCartLs[index].ProductId
				});
			},
			unEvent() {},
			reduce(index) {
				this.$set(this.cartLs[index], 'Qty', Number(this.cartLs[index]['Qty'])-1);
			},
			add(index) {
				console.log('add: ', index);
				this.$set(this.cartLs[index], 'Qty', Number(this.cartLs[index]['Qty'])+1);
			},
			hoverClass(index) {
				console.log('hoverClass');
				this.$set(this.cartLs[index], 'hoverClass', ' uni-list-cell-hover');
			},
			hoverClassEnd(index) {
				console.log('hoverClassEnd');
				this.$set(this.cartLs[index], 'hoverClass', '');
			},
			// 全选
			onAllSelect() {
				if (this.cartLs.length < 1) {
					// 列表为空
					return;
				}
				this.allSelect = !this.allSelect;
				this.cartLs.forEach(item => {
					item.selected = this.allSelect;
				});
				// #ifdef APP-PLUS
				let webView = this.$mp.page.$getAppWebview();
				if(this.allSelect) {
					this.titleBtn = '完成';
				} else {
					this.titleBtn = '删除';
				}
				
				webView.setTitleNViewButtonStyle(0, {  
					text: this.titleBtn
				});
				// #endif 
			},
			toIndex() {
				util.goTab({
					url: './index'
				});
			},
			// 去结算
			toPay() {
				util.goUrl({
					url: '../order/createOrder?obj=' + JSON.stringify(this.cartLs)
				});
			},
			bindDel() {
				
			},
			deleteLs(arr) {
				// 批量删除选中
				var promiseArray = [];
				arr.forEach(item => {
					promiseArray.push(util.ajax({
						method: 'Businese.CartDAL.RemoveCartItem',
						params: {
							Item: item
						},
						tags: {
							usertoken: this.openid
						}
					}));
				});
				Promise.all(promiseArray)
				.then(values => {
					console.log('删除购物车列表：', values);
					util.showToast({
						title: '删除成功'
					});
					this.getLs();
				});
			}
		}
	}
</script>
