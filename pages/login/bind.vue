<template>
	<view class="login_page">
		<!-- #ifndef MP-WEIXIN -->
		<view class="status_bar" :style="{ height: statusBarHeight }">
		    <!-- 这里是状态栏 -->
		</view>
		<view class="uni-padding-wrap uni-common-pb login_top">
			<view class="return_btn" @tap="goMain"><text class="uni-icon uni-icon-home"></text></view> <button class="b login_title">绑定帐号</button>
		</view>
		<!-- #endif -->
		<view class="content">
			<block v-if="!initAddr">
				<view class="input-group">
					<view class="input-row border">
						<text class="title">接口地址：</text>
						<input-box ref="interfaceAddrIpt" type="text" :inputValue="interfaceAddr" v-model="interfaceAddr"></input-box>
					</view>
				</view>
				<view class="btn-row">
					<button type="warn" @tap="setInterfaceAddr">请先配置接口服务地址</button>
				</view>
			</block>
			<block v-else>
				<view class="input-group">
					<view class="input-row border">
						<text class="title">账号：</text>
						<input-box ref="input1" type="text" :verification="['isNull']" :verificationTip="['帐号不能为空']" class="input-box" clearable focus :inputValue="account" v-model="account" placeholder="请输入身份证号"></input-box>
					</view>
					<view class="input-row">
						<text class="title">密码：</text>
						<input-box ref="input2" type="password" :verification="['isNull','isChineseEnlishAndNumber']" :verificationTip="['密码不能为空','密码只能输入中文、数字和字母']" :inputValue="password" v-model="password" placeholder="请输入密码"></input-box>
					</view>
					<!-- <view class="input-row">
						<text class="title">验证码：</text>
						<input-box class="voli_code_ipt" ref="input3" type="number" :verification="['isNull']" :verificationTip="['验证码不能为空']" rightText="看不清？" rightClass="right_txt" @rightClick="resetVoliCode" maxLength="4" v-model="voliCode" placeholder="请输入验证码"></input-box>
					</view>
					<view class="input-row" style="height: 60px;">
						<text class="title"></text>
						<view class="voli_code_img"><image style="width: 100%; height: 60px;" mode="aspectFit" :src="voliCodeSrc" @click="resetVoliCode"></image></view>
					</view> -->
				</view>
				<view class="btn-row">
					<button type="warn" @tap="bindLogin">绑定</button>
				</view>
				<!-- <view class="action-row">
					<navigator url="./reg">注册账号</navigator>
					<text class="split">|</text>
					<navigator url="./pwd">忘记密码</navigator>
				</view> -->
				<view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
					<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
						<image :src="provider.image" @tap="oauth(provider.value)"></image>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>
<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
	import service from '../../service.js';
	import {mapState, mapMutations} from 'vuex';
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import util from '@/common/util.js';
	export default {
		components: {
		    inputBox
		},
		computed: mapState(['sessionId', 'openid']),
		data() {
			return {
				initAddr: true,
				statusBarHeight: statusBarHeight,
				interfaceAddr: '',
				uuid: '',
				providerList: [],
				hasProvider: false,
				account: '',
				password: '',
				voliCode: '',
				voliCodeSrc: '',
				positionTop: 0,
				code: '' // 微信code
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			// plus.nativeUI.showWaiting('加载中……');
			// #endif
		},
		onShow() {
			// #ifdef MP-WEIXIN
			console.log('onshow bind')
			this.getCode()
			// #endif
		},
		onReady() {
			// #ifdef APP-PLUS
			// plus.nativeUI.closeWaiting();
			// #endif
			// this.initPosition();
			// #ifdef H5
			document.onkeydown = e => {  
			    //webview不需要兼容ie  
				if (e.keyCode === 13) {
					this.bindLogin();
				}
			}
			// #endif
		},
		mounted() {
			this.interfaceAddr = util.getBaseUrl();
			this.initSetAccount();
			// this.$refs.interfaceAddrIpt.setValue(this.interfaceAddr);
			
			// let sessionId = util.getStorageSync('session_id');
			// if (sessionId) {
			// 	this.autoLogin(sessionId);
			// }
			// console.log('sessionId: ', sessionId);
			// this.getDeviceId();
		},
		methods: {
			...mapMutations(['login', 'setSessionId', 'setOpenid', 'setUserInfo']),
			autoLogin(sessionId) {
				let me = this;
				this.setOpenid(sessionId);
				// util.showLoading({
				// 	title: '自动登录中'
				// });
				uni.request({
					url: this.interfaceAddr + 'json.rpc/webapi',
					data: {
						jsonrpc: '2.0',
						method: 'SYS.UserDAL.GetDealerByToken',
						params: {},
						id: 1,
						tags: {
							usertoken: sessionId
						}
					},
					header: {},
					method: 'POST',
					dataType: 'json',
					responseType: 'text',
					success(res) {
						util.hideLoading();
						if (res.statusCode === 200) {
							if (res.data.hasOwnProperty('error')) {
								// util.showToast({
								// 	title: '登录已过期，请重新登录'
								// });
							} else if (res.data.hasOwnProperty('result')) {
								res.data.result = util.jsonReplace(res.data.result, 'null', '""');
								me.setUserInfo(res.data.result);
								me.toMain(res.data.result.DealerName);
							}
						}
					},
					fail(err) {
						util.hideLoading();
						console.log(err);
						if (err.hasOwnProperty('errMsg') && err.errMsg.indexOf('request:fail abort') !== -1) {
							util.dialog({
								title: '错误信息',
								content: '网络错误，请查看网络是否开启',
								showCancel: false
							});
						}
					}
				});
			},
			goMain() {
				util.goTab({
					url: '/pages/tabBar/index'
				});
			},
			initPosition() {
			    /**
			     * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
			     * 反向使用 top 进行定位，可以避免此问题。
			     */
			    this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
				console.log('initPosition: ', this.positionTop);
			},
			oauth(value) {
			    uni.login({
			        provider: value,
			        success: (res) => {
			            uni.getUserInfo({
			                provider: value,
			                success: (infoRes) => {
			                    /**
			                     * 实际开发中，获取用户信息后，需要将信息上报至服务端。
			                     * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
			                     */
			                    this.toMain(infoRes.userInfo.nickName);
			                }
			            });
			        },
			        fail: (err) => {
			            console.error('授权登录失败：' + JSON.stringify(err));
			        }
			    });
			},
			toMain(userName) {
				this.login(userName);
				this.goMain();
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				// if (this.forcedLogin) {
				// 	uni.reLaunch({
				// 		url: '../main/main',
				// 	});
				// } else {
				// 	uni.navigateBack();
				// }
			},
			async getSessionId() {
				await util.ajax({
					method: 'SYS.UserDAL.GetSessionId'
				}).then(res => {
					// console.log('GetSessionId: ', res);
					this.setSessionId(res.data.result);
				});
				this.resetVoliCode();
			},
			resetVoliCode() {
				// console.log('验证码');
				// console.log('sessionId: ', this.sessionId);
				util.ajax({
					method: 'SYS.UserDAL.GetVerifyCodeBase64',
					tags: {
						usertoken: '',
						sessionid: this.sessionId
					}
				}).then(res => {
					util.hideLoading();
					// console.log('获取验证码： ', res);
					this.voliCodeSrc = 'data:image/jpeg;base64,' + res.data.result;
					
					// #ifdef APP-PLUS
					// plus.nativeUI.closeWaiting();
					// #endif
				});
				// util.ajax({
				// 	get: true,
				// 	responseType: 'arraybuffer',
				// 	method: 'images/verifycode',
				// }).then(res => {
				// 	console.log(res);
				// 	var buffer = new Buffer(res.data.byteLength);
				// 	var view = new Uint8Array(res.data);
				// 	for (var i = 0, len = buffer.length; i < len; ++i) {
				// 		buffer[i] = view[i];
				// 	}
				// 	this.voliCodeSrc = 'data:image/jpeg;base64,' + buffer.toString("base64");
				// });
			},
			setInterfaceAddr() {
				// #ifdef APP-PLUS
				// plus.nativeUI.showWaiting('加载中……');
				// #endif
				util.showLoading();
				util.setBaseUrl(this.interfaceAddr);
				this.initAddr = true;
				this.$nextTick(() => {
					this.$refs.input1.setValue(this.account);
					this.getSessionId();
				});
			},
			getDeviceId() {
				let me = this;
				try{
					plus.device.getInfo({
						success(e) {
							console.log('plus.device.getInfo: ', e);
							me.uuid = e.uuid;
						}
					});
				}catch(e){
					
				}
			},
			getCode() {
				// 微信登录，获得code
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success: res => {
							console.log('bind getCode: ', res)
							if (res.errMsg == "login:ok") {
								this.code = res.code
								resolve(res.code)
							} else {
								reject('微信登录失败')
							}
						},
						fail(e) {
							reject(e)
						}
					})
				})
			},
			getUserInfo(e){
				uni.getUserProfile({
					desc: '用于会员业务办理', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: e => {
						console.log('getUserProfile: ', e)
						if(e.errMsg=='getUserProfile:ok'){
							this.applet(e);
						}else{
							uni.showToast({icon: 'none',title:'你取消了登录'});
							return false
						}
					}
				})
			},
			//进行授权登录
			async applet(e){
				let res = await util.ajax({
					method: 'SYS.UserDAL.WxLogin',
					params: {
						WxCode: this.code
					}
				})
				console.log('applet: ', res, e)
				// if(res.data.code==0){
				//     let userInfo = {
				// 	    userInfo1: e.userInfo,
				// 	    token: res.data.data.token
				//     }
				//     uni.setStorageSync('userInfo', userInfo);
				//     uni.setStorageSync('token', userInfo.token);
				// }
			},
			async bindLogin() {
				let me = this;
				if(!this.$refs.input1) {
					return;
				}
				const data = {
				    account: this.$refs.input1.getValue(),
				    password: this.$refs.input2.getValue(),
				}
				if(this.$refs.input1.getValue() && this.$refs.input2.getValue()){
					util.showLoading();
					await util.ajax({
						method: 'SYS.UserDAL.BindWxUser',
						params: {
							UserName: data.account,
							LoginInfo: {
								Password: data.password,
								VerifyCode: data.voliCode,
								ClientType: 1,
								ClientVersion: '1.0.0.1',
								EncyptType: 0,
								DeviceId: this.uuid
							},
							WxCode: this.code
						},
						tags: {
							usertoken: '',
							sessionid: this.sessionId
						}
					})
					.then(res => {
						console.log('绑定成功： ', res);
						util.showToast({
							title: '绑定成功',
							success: () => {
								// setTimeout(() => {
								// 	// 成功后跳转登录
								// 	util.redirectUrl({
								// 		url: './login'
								// 	})
								// }, 1000)
								// 调wxLogin
								this.wxLogin()
							}
						})
					});
					// util.goTab({
					// 	url: '../tabBar/user?logined=true',
					// 	success: (e) => {
							// let page = getCurrentPages().pop();
							// console.log('page: ', page);
							// if (page == undefined || page == null) return;
							// page.login();
					// 	}
					// });
                } else {
					uni.showToast({
					    icon: 'none',
					    title: '请正确填写完整',
					    // #ifdef MP-WEIXIN
					    duration: 2000,
					    // #endif
					    // mask: true
					});
				}
			},
			async wxLogin() {
				await this.getCode()
				util.ajax({
					method: 'SYS.UserDAL.WxLogin',
					params: {
						WxCode: this.code
					}
				}).then(res => {
					const { result } = res.data
					if (result) {
						util.setStorageSync({
							key: 'session_id',
							data: result
						});
						this.autoLogin(result)
					}
				})
			},
			bindReg() {
				/* 
				util.goUrl({
					url: '../about/scanCode'
				});
				 */
				
				uni.scanCode({
					scanType: ['qrCode'],
				    success: function (res) {
				        console.log('条码类型：' + res.scanType);
				        console.log('条码内容：' + res.result);
						util.goUrl({
							url: res.result
						});
				    }
				});
				
			},
			initSetAccount() {
				let account = util.getStorageSync('userName');
				if(account) {
					this.account = account;
					this.$refs.input1.setValue(account);
				}
			},
			saveAccount(account) {
				// 登录成功保留帐号下次使用
				util.setStorageSync({
					key: 'userName',
					data: account
				});
			},
			getSystemInfo() {
				uni.getSystemInfo({
					success (res) {
						console.log(res)
						// uni.showModal({
						// 	title: '系统信息',
						// 	content: 'model: ' + res.model + '\n'
						// 			+ 'pixelRatio: ' + res.pixelRatio + '\n'
						// 			+ 'windowWidth: ' + res.windowWidth + '\n'
						// 			+ 'windowHeight: ' + res.windowHeight + '\n'
						// 			+ 'language: ' + res.language + '\n'
						// 			+ 'version: ' + res.version + '\n'
						// 			+ 'platform: ' + res.platform + '\n'
						// 			+ 'SDKVersion: ' + res.SDKVersion + '\n'
						// 			+ 'system: ' + res.system + '\n'
						// 			+ 'statusBarHeight: ' + res.statusBarHeight,
						// 	success (resOperate) {
						// 		if (resOperate.confirm) {
						// 			console.log('用户点击确定');
						// 		} else if (resOperate.cancel) {
						// 			console.log('用户点击取消');
						// 		}
						// 	}
						// });
					}
				});
			}
		}
	}
</script>
