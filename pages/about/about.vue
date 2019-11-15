<template>
	<view class="about">
		<!-- <view style="height: 90%; align-items: center; justify-content: center;">关于我们</view> -->
		<!-- <view class="content">
			<view class="qrcode">
				<image src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/app_download.png" @longtap="save"></image>
				<text class="tip">扫码体验uni-app</text>
			</view>
			<view class="desc">
				<text class="code">uni-app</text>
				是一个使用 <text class="code">Vue.js</text> 开发跨平台应用的前端框架。
			</view>
			<view class="source">
				<view class="title">本示例源码获取方式：</view>
				<view class="source-list">
					<view class="source-cell">
						<text space="nbsp">1. </text>
						<text>下载 HBuilderX，新建 uni-app 项目时选择 <text class="code">Hello uni-app</text> 模板。</text>
					</view>
					<view class="source-cell">
						<text space="nbsp">2. </text>
						<u-link class="link" :href="'https://github.com/dcloudio/hello-uniapp'" :text="'https://github.com/dcloudio/hello-uniapp'"></u-link>
					</view>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<!--<button type="primary" @click="share">分享</button>
			<!-- #endif -->
		<!--</view> -->
		<view class="uni-list">
			<view class="uni-list-cell" @click="clearCache">
				<view class="uni-list-cell-navigate uni-navigate-right">
					<view class="menu_txt">
						<view class="title">清除缓存</view>
					</view>
				</view>
			</view>
			<view class="uni-list-cell" @click="updateVersion">
				<view class="uni-list-cell-navigate">
					<view class="menu_txt">
						<view class="title">
							<text class="txt">当前版本：{{version}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uLink from "@/components/uLink.vue";
	import util from "@/common/util.js";

	export default {
		components: {
			uLink
		},
		data() {
			return {
				providerList: [],
				version: '',
				wgtWaiting: null
			}
		},
		onLoad() {
			let me = this;
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, function(currentVersionInfo) {
				me.version = currentVersionInfo.version;
			});
			uni.getProvider({
				service: 'share',
				success: (result) => {
					const data = [];
					for (let i = 0; i < result.provider.length; i++) {
						switch (result.provider[i]) {
							case 'weixin':
								data.push({
									name: '分享到微信好友',
									id: 'weixin'
								});
								data.push({
									name: '分享到微信朋友圈',
									id: 'weixin',
									type: 'WXSenceTimeline'
								});
								break;
							case 'qq':
								data.push({
									name: '分享到QQ',
									id: 'qq'
								});
								break;
							default:
								break;
						}
					}
					this.providerList = data;
				},
				fail: (error) => {
					console.log('获取分享通道失败' + JSON.stringify(error));
				}
			});
			// #endif
		},
		methods: {
			// #ifdef APP-PLUS
			save() {
				uni.showActionSheet({
					itemList: ['保存图片到相册'],
					success: () => {
						plus.gallery.save('https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/app_download.png', function() {
							util.showToast({
								title: '保存成功'
							});
						}, function() {
							util.showToast({
								title: '保存失败，请重试！'
							});
						});
					}
				});
			},
			share(e) {
				if (this.providerList.length === 0) {
					uni.showModal({
						title: '当前环境无分享渠道!',
						showCancel: false
					});
					return;
				}
				let itemList = this.providerList.map(function(value) {
					return value.name;
				})
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						let provider = this.providerList[res.tapIndex].id;
						uni.share({
							provider: provider,
							scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ?
								'WXSenceTimeline' : "WXSceneSession",
							type: (provider === "qq") ? 1 : 0,
							title: '欢迎体验uni-app',
							summary: 'uni-app 是一个使用 Vue.js 开发跨平台应用的前端框架',
							imageUrl: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/nav_menu/8.jpg',
							href: "https://m3w.cn/uniapp",
							success: (res) => {
								console.log("success:" + JSON.stringify(res));
							},
							fail: (e) => {
								uni.showModal({
									content: e.errMsg,
									showCancel: false
								})
							}
						});
					}
				})
			},
			// android 更新
			updateFun(version, str) {
				let me = this;
				let dtask = plus.downloader.createDownload(version, {
					timeout: 5,
					retry: 2,
					retryInterval: 1
				}, function(d, status) {
					if(status == 200) {
						util.showToast({
							title: "下载成功，自动安装...",
						});
						console.log('d: ', d);
						plus.runtime.install(d.filename, {}, function(widgetInfo) {
							console.log('安装完成：', widgetInfo);
							uni.showToast({
								title: "安装完成"
							});
						}, function(err) {
							console.log('安装失败：', err);
						});
					} else {
						plus.nativeUI.alert("下载资源失败！");
					}
					me.wgtWaiting && me.wgtWaiting.close();
				});
				dtask.addEventListener("statechanged", function(download, status) {
					switch(download.state) {
						case 2:
							me.wgtWaiting.setTitle("已连接到服务器");
							break;
						case 3:
							let percent = download.downloadedSize / download.totalSize * 100;
							me.wgtWaiting.setTitle("已下载 " + parseInt(percent) + "%");
							break;
						case 4:
							str && me.wgtWaiting.setTitle(str);
							break;
					}
				});
				dtask.start();
			},
			// android 自动下载并安装更新包
			async autoInstallfun(currentVersionInfo, data, isBigVersion) {
				let str = '';
				this.wgtWaiting = plus.nativeUI.showWaiting('发现新版本即将更新...');
				await util.timeout(1500);
				this.wgtWaiting.setTitle("下载更新资源...");
				await util.timeout(500);
				if(data.code == 1) {
					// 如果是大版本，则先全量更新(安装该大版本的基础版本)
					let curVersionArr = currentVersionInfo.version.split('.');
					let serverVersionArr = data.version.split('.');
					// 大版本
					if (isBigVersion) {
						// 先更新到基础版本
						this.updateFun(data.bigUpdate);
					} else {
						// 增量更新
						str = '版本对比,等待安装...';
						this.updateFun(data.smallUpdate, str);
					}
				} else if(data.code == 2) {
					// 全量更新
					str = '下载完成';
					this.updateFun(data.bigUpdate, str);
				}
			},
			updateVersion() {
				let me = this;
				// 检测升级
				uni.request({
					url: 'http://39.108.139.53/appSource/updateData.json?random=' + Math.random(), //检查更新的服务器地址
					// data: {
					// 	appid: plus.runtime.appid,
					// 	version: plus.runtime.version,
					// 	imei: plus.device.imei
					// },
					success: res => {
						res = res.data;
						console.log('update: ', res);
						plus.runtime.getProperty(plus.runtime.appid, function(currentVersionInfo) {
							let curVersionArr = currentVersionInfo.version.split('.');
							let serverVersionArr = res.version.split('.');
							console.log('systemObj.name: ' + plus.os.name);
							console.log('当前版本: ' + curVersionArr);
							console.log('服务器版本: ' + serverVersionArr);
							let isUpdate = false, isBigUpdate = false;
							if (Number(serverVersionArr[0]) > Number(curVersionArr[0]) || Number(serverVersionArr[1]) > Number(curVersionArr[1])){
								isUpdate = true;
								isBigUpdate = true;
							} else if (Number(serverVersionArr[2]) > Number(curVersionArr[2])) {
								isUpdate = true;
							}
							console.log('isUpdate: ' + isUpdate);
							if(isUpdate) {
								if(plus.os.name == "Android") {
									// 自动下载并安装更新包
									me.autoInstallfun(currentVersionInfo, res, isBigUpdate);
								} else if(plus.os.name == "iOS") {
									// let url='itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8';// HelloH5应用在appstore的地址  
									// plus.runtime.openURL(url);
								}
							} else {
								util.showToast({
									title: '当前已经是最新版本'
								});
							}
						});
					}
				});
			},
			// #endif
			async clearCache() {
				
			}
		}
	}
</script>

<style>
	page,
	view {
		display: flex;
	}

	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}

	image {
		width: 360upx;
		height: 360upx;
	}

	.about {
		flex-direction: column;
		flex: 1;
	}

	.content {
		flex: 1;
		padding: 30upx;
		flex-direction: column;
		justify-content: center;
	}

	.qrcode {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.qrcode .tip {
		margin-top: 20upx;
	}

	.desc {
		margin-top: 30upx;
		display: block;
	}

	.code {
		color: #e96900;
		background-color: #f8f8f8;
	}

	button {
		width: 100%;
		margin-top: 40upx;
	}

	.version {
		height: 80upx;
		line-height: 80upx;
		justify-content: center;
		color: #ccc;
	}

	.source {
		margin-top: 30upx;
		flex-direction: column;
	}

	.source-list {
		flex-direction: column;
	}

	.link {
		color: #007AFF;
	}
</style>
