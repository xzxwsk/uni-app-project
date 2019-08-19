<template>
	<view>
		<view class="status_bar">
		    <!-- 这里是状态栏 -->
		</view>
		<view class="uni-padding-wrap uni-common-pb login_top">
			<view class="return_btn" @tap="goMian"><text class="uni-icon uni-icon-home"></text></view> <button class="b login_title">登录</button>
		</view>
		<view class="content">
			<view class="input-group">
				<view class="input-row border">
					<text class="title">账号：</text>
					<input-box ref="input1" type="text" :verification="['isNull']" :verificationTip="['帐号不能为空']" class="input-box" clearable focus v-model="account" placeholder="请输入经销商编号或身份证号"></input-box>
				</view>
				<view class="input-row">
					<text class="title">密码：</text>
					<input-box ref="input2" type="password" :verification="['isNull','isChineseEnlishAndNumber']" :verificationTip="['密码不能为空','密码只能输入中文、数字和字母']" displayable v-model="password" placeholder="请输入密码"></input-box>
				</view>
				<view class="input-row">
					<text class="title">验证码：</text>
					<input-box ref="input3" type="text" :verification="['isNull']" :verificationTip="['验证码不能为空']" rightText="看不清？" rightClass="right_txt" @rightClick="resetVoliCode" maxLength="4" v-model="voliCode" placeholder="请输入验证码"></input-box>
					<view class="voliCode"><image style="width: 100%;" mode="widthFix" :src="voliCodeSrc"></image></view>
				</view>
			</view>
			<view class="btn-row">
				<button type="warn" @tap="bindLogin">登录</button>
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
		</view>
	</view>
</template>
<script>
	import service from '../../service.js';
	import {mapState, mapMutations} from 'vuex';
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import util from '@/common/util.js';
	export default {
		components: {
		    inputBox
		},
		data() {
			return {
				providerList: [],
				hasProvider: false,
				account: '',
				password: '',
				voliCode: '',
				voliCodeSrc: '../../static/img/makecaptcha.jpg',
				positionTop: 0
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			plus.nativeUI.showWaiting('加载中……');
			// this.getSystemInfo();
			// #endif
		},
		onReady() {
			// #ifdef APP-PLUS
			plus.nativeUI.closeWaiting();
			// #endif
			this.initPosition();
			this.initProvider();
		},
		onShareAppMessage() {
			return {
				title: '欢迎体验uni-app',
				path: '/pages/tabBar/template/template'
			}
		},
		methods: {
			goMian() {
				uni.switchTab({
					url: '/pages/tabBar/user'
				});
			},
			initPosition() {
			    /**
			     * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
			     * 反向使用 top 进行定位，可以避免此问题。
			     */
			    this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			initProvider() {
			    const filters = ['weixin', 'qq', 'sinaweibo'];
			    uni.getProvider({
			        service: 'oauth',
			        success: (res) => {
			            if (res.provider && res.provider.length) {
			                for (let i = 0; i < res.provider.length; i++) {
			                    if (~filters.indexOf(res.provider[i])) {
			                        this.providerList.push({
			                            value: res.provider[i],
			                            image: '../../static/img/' + res.provider[i] + '.png'
			                        });
			                    }
			                }
			                this.hasProvider = true;
			            }
			        },
			        fail: (err) => {
			            console.error('获取服务供应商失败：' + JSON.stringify(err));
			        }
			    });
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
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../main/main',
					});
				} else {
					uni.navigateBack();
				}
			},
			resetVoliCode() {
				console.log('重新发送验证码')
			},
			bindLogin() {
				console.log('this.$refs.input1.getValue(), this.$refs.input2.getValue(), this.$refs.input3.getValue()：', this.$refs.input1.getValue(), this.$refs.input2.getValue(), this.$refs.input3.getValue());
				if(this.$refs.input1.getValue() && this.$refs.input2.getValue() && this.$refs.input3.getValue()){
                    uni.showToast({
                        icon: 'none',
                        title: '校验通过',
                        // #ifdef MP-WEIXIN
                        duration: 2000,
                        // #endif
                        // mask: true
                    });
                } else {
					util.goTab({
						url: '../tabBar/user?logined=true',
						success: function(e) {
							let page = getCurrentPages().pop();
							console.log('page: ', page);
							if (page == undefined || page == null) return;
							page.login();
						},
					});
				}
			},
			getSystemInfo() {
				uni.getSystemInfo({
					success (res) {
						uni.showModal({
							title: '系统信息',
							content: 'model: ' + res.model + '\n'
									+ 'pixelRatio: ' + res.pixelRatio + '\n'
									+ 'windowWidth: ' + res.windowWidth + '\n'
									+ 'windowHeight: ' + res.windowHeight + '\n'
									+ 'language: ' + res.language + '\n'
									+ 'version: ' + res.version + '\n'
									+ 'platform: ' + res.platform + '\n'
									+ 'SDKVersion: ' + res.SDKVersion + '\n'
									+ 'system: ' + res.system + '\n'
									+ 'statusBarHeight: ' + res.statusBarHeight,
							success (resOperate) {
								if (resOperate.confirm) {
									console.log('用户点击确定');
								} else if (resOperate.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					}
				});
			}
		}
	}
</script>
