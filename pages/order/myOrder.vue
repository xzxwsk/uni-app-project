<template>
	<view class="order">			
		<view class="uni-tab-bar">
			<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view class="tab_head">
					<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" :class="tabIndex==index ? 'active' : ''"
					 :id="tab.id" :data-current="index" @click="tapTab">{{tab.name}}</view>
				 </view>
			</scroll-view>
			<swiper :current="tabIndex" class="swiper-box" :duration="300" @change="changeTab">
				<swiper-item v-for="(tab, index1) in newsitems" :key="index1">
					<block v-if="!tab.data.length">
						<view class="no-data">
							<view class="no-img cart">
								<image style="width: 100%;" :mode="mode" :src="imgSrc" @error="imageError"></image>
							</view>
							<view class="txt"><text>亲，还没有相关订单哦~</text></view>
						</view>
					</block>
					<block v-else>
						<scroll-view class="list" scroll-y @scrolltolower="loadMore(index1)">
							<block v-for="(newsitem,index2) in tab.data" :key="index2">
								<view class="uni-product-list">
									<view class="uni-product" v-for="(product,index) in newsitem" :key="index">
										<view class="image-view">
											<image v-if="renderImage" class="uni-product-image" :src="product.image"></image>
										</view>
										<view class="uni-product-title">{{product.title}}</view>
										<view class="uni-product-price">
											<text class="uni-product-price-favour">￥{{product.originalPrice}}</text>
											<text class="uni-product-price-original">￥{{product.favourPrice}}</text>
											<text class="uni-product-tip">{{product.tip}}</text>
										</view>
									</view>
								</view>
							</block>
							<view class="uni-tab-bar-loading">
								{{tab.loadingText}}
							</view>
						</scroll-view>
					</block>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	const tpl = {
		data0: [
			{
				image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product1.jpg',
				title: 'Apple iPhone X 256GB 深空灰色 移动联通电信4G手机',
				originalPrice: 9999,
				favourPrice: 8888,
				tip: '自营'
			},
			{
				image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product2.jpg',
				title: 'Apple iPad 平板电脑 2018年新款9.7英寸',
				originalPrice: 3499,
				favourPrice: 3399,
				tip: '优惠'
			},
			{
				image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product3.jpg',
				title: 'Apple MacBook Pro 13.3英寸笔记本电脑（2017款Core i5处理器/8GB内存/256GB硬盘 MupxT2CH/A）',
				originalPrice: 12999,
				favourPrice: 10688,
				tip: '秒杀'
			},
			{
				image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product4.jpg',
				title: 'Kindle Paperwhite电纸书阅读器 电子书墨水屏 6英寸wifi 黑色',
				originalPrice: 999,
				favourPrice: 958,
				tip: '秒杀'
			},
			{
				image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product5.jpg',
				title: '微软（Microsoft）新Surface Pro 二合一平板电脑笔记本 12.3英寸（i5 8G内存 256G存储）',
				originalPrice: 8888,
				favourPrice: 8288,
				tip: '优惠'
			},
			{
				image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product6.jpg',
				title: 'Apple Watch Series 3智能手表（GPS款 42毫米 深空灰色铝金属表壳 黑色运动型表带 MQL12CH/A）',
				originalPrice: 2899,
				favourPrice: 2799,
				tip: '自营'
			}
		]
	};
	export default {
		components: {
			
		},
		data() {
			return {
				imgSrc: '/static/images/no_data_d.png',
				mode: 'widthFix',
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				newsitems: [],
				renderImage: false,
				tabBars: [{
					name: '全部',
					id: 'all'
				}, {
					name: '未确认',
					id: 'guanzhu'
				}, {
					name: '确认收款',
					id: 'tuijian'
				}, {
					name: '取消',
					id: 'tiyu'
				}]
			}
		},
		onLoad() {
			this.newsitems = this.randomfn();
			setTimeout(()=> {
			    this.renderImage = true;
			}, 300);
		},
		methods: {
			goDetail(e) {
				uni.navigateTo({
					url: '/pages/template/tabbar/detail/detail?title=' + e.title
				});
			},
			loadMore(e) {
				setTimeout(() => {
					this.addData(e);
				}, 1200);
			},
			addData(e) {
				if (this.newsitems[e].data.length > 30) {
					this.newsitems[e].loadingText = '没有更多了';
					return;
				}
				for (let i = 1; i <= 10; i++) {
					this.newsitems[e].data.push(tpl['data' + Math.floor(Math.random() * 5)]);
				}
			},
			async changeTab(e) {
				let index = e.target.current;
                this.tabIndex = index;
				if (this.newsitems[index].data.length === 0) {
					this.addData(index)
				}
				if (this.isClickChange) {
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;

				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].id);
					width += result.width;
				}
				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].id),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth) {
					this.scrollLeft = width + nowWidth - winWidth;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			async tapTab(e) { //点击tab-bar
				let tabIndex = e.target.dataset.current;
				if (this.newsitems[tabIndex].data.length === 0) {
					this.addData(tabIndex)
				}
				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = tabIndex;
				}
			},
			randomfn() {
				let ary = [];
				for (let i = 0, length = this.tabBars.length; i < length; i++) {
					let aryItem = {
						loadingText: '加载更多...',
						data: []
					};
					if (i < 1) {
						for (let j = 1; j <= 4; j++) {
							aryItem.data.push(tpl['data0']);
							// aryItem.data = [];
						}
					}
					ary.push(aryItem);
				}
				return ary;
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
