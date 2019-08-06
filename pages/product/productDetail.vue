<template>
	<view class="product_detail">
		<view class="top" ref="top">
			<text :class="'txt' + (tabCur===0 ? ' cur' : '')" @tap="goTop">商品</text><text :class="'txt' + (tabCur===1 ? ' cur' : '')" @tap="goDetail">详情</text>
		</view>
		<view class="center">
			<scroll-view scroll-y="true" :scroll-top="scrollTop" style="width: 100%; height: 100%;" @scroll="scroll" scroll-with-animation>
				<view class="swiper_box">
					<swiper class="swiper" :indicator-dots="indicatorDots" :indicator-active-color="indicatorActiveColor" :indicator-color="indicatorColor" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item v-for="(item, index) in imgLs" :key="index">
							<view class="swiper-item">
								<image style="width: 100%;" :mode="mode" :src="item" @error="imageError"></image>
							</view>
						</swiper-item>                        
					</swiper>
				</view>
				<view class="intro">
					<view class="price"><text class="sub">￥</text>148<text class="sub">.00</text></view>
					<view class="title">飘雪·五品·027</view>
					<view>茶芽和茉莉花的组合，正如职场女性和工作的完美融合，一杯茉莉花茶，让您在工作彰显自信的风采！</view>
				</view>
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate uni-navigate-right" @tap="openPopup">
							<view class="menu_txt">
								<text class="title">计量单位</text>
								<text class="title sub_txt">54 * 4g/袋（共54袋）,1件</text>
							</view>
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<view class="menu_txt">
								<text class="title">单位积分</text>
								<text class="title sub_txt">111</text>
							</view>
						</view>
					</view>
				</view>
				<view class="detail" id="detail">
					<view class="title">--宝贝详情--</view>
				</view>
			</scroll-view>
		</view>
		<view class="result">
			<button class="btn btn_yellow">加入购物车</button>
			<button class="btn" type="warn">立即付款</button>
		</view>
		
		<uni-popup ref="popup" type="bottom">
			<view class="pop">
				<button class="uni-icon uni-icon-closeempty close_btn" @tap="closePopup"></button>
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
						<view class="item" @tap="selectItemFun(index)" v-for="(item, index) in modeLs" :key="index" :class="selectItem === index ? 'cur': ''">
							{{item}}
						</view>
					</view>
					<view class="num_box">
						<view class="title">数量</view>
						<view class="num">
							<button class="btn" @tap="reduce">-</button>
							<input class="ipt" type="number" v-model="num"></input>
							<button class="btn" @tap="add">+</button>
						</view>
					</view>
				</view>
				<button type="warn" @tap="closePopup">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
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
				mode: 'scaleToFit',
				imgLs: ['/static/img/飘雪1号内容图_2X1_6.jpg',
					'/static/img/飘雪1号内容图_2X1_2.jpg',
					'/static/img/飘雪1号内容图_2X1_1.jpg',
					'/static/img/飘雪1号内容图_2X1_5.jpg'],
				img: '/static/img/飘雪1号内容图_2X1_6.jpg',
				modeLs: ['54 * 4g/袋（共54袋）', '125 * 4g/袋（共500g）', '24 * 4g/袋（共24袋）'],
				selectItem: 0,
				num: 1
			}
		},
		onLoad() {
			
		},
		mounted() {
			let me = this;
			const query = uni.createSelectorQuery();
			query.select('#detail').boundingClientRect();
			query.selectViewport().scrollOffset();
			query.exec(function(res){
				console.log(res);
				me.loca1 = res[0].top;
			});
			this.topHeight = this.$refs.top.$el.clientHeight;
		},
		methods: {
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
			closePopup(){
				this.$refs.popup.close()
			},
			selectItemFun(index) {
				this.selectItem = index;
			},
			reduce() {
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
