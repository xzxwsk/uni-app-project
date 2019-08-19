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
				<view class="ls_item" v-for="(item, index) in addrLs" :key="index">
					<view class="ls_item_top">
						<text class="title">{{item.name + '  ' + item.phone}}</text>
						<view class="status">
							<text>{{item.isDefault ? '默认地址' : ''}}</text>
						</view>
					</view>
					<view class="ls_item_center">
						<text class="count">{{item.area + ' ' + item.detail}}</text>
					</view>
					<view class="ls_item_bottom">
						<button class="btn" @click="edit(index)">编辑</button>
						<button class="btn" @click="del(index)">删除</button>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- <view class="add_btn">
			<button type="warn" @tap="addAddr">添加地址</button>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgSrc: '/static/images/no_data_d.png',
				mode: 'widthFix',
				isLoaded: false,
				addrLs: []
			}
		},
		onLoad() {
			this.isLoaded = true;
			this.addrLs = [{
				name: '呆满足',
				phone: '13322221111',
				area: '四川 成都市 锦江区',
				detail: 'sdfjsdfgafd',
				isDefault: true
			}, {
				name: '呆满足',
				phone: '13322221111',
				area: '四川 成都市 锦江区',
				detail: 'sdfjsdfgafd',
				isDefault: false
			}, {
				name: '呆满足',
				phone: '13322221111',
				area: '四川 成都市 锦江区',
				detail: 'sdfjsdfgafd',
				isDefault: false
			}, {
				name: '呆满足',
				phone: '13322221111',
				area: '四川 成都市 锦江区',
				detail: 'sdfjsdfgafd',
				isDefault: false
			}, {
				name: '呆满足',
				phone: '13322221111',
				area: '四川 成都市 锦江区',
				detail: 'sdfjsdfgafd',
				isDefault: false
			}, {
				name: '呆满足',
				phone: '13322221111',
				area: '四川 成都市 锦江区',
				detail: 'sdfjsdfgafd',
				isDefault: false
			}];
		},
		onNavigationBarButtonTap(e) {
			this.addAddr();
		},
		methods: {
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			addAddr() {
				uni.navigateTo({
					url: './addAddr'
				});
			},
			edit(index) {
				uni.navigateTo({
					url: './addAddr'
				});
			},
			del(index) {
				this.addrLs.splice(index, 1);
			}
		}
	}
</script>
