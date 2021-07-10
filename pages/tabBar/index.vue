<template>
	<view class="page index_page">
		<view class="status_bar">
            <!-- 这里是状态栏 -->
        </view>
		<view class="uni-padding-wrap">
            <view class="page-section swiper">
                <view class="page-section-spacing">
                    <swiper style="height: 450upx;" class="swiper" :indicator-dots="indicatorDots" :indicator-active-color="indicatorActiveColor" :indicator-color="indicatorColor" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item class="no-img" v-if="imgLs.length < 1">
							<image style="width: 100%; height: 100%;" mode="aspectFit" :src="imgSrc" @error="imageError"></image>
						</swiper-item>
                        <swiper-item v-for="(item, index) in imgLs" :key="index">
                            <view class="swiper-item">
								<image style="width: 100%; height: 100%;" mode="aspectFit" :src="item" @click="goDetail(index)" @error="imageError"></image>
							</view>
                        </swiper-item>                        
                    </swiper>
                </view>
            </view>
        </view>
		<view class="uni-product-list" v-if="productList.length > 0">
			<view class="uni-product" v-for="(product,index) in productList" :key="index" @click="goDetail(index)">
				<view class="image-view">
					<image v-if="renderImage" style="width: 100%; height: 100%;" mode="aspectFit" class="uni-product-image" :src="product.image"></image>
				</view>
				<view class="uni-product-title">
					<view>
						<view>{{product.title}}</view>
						<text class="remark">{{product.remark}}</text>
					</view>
					<view class="uni-icon uni-icon-plus-filled" @click.stop="addCart(index)"></view>
				</view>
				<view class="uni-product-price">
					<text class="uni-product-price-favour" v-if="hasLogin">￥{{product.Price}}</text>
					<text class="uni-product-price-original">￥{{product.FactPrice}}</text>
					<!-- <text class="uni-product-tip">{{product.tip}}</text> -->
				</view>
			</view>
		</view>
		<view class="no-data" v-else>
			<view class="no-img">
				<image style="width: 100%; height: 100%;" mode="aspectFit" :src="imgSrc" @error="imageError"></image>
			</view>
			<view class="txt"><text>亲，还没有宝贝哦~</text></view>
		</view>
		<share-menu ref="shareMenu"></share-menu>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import shareMenu from '@/components/share-menu/index';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			shareMenu
		},
		computed: mapState(['hasLogin', 'openid', 'changeNum']),
		data() {
			return {
				sysInfo: '',
				indicatorDots: true,
				indicatorColor: '#fff',
				indicatorActiveColor: '#fff',
				autoplay: true,
				interval: 50000,
				duration: 500,
				imgSrc: util.getImgUrl() + '/static/images/no_data_d.png',
				imgLs: [],
				productList: [],
				recordsTotal: 0,
				pageIndex: 1,
				renderImage: false
			}
		},
		onLoad() {
			console.log(this.hasLogin, this.changeNum)
			if (this.hasLogin && this.changeNum === null) {
				this.getChangeNum();
			}
			this.getSystemInfo();
			// 获取广告图
			this.getAdLs()
			setTimeout(()=> {
			    this.renderImage = true;
			}, 300);
		},
		onShow() {
			console.log('onShow');
			this.pageIndex = 1;
			this.loadData('refresh');
		},
		onPullDownRefresh() {
			// 下拉刷新
			this.pageIndex = 1;
		    this.loadData('refresh');
		    // 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
		    setTimeout(() => {
		        uni.stopPullDownRefresh();
		    }, 2000);
		},
		onReachBottom() {
			// 上拉加载更多
			this.pageIndex++;
		    this.loadData();
		},
		onNavigationBarSearchInputChanged(e) {
			// 输入框改变
			console.log(e.text);
		},
		onNavigationBarSearchInputConfirmed(e) {
			// 点击搜索按钮
			// console.log(JSON.stringify(e));
			// util.dialog({
			// 	title: '搜索结果',
			// 	showCancel: false,
			// 	content: e.text
			// });
			this.pageIndex = 1;
			uni.hideKeyboard();
			this.searchLs(e.text);
		},
		onNavigationBarButtonTap(e) {
			// 点击分享按钮
			console.log(JSON.stringify(e));
			// #ifdef APP-PLUS
			this.$refs.shareMenu.showShareMenu();
			// #endif
		},
		methods: {
			...mapMutations(['setChangeNum']),
			async getChangeNum() {
				let num = 0;
				let myOrderChangeNum = 0;
				let myPayOrderChangeNum = 0;
				let myRefundOrderChangeNum = 0;
				// 我的订单
				await util.ajax({
					method: 'Businese.OrderDAL.GetChangedListCount',
					params: {
						State: null
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					myOrderChangeNum = res.data.result;
					num += res.data.result;
				});
				// 我的付款单
				await util.ajax({
					method: 'Businese.BillPayDAL.GetChangedListCount',
					params: {
						State: null
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					myPayOrderChangeNum = res.data.result;
					num += res.data.result;
				});
				// 我的退款单
				await util.ajax({
					method: 'Businese.BillPayReturnDAL.GetChangedListCount',
					params: {
						State: null
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					myRefundOrderChangeNum = res.data.result;
					num += res.data.result;
				});
				this.setChangeNum({
					myOrderChangeNum,
					myPayOrderChangeNum,
					myRefundOrderChangeNum
				});
				if (num > 0) {
					uni.setTabBarBadge({
						index: 2,
						text: String(num)
					});
				}
			},
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
						console.log('me.sysInfo: ' + me.sysInfo);
					}
				})
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			getAdLs() {
				// 获取广告图
				util.ajax({
					method: 'SYS.OptionsDAL.GetOptions',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					// this.imgLs = [];
					// let img = res.data.result.PictureTopBase64;
					// if (img) {
					// 	this.imgLs.push('data:image/jpeg;base64,' + img);
					// }
				})
			},
			goLogin() {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					showCancel: true,
					success: (res) => {
						if (res.confirm) {
							uni.reLaunch({
								url: '../login/login'
							});
						}
					}
				});
			},
			goDetail(index) {
				if (this.productList[index].id) {
					util.goUrl({
						url: '../product/productDetail?id=' + this.productList[index].id
					});
				}
			},
			addCart(index) {
				if (!this.hasLogin) {
					this.goLogin();
					return;
				}
				// 加入购物车
				util.showLoading();
				util.ajax({
					method: 'Businese.CartDAL.AddToCart',
					params: {
						ProductId: this.productList[index].id,
						Qty: 1
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
			searchLs(key) {
				this.loadData('refresh', key);
			},
			async loadData(action = 'add', key = '') {
				util.showLoading();
				// 获取产品列表
				await util.ajax({
					method: 'Basic.ProductDAL.QueryList',
					params: {
						filter: {
							KeyWord: key,
							TypeName: '',
							PageIndex: this.pageIndex
						}
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					let ls = res.data.result.data.map(item => {
						return {
							id: item.RecordId,
							image: item.SmallImageFileName ? util.getBaseUrl() + 'files/downloadfile?filename=' + item.SmallImageFileName : '',
							title: item.Name + ' ' + item.Spec + '/' + item.Unit, // Spec, 规格   Unit, 计量单位,
							remark: item.Remark,
							FactPrice: item.FactPrice,
							Price: item.Price
						}
					});
					this.recordsTotal = res.data.result.recordsTotal;
					if (action === 'refresh') {
						this.productList = [];
					}
					this.productList = this.productList.concat(ls);
				});
			    /* const data = [
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
				if (this.productList.length < 1) {
					data.forEach(item => {
						this.productList.push(item);
					});
				}
				if (this.imgLs.length < 1) {
					this.imgLs = this.productList.map(item => {
						let img = item.image;
						if (item.BigImageBase64) {
							img = 'data:image/jpeg;base64,' + item.BigImageBase64;
						}
						return img;
					});
				} */
			}
		}
	}
</script>
