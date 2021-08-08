<script>
	import { getUpdateUrl } from './common/util.js'
	export default {
		onLaunch: function() {
			const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
			// #ifdef APP-PLUS
			// 锁定屏幕方向
			plus.screen.lockOrientation('portrait-primary'); //锁定
			//app启动时打开启动广告页
			// plus.webview.open( url, id, styles, aniShow, duration, showedCB );
			let w = plus.webview.open('hybrid/html/advertise/advertise.html', '本地地址', { top: 0, bottom: 0, zindex: 999 }, 'fade-in', 500, function() {
				plus.nativeUI.closeWaiting();
			});
			
			// android 更新
			let wgtWaiting;
			let updateFun = function(versionUrl, str) {
				console.log('versionUrl: ', versionUrl);
				let dtask = plus.downloader.createDownload(versionUrl, {
					timeout: 5,
					retry: 2,
					retryInterval: 1
				}, function(d, status) {
					if(status == 200) {
						uni.showToast({
							title: "下载成功，自动安装...",
							icon: 'none'
						});
						console.log('d: ', d);
						plus.runtime.install(d.filename, {}, function(widgetInfo) {
							console.log('安装完成：', widgetInfo);
							uni.showToast({
								title: "安装完成",
								success() {
									plus.runtime.restart();
								}
							});
						}, function(err) {
							console.log('安装失败：', err);
						});
					} else {
						plus.nativeUI.alert("下载资源失败！");
					}
					wgtWaiting && wgtWaiting.close();
				});
				dtask.addEventListener("statechanged", function(download, status) {
					switch(download.state) {
						case 2:
							wgtWaiting.setTitle("已连接到服务器");
							break;
						case 3:
							let percent = download.downloadedSize / download.totalSize * 100;
							wgtWaiting.setTitle("已下载 " + parseInt(percent) + "%");
							break;
						case 4:
							str && wgtWaiting.setTitle(str);
							break;
					}
				});
				dtask.start();
			};
			// android 自动下载并安装更新包
			let autoInstallfun = async function(currentVersionInfo, data, isBigVersion) {
				let str = '';
				wgtWaiting = plus.nativeUI.showWaiting('发现新版本即将更新...');
				await timeout(1500);
				wgtWaiting.setTitle("下载更新资源...");
				await timeout(500);
				if(data.code == 1) {
					// 如果是大版本，则先全量更新(安装该大版本的基础版本)
					let curVersionArr = currentVersionInfo.version.split('.');
					let serverVersionArr = data.version.split('.');
					// 大版本
					if (isBigVersion) {
						// 先更新到基础版本
						updateFun(data.bigUpdate);
					} else {
						// 增量更新
						str = '版本对比,等待安装...';
						updateFun(data.smallUpdate, str);
					}
				} else if(data.code == 2) {
					// 全量更新
					str = '下载完成';
					updateFun(data.bigUpdate, str);
				}
			};
			// ios 自动下载并安装更新包
			let autoInstallfunIos = async function(currentVersionInfo, data, isBigVersion) {
				let str = '';
				wgtWaiting = plus.nativeUI.showWaiting('发现新版本即将更新...');
				await new Promise(resolve => setTimeout(resolve, 1500));
				wgtWaiting.setTitle("下载更新资源...");
				await new Promise(resolve => setTimeout(resolve, 500));
				if(data.code == 1) {
					// 如果是大版本，则先全量更新(安装该大版本的基础版本)
					let curVersionArr = currentVersionInfo.version.split('.');
					let serverVersionArr = data.version.split('.');
					// 大版本
					if (isBigVersion) {
						// 先更新到基础版本
						wgtWaiting.close();
					} else {
						// 增量更新
						str = '版本对比,等待安装...';
						updateFun(data.smallUpdate, str);
					}
				} else if(data.code == 2) {
					// 全量更新
					wgtWaiting.close();
				}
			};
			function checkUpdate() {
				// 检测升级
				uni.request({
					url: getUpdateUrl() + '?random=' + Math.random(), //检查更新的服务器地址
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
							if (Number(serverVersionArr[0]) > Number(curVersionArr[0])) {
								isUpdate = true;
								isBigVersion = true;
							} else if ((Number(serverVersionArr[0]) >= Number(curVersionArr[0])) && (Number(serverVersionArr[1]) > Number(curVersionArr[1]))) {
								isUpdate = true;
								isBigVersion = true;
							} else if ((Number(serverVersionArr[0]) >= Number(curVersionArr[0])) && (Number(serverVersionArr[1]) >= Number(curVersionArr[1])) && (Number(serverVersionArr[2]) > Number(curVersionArr[2]))) {
								isUpdate = true;
							}
							console.log('isUpdate: ' + isUpdate);
							if(plus.os.name == "Android") {
								if(isUpdate) {
									// 自动下载并安装更新包
									autoInstallfun(currentVersionInfo, res, isBigUpdate);
								}
							} else if(plus.os.name == "iOS") {
								// let url='itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8';// HelloH5应用在appstore的地址  
								// plus.runtime.openURL(url);
								if(isUpdate) {
									autoInstallfunIos(currentVersionInfo, res, isBigUpdate);
								}
							}
						});
						// if (res.statusCode == 200 && res.data.isUpdate) {
						// 	let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
						// 	// 提醒用户更新
						// 	uni.showModal({
						// 		title: '更新提示',
						// 		content: res.data.note ? res.data.note : '是否选择更新',
						// 		success: (showResult) => {
						// 			if (showResult.confirm) {
						// 				plus.runtime.openURL(openUrl);
						// 			}
						// 		}
						// 	})
						// }
					}
				});
			}
			
			//设置定时器，关闭启动广告页
			setTimeout(function() {
				plus.webview.close(w);
				checkUpdate();
			}, 7500);
			// plus.push.addEventListener('click', function(msg){  
			// 	//处理透传消息的业务逻辑代码
			// 	uni.showModal({
			// 		content: JSON.stringify(msg)
			// 	});
			// }, false);
			// #endif
		}
	}
</script>

<style>
    /* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';

	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		background-color: #f0f2f5;
		height: 100%;
		font-size: 28upx;
		line-height: 1.8;
	}

	.uni-header-logo {
		padding: 30upx;
		text-align: center;
		margin-top: 10upx;
	}

	.uni-header-logo image {
		width: 140upx;
		height: 140upx;
	}

	.uni-hello-text {
		color: #7A7E83;
	}

	.uni-hello-addfile {
		text-align: center;
		line-height: 300upx;
		background: #FFF;
		padding: 50upx;
		margin-top: 10px;
		font-size: 38upx;
		color: #808080;
	}
    /* #endif*/
</style>
<style lang="scss">
    /* #ifndef APP-PLUS-NVUE */
	@import './static/iconfont/iconfont.css';
	@import './common/app.scss';
    /* #endif*/
</style>