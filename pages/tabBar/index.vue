<template>
	<view class="page">
		<view class="status_bar">
            <!-- 这里是状态栏 -->
        </view>
		<view class="uni-padding-wrap">
            <view class="page-section swiper">
                <view class="page-section-spacing">
                    <swiper style="height: 350upx;" class="swiper" :indicator-dots="indicatorDots" :indicator-active-color="indicatorActiveColor" :indicator-color="indicatorColor" :autoplay="autoplay" :interval="interval" :duration="duration">
                        <swiper-item v-for="(item, index) in imgLs" :key="index">
                            <view class="swiper-item">
								<image style="width: 100%;" :mode="mode" :src="item" @click="goDetail" @error="imageError"></image>
							</view>
                        </swiper-item>                        
                    </swiper>
                </view>
            </view>
        </view>
		<view class="uni-product-list">
			<view class="uni-product" v-for="(product,index) in productList" :key="index" @click="goDetail">
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
		<view class="uni-padding-wrap uni-common-pb">
			<view class="index">
				<view v-html="sysInfo"></view>
			</view>
		</view>
		<share-menu ref="shareMenu"></share-menu>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import shareMenu from '@/components/share-menu/index';
	export default {
		components: {
			shareMenu
		},
		data() {
			return {
				sysInfo: '',
				indicatorDots: true,
				indicatorColor: '#fff',
				indicatorActiveColor: '#fff',
				autoplay: true,
				interval: 50000,
				duration: 500,
				mode: 'widthFix',
				imgLs: ['/static/img/09b56be258853ac27ec6ecc946453b65.jpg',
					'/static/img/56da50eddd39e1089c0724e40443c850.png',
					'/static/img/18092294969201596540241d96bc0592.jpg',
					'/static/img/c1b03c41d7eeec63eece551efdeb03af.jpg',
					'/static/img/f3cd12cb76ff1be193dbc091b56fde2b.jpg'],
				productList: [],
				renderImage: false
			}
		},
		onLoad() {
			this.getSystemInfo();
			this.loadData();
			uni.setTabBarBadge({
				index: 2,
				text: '12'
			});
			setTimeout(()=> {
			    this.renderImage = true;
			}, 300);
		},
		onPullDownRefresh() {
			// 下拉刷新
		    this.loadData('refresh');
		    // 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
		    setTimeout(() => {
		        uni.stopPullDownRefresh();
		    }, 2000);
		},
		onReachBottom() {
			// 上拉加载更多
		    this.loadData();
		},
		onNavigationBarSearchInputChanged(e) {
			// 输入框改变
			console.log(e);
		},
		onNavigationBarSearchInputConfirmed(e) {
			// 点击搜索按钮
			console.log(JSON.stringify(e));
			util.dialog({
				title: '搜索结果',
				showCancel: false,
				content: e.text
			});
		},
		onNavigationBarButtonTap(e) {
			// 点击分享按钮
			console.log(JSON.stringify(e));
			// #ifdef APP-PLUS
			this.$refs.shareMenu.showShareMenu();
			// #endif
		},
		methods: {
			getSystemInfo() {
				let me = this;
				uni.getSystemInfo({
					success (res) {
						me.sysInfo = 'model: ' + res.model + '<br/>'
									+ 'pixelRatio: ' + res.pixelRatio + '<br/>'
									+ 'windowWidth: ' + res.windowWidth + '<br/>'
									+ 'windowHeight: ' + res.windowHeight + '<br/>'
									+ 'language: ' + res.language + '<br/>'
									+ 'version: ' + res.version + '<br/>'
									+ 'platform: ' + res.platform + '<br/>'
									+ 'SDKVersion: ' + res.SDKVersion + '<br/>'
									+ 'system: ' + res.system + '<br/>'
									+ 'statusBarHeight: ' + res.statusBarHeight;
					}
				})
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			goDetail() {
				util.goUrl({
					url: '../product/productDetail'
				})
			},
			loadData(action = 'add') {
			    const data = [
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
			    ];
			
			    if (action === 'refresh') {
			        this.productList = [];
			    }
			
			    data.forEach(item => {
			        this.productList.push(item);
			    });
			}
		}
	}
</script>
