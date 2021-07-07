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
					<view :class="'uni-list-cell' + item.hoverClass" v-for="(item, index) in cartLs" :key="index" @touchstart="hoverClass(index)" @touchend="hoverClassEnd(index)">				
						<view class="uni-media-list">
							<radio class="radio" color="#f23030" @click.stop="checkboxChange(index)" :value="item.title" :checked="item.selected" />
							<!-- <image class="uni-media-list-logo" mode="aspectFit" :src="item.img" @error="imageError"></image> -->
							<view class="uni-media-list-body" @click="goDetail(index)">
								<view class="uni-media-list-text-top">{{ item.ProductName }}</view>
								<view class="uni-media-list-text-bottom">
									<text class="price">${{ item.Price.toFixed(2) }}</text>
									<view class="num">
										<button class="btn" @click.stop="reduce(index)">-</button>
										<input class="ipt" @click.stop="unEvent" type="number" :data-index="index" @input="onChangeNum" v-model="item.Qty"></input>
										<button class="btn" @click.stop="add(index)">+</button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="result">
				<label class="radio" @click="onAllSelect"><radio color="#f23030" :checked="allSelect" />全选</label>
				<block v-if="selectedArr.length > 0">
					<view class="count b">合计：<text class="price">￥{{countPrice.toFixed(2)}}</text></view>
					<button class="btn" type="default">加入收藏</button>
					<button class="btn" type="warn" @click="toPay">去结算</button>
				</block>
				<block v-else>
					<view class="count b"></view>
					<button class="btn" @click="toIndex">继续购物</button>
					<!-- <button class="btn" type="warn" @click="bindDel">删除</button> -->
				</block>
			</view>
		</block>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		computed: mapState(['hasLogin', 'openid']),
		data() {
			return {
				onLoadFlag: false,
				titleBtn: '删除',
				imgSrc: util.getImgUrl() + '/static/images/no_data_d.png',
				mode: 'widthFix',
				allSelect: false,
				countPrice: 0,
				selectedArr: [],
				getCartLs: [], // 保存取出来的源列表
				cartLs: [] // 显示列表
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
			console.log('cartList load');
			if (!this.onLoadFlag) {
				this.getLs();
				this.onLoadFlag = true;
			}
		},
		onShow() {
			console.log('mounted');
			if(this.onLoadFlag) {
				this.getLs();
			}
		},
		onPullDownRefresh() {
			console.log('下拉刷新');
			// 下拉刷新
			if(this.onLoadFlag) {
				this.getLs();
			}
		},
		onNavigationBarButtonTap(e) {
			// 批量删除选中
			this.selectedArr = this.getSelectedArr();
			if (this.selectedArr.length > 0) {
				this.deleteLs(this.selectedArr);
			}
			/*
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
			}
			*/
			// #ifdef APP-PLUS
			/*
			let webView = this.$mp.page.$getAppWebview();
			webView.setTitleNViewButtonStyle(0, {
				text: this.titleBtn
			});
			*/
			// #endif 
			// let pages = getCurrentPages(); 
			// let page = pages[pages.length - 1]; 
			// let currentWebview = page.$getAppWebview()
			// currentWebview.setTitleNViewButtonStyle(0, {text:"删除"});
		},
		methods: {
			getLs() {
				// if (!this.hasLogin) {
				// 	this.goLogin();
				// 	return;
				// }
				util.showLoading();
				util.ajax({
					method: 'Businese.CartDAL.GetUserCart',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					console.log('购物车列表：', res);
					this.getCartLs = res.data.result;
					let ls = res.data.result.map((item, index) => {
						let tempObj = JSON.parse(JSON.stringify(item));
						tempObj.selected = false;
						tempObj.hoverClass = '';
						return tempObj;
					});
					this.cartLs = ls;
					this.allSelect = false;
					this.selectedArr = [];
					if (this.cartLs.length > 0) {
						this.titleBtn = '删除';
					} else {
						this.titleBtn = '';
					}
					this.countPriceFun();
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
			goLogin() {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					// showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.reLaunch({
								url: '../login/login'
							});
						}
					}
				});
			},
			countPriceFun() {
				this.countPrice = 0;
				this.cartLs.forEach(item => {
					if(item.selected) {
						this.countPrice += item.Price * item.Qty;
					}
				});
			},
			checkboxChange(index) {
				console.log('checkboxChange: ', index);
				this.$set(this.cartLs[index], 'selected', !this.cartLs[index]['selected']);
				this.countPriceFun();
				this.$nextTick(() => {
					this.selectedArr = this.getSelectedArr();
					if(this.cartLs.length > 0 && this.selectedArr.length === this.cartLs.length) {
						this.allSelect = true;
					} else {
						this.allSelect = false;
					}
				});
			},
			getSelectedArr() {
				// 获取选中列表
				return this.cartLs.filter((item, index) => {
					return item.selected;
				});
			},
			goDetail(index) {
				util.goUrl({
					url: '../product/productDetail?id=' + this.getCartLs[index].ProductId
				});
			},
			unEvent() {},
			reduce(index) {
				this.$set(this.cartLs[index], 'Qty', Math.max(Number(this.cartLs[index]['Qty'])-1, 0));
				this.updateCartItem(index);
				this.countPriceFun();
			},
			add(index) {
				this.$set(this.cartLs[index], 'Qty', Number(this.cartLs[index]['Qty'])+1);
				this.updateCartItem(index);
				this.countPriceFun();
			},
			onChangeNum(e) {
				console.log(e.target);
				if(e.target.value){
					let index = Number(e.target.dataset.index);
					this.$set(this.cartLs[index], 'Qty', Number(e.target.value));
					this.updateCartItem(index);
					this.countPriceFun();
				}
			},
			updateCartItem(index) {
				util.showLoading();
				util.ajax({
					method: 'Businese.CartDAL.UpdateCartItem',
					params: {
						Item: this.cartLs[index]
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					let data = res.data.result;
					console.log('更新购物车：', data);
				});
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
				this.selectedArr = this.getSelectedArr();
				this.countPriceFun();
				// #ifdef APP-PLUS
				// let webView = this.$mp.page.$getAppWebview();
				// if(this.allSelect) {
				// 	this.titleBtn = '完成';
				// } else {
				// 	this.titleBtn = '删除';
				// }
				
				// webView.setTitleNViewButtonStyle(0, {  
				// 	text: this.titleBtn
				// });
				// #endif 
			},
			toIndex() {
				util.goTab({
					url: './index'
				});
				// util.goUrl({
				// 	url: '../order/orderDetail'
				// });
			},
			// 去结算
			toPay() {
				let selectCartLs = this.cartLs.filter(item => item.selected);
				util.goUrl({
					url: '../order/createOrder?obj=' + JSON.stringify(selectCartLs)
				});
			},
			bindDel() {
				this.selectedArr = this.getSelectedArr();
				if (this.selectedArr.length > 0) {
					this.deleteLs(this.selectedArr);
				}
			},
			deleteLs(arr) {
				util.showLoading();
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
					util.hideLoading();
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
