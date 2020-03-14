<template>
	<view class="product_detail">
		<view class="top" ref="top">
			<text :class="'txt' + (tabCur===0 ? ' cur' : '')" @click="goTop">商品</text><text :class="'txt' + (tabCur===1 ? ' cur' : '')" @click="goDetail">详情</text>
		</view>
		<view class="center">
			<scroll-view scroll-y :scroll-top="scrollTop" style="height: 1130upx;" @scroll="scroll" scroll-with-animation>
				<view class="swiper_box">
					<swiper class="swiper" :indicator-dots="indicatorDots" :indicator-active-color="indicatorActiveColor" :indicator-color="indicatorColor" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item v-for="(item, index) in imgLs" :key="index">
							<view class="swiper-item">
								<image style="width: 100%;" mode="scaleToFit" :src="item" @error="imageError"></image>
							</view>
						</swiper-item>                        
					</swiper>
				</view>
				<view class="intro">
					<view class="price flex">
						<view class="old_price"><text class="sub">￥</text>{{detail.Price}}<text class="sub">.00</text></view>
						<view><text class="sub">￥</text>{{detail.FactPrice}}<text class="sub">.00</text></view>
					</view>
					<view class="title">{{detail.Name}}</view>
					<view>{{detail.Remark}}</view>
				</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<!-- <view class="uni-list-cell-navigate uni-navigate-right" @click="openPopup"> -->
						<view class="uni-list-cell-navigate">
							<view class="menu_txt">
								<text class="title">计量单位</text>
								<text class="title sub_txt">{{detail.Spec}}/{{detail.Unit}} （{{detail.TypeName}}）</text>
							</view>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<view class="menu_txt num_box">
								<view class="title">数量</view>
								<view class="title num">
									<button class="btn" @click="reduce">-</button>
									<input class="ipt" type="number" v-model="num"></input>
									<button class="btn" @click="add">+</button>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="detail" id="detail">
					<view class="title">--商品详情--</view>
					<view>{{detail.Description}}</view>
				</view>
			</scroll-view>
		</view>
		<view class="result">
			<button class="btn btn_yellow" @click="goCartLs">加入购物车</button>
			<button class="btn" type="warn" @click="goCreateOrder">立即付款</button>
		</view>
		
		<uni-popup ref="popup" type="bottom">
			<view class="pop">
				<button class="uni-icon uni-icon-closeempty close_btn" @click="closePopup"></button>
				<view class="con">
					<view class="img">
						<image :src="img" style="width: 300upx; height: 300upx;" mode="widthFix" />
						<view class="right_txt">
							<view class="price"><text class="sub">￥</text>148<text class="sub">.00</text></view>
							<view class="unit">积分：111</view>
						</view>
					</view>
					<view class="title">计量单位</view>
					<view class="ls">
						<view class="item" @click="selectItemFun(index)" v-for="(item, index) in modeLs" :key="index" :class="selectItem === index ? 'cur': ''">
							{{item}}
						</view>
					</view>
					<view class="num_box">
						<view class="title">数量</view>
						<view class="num">
							<button class="btn" @click="reduce">-</button>
							<input class="ipt" type="number" v-model="num"></input>
							<button class="btn" @click="add">+</button>
						</view>
					</view>
				</view>
				<button type="warn" @click="closePopup('confirm')">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import defaultImg from '@/static/img/2X1_1.jpg';
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			uniPopup
		},
		computed: mapState(['openid']),
		data() {
			return {
				detail: {},
				tabCur: 0,
				topHeight: 0,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				loca1: 0,				
				isClick: false,
				indicatorDots: true,
				indicatorColor: '#fff',
				indicatorActiveColor: '#fff',
				autoplay: true,
				interval: 50000,
				duration: 500,
				imgLs: ['/static/img/2X1_6.jpg',
					'/static/img/2X1_2.jpg',
					'/static/img/2X1_1.jpg',
					'/static/img/2X1_5.jpg'],
				img: '/static/img/2X1_6.jpg',
				modeLs: ['54 * 4g/袋（共54袋）', '125 * 4g/袋（共500g）', '24 * 4g/袋（共24袋）'],
				selectItem: 0,
				num: 1,
				clickType: ''
			}
		},
		onLoad(option) {
			this.getDetail(option.id);
		},
		methods: {
			getDetail(id) {
				this.imgLs = [];
				util.showLoading();
				util.ajax({
					method: 'Basic.ProductDAL.GetById',
					params: {
						RecordId: id
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					// this.imgLs.push((res.data.result.BigImageBase64 !== null && res.data.result.BigImageBase64 !== ' ' && res.data.result.BigImageBase64 !== '') ? ('data:image/jpeg;base64,' + res.data.result.BigImageBase64) : defaultImg);
					this.imgLs.push((res.data.result.BigImageBase64 && res.data.result.BigImageBase64 !== ' ') ? util.getBaseUrl() + 'files/downloadfile?filename=' + res.data.result.BigImageBase64 : '');
					this.detail = res.data.result;
					this.$nextTick(() => {
						let me = this;
						const query = uni.createSelectorQuery();
						query.select('#detail').boundingClientRect();
						query.selectViewport().scrollOffset();
						query.exec(function(offset){
							console.log('offset: ', offset);
							me.loca1 = offset[0].top;
						});
						this.topHeight = 42;
					})
				});
			},
			async goCartLs() {
				// 加入购物车
				util.showLoading();
				await util.ajax({
					method: 'Businese.CartDAL.AddToCart',
					params: {
						ProductId: this.detail.RecordId,
						Qty: this.num
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					util.showToast({
						title: '加入购物车成功'
					});
				});
				
			},
			goCreateOrder() {
				util.goUrl({
					url: '../order/createOrder?id=' + this.detail.RecordId
				});
			},
			goTop() {
				let me = this;
				this.tabCur = 0;
				this.scrollTop = this.old.scrollTop;
				this.$nextTick(function() {
					me.scrollTop = 0
				});
			},
			goDetail() {
				let me = this;
				this.tabCur = 1;
				this.scrollTop = this.old.scrollTop;
				this.$nextTick(function() {
					me.scrollTop = me.loca1 - me.topHeight;
					me.isClick = true;
				});
			},
			scroll(e) {
				if (this.isClick) {
					setTimeout(()=>{
						this.isClick = false;
					}, 1000);
					return;
				}
				this.old.scrollTop = e.detail.scrollTop;
				if(e.detail.scrollTop >= (this.loca1 - this.topHeight)) {
					this.tabCur = 1;
				} else {
					this.tabCur = 0;
				}
			},
			openPopup(){
				this.$refs.popup.open()
			},
			closePopup(str){
				this.$refs.popup.close()
				if (str === 'confirm') {
					// 点击确定
					if (this.clickType === 'addCart') {
						// 加入购物车
						this.goCartLs();
					} else if (this.clickType === 'pay') {
						// 立即付款
						
					}
				}
			},
			selectItemFun(index) {
				this.selectItem = index;
			},
			reduce() {
				if (Number(this.num)-1 < 1) {
					this.num = 1;
					return;
				}
				this.num = Number(this.num)-1;
			},
			add() {
				this.num = Number(this.num)+1;
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
