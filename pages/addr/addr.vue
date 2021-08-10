<template>
	<view class="uni-padding-wrap uni-common-pb addr_ls">
		<view class="con">
			<view class="no-data" v-if="!isLoaded || addrLs.length < 1 ">
				<view class="no-img cart">
					<image style="width: 100%;" :mode="mode" :src="imgSrc" @error="imageError"></image>
				</view>
				<view class="txt"><text>亲，您还没有添加地址~</text></view>
			</view>
			<scroll-view class="ls" scroll-y v-else>
				<view :class="[(showMode === 'select' ? 'uni-list-cell-navigate uni-navigate-right' : ''), ' ls_item']" v-for="(item, index) in addrLs" :key="index" @click="bindSelectAddr(index)">
					<view class="ls_item_top">
						<text class="title">{{item.name + '  ' + item.phone}}</text>
						<view class="status">
							<text>{{item.isDefault ? '默认地址' : ''}}</text>
						</view>
					</view>
					<view class="ls_item_center">
						<text class="count">{{item.area + ' ' + item.detail}}</text>
					</view>
					<view class="ls_item_bottom" v-if="showMode !== 'select'">
						<button class="btn" @click.stop="edit(index)">编辑</button>
						<button class="btn" @click.stop="del(index)">删除</button>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="add_btn">
			<button type="warn" @tap="addAddr">添加地址</button>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		computed: mapState(['openid']),
		data() {
			return {
				imgSrc: util.getImgUrl() + '/static/images/no_data_d.png',
				mode: 'widthFix',
				isLoaded: false,
				addrLs: [],
				showMode: null
			}
		},
		onShow() {
			this.getLs();
		},
		onLoad(option) {
			if(option.hasOwnProperty('mode')) {
				this.showMode = option.mode;
			}
		},
		onNavigationBarButtonTap(e) {
			this.addAddr();
		},
		methods: {
			getLs(pageIndex = 1) {
				util.showLoading();
				util.ajax({
					method: 'Basic.DealerAddressDAL.QueryList',
					params: {
						filter: {
							PageIndex: pageIndex,
							PageSize: 20
						}
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					let ls = res.data.result.data.map(item => {
						return {
							id: item.Id,
							name: item.PersonName,
							phone: item.Mobile,
							isDefault: item.IsDefault,
							area: item.Country + ' ' + item.Province + ' ' + item.City + ' ' + item.District,
							detail: item.AddrDetail
						}
					});
					this.addrLs = ls;
					this.isLoaded = true;
					// if (ls.length < 2) {
					// 	this.addrLs = this.addrLs.concat([{
					// 		name: '呆满足',
					// 		phone: '13322221111',
					// 		area: '四川 成都市 锦江区',
					// 		detail: 'sdfjsdfgafd',
					// 		isDefault: true
					// 	}, {
					// 		name: '呆满足',
					// 		phone: '13322221111',
					// 		area: '四川 成都市 锦江区',
					// 		detail: 'sdfjsdfgafd',
					// 		isDefault: false
					// 	}, {
					// 		name: '呆满足',
					// 		phone: '13322221111',
					// 		area: '四川 成都市 锦江区',
					// 		detail: 'sdfjsdfgafd',
					// 		isDefault: false
					// 	}, {
					// 		name: '呆满足',
					// 		phone: '13322221111',
					// 		area: '四川 成都市 锦江区',
					// 		detail: 'sdfjsdfgafd',
					// 		isDefault: false
					// 	}, {
					// 		name: '呆满足',
					// 		phone: '13322221111',
					// 		area: '四川 成都市 锦江区',
					// 		detail: 'sdfjsdfgafd',
					// 		isDefault: false
					// 	}, {
					// 		name: '呆满足',
					// 		phone: '13322221111',
					// 		area: '四川 成都市 锦江区',
					// 		detail: 'sdfjsdfgafd',
					// 		isDefault: false
					// 	}]);
					// }
				});
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			addAddr() {
				uni.navigateTo({
					url: './addAddr'
				});
			},
			edit(index) {
				util.goUrl({
					url: '../addr/addAddr?id=' + this.addrLs[index].id
				});
			},
			del(index) {
				let me = this;
				util.dialog({
					content: '您确定要删除本地址吗？',
					success(data) {
						if (data.confirm) {
							util.showLoading();
							util.ajax({
								method: 'Basic.DealerAddressDAL.Delete',
								params: {
									RecordId: me.addrLs[index].id
								},
								tags: {
									usertoken: me.openid
								}
							}).then(res => {
								util.hideLoading();
								console.log('删除地址：', res);
								util.showToast({
									title: '删除成功'
								});
								me.getLs();
							});
						}
					}
				});
			},
			bindSelectAddr(index) {
				if (this.showMode === 'select') {
					let pages = getCurrentPages();  //获取所有页面栈实例列表
					let nowPage = pages[ pages.length - 1];  //当前页页面实例
					let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
					let addr = util.deepCopy(this.addrLs[index]);
					addr.PersonName = addr.name;
					addr.Mobile = addr.phone;
					addr.Address = addr.area + addr.detail;
					prevPage.$vm.addr = addr;
					uni.navigateBack();
				}
			}
		}
	}
</script>
