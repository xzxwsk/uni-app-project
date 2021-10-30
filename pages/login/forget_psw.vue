<template>
    <view class="login_page">
		<view class="content">
			<view class="input-group">
				<view class="input-row border">
					<text class="title">用户名：</text>
					<input-box type="text" class="input-box" clearable ref="phone" key="phone" v-model="phone" :inputValue="phone" placeholder="经销商编号/身份证号/手机号"></input-box>
				</view>
				<view class="input-row">
					<text class="title" style="width: 100px;">手机验证码：</text>
					<div style="flex: 1;">
						<input-box type="text" ref="code" v-model="code" :inputValue="code" placeholder="验证码" style="padding-left: 0;"></input-box>
						<!-- 接收默认填充 -->
						<input-box type="text" style="padding: 0; width: 0; height: 0; overflow: hidden;"></input-box>
					</div>
					<button type="warn" class="primary" @click="getCode" :disabled="timeout > 0" style="height: 40px; line-height: 40px;">{{timeout > 0 ? `${timeout}秒后再获取` : '获取验证码'}}</button>
				</view>
				<view class="input-row border">
					<text class="title">密码：</text>
					<!-- 接收默认填充 -->
					<input-box type="password" style="padding: 0; width: 0; height: 0; overflow: hidden;"></input-box>
					<input-box type="password" displayable ref="password" key="password" v-model="password" :inputValue="password" placeholder="请输入密码"></input-box>
				</view>
				<view class="input-row border">
					<text class="title">确认密码：</text>
					<input-box type="password" displayable ref="password2" key="password2" v-model="password2" :inputValue="password2" placeholder="请输入密码"></input-box>
				</view>
			</view>
			<view class="btn-row">
				<button type="warn" class="primary" @click="modiPsw">保存</button>
			</view>
		</view>
    </view>
</template>

<script>
    import service from '../../service.js';
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
    import mInput from '../../components/m-input.vue';
    import util from '@/common/util';
	import {mapMutations} from 'vuex';

    export default {
        components: {
            inputBox, mInput
        },
        data() {
            return {
				phone: '',
				code: '',
                password: '',
                password2: '',
				timeout: 0
            }
        },
		mounted() {
			let timeout = Number(util.getStorageSync('timeout'))
			console.log('timeout: ', timeout);
			if (timeout > 0) {
				this.timeout = timeout
				this.setTime()
			}
		},
        methods: {
			...mapMutations(['login']),
			async getCode() {
				this.phone = this.$refs.phone.getValue()
				console.log('phone: ', this.$refs, this.phone);
				if (this.phone === '') {
					util.showToast({
					    title: '请输入经销商编号/身份证号/手机号'
					});
					return;
				}
				let res = await util.ajax({
					method: 'SYS.DealerDAL.SendVerifyCode',
					params: {
						UserName: this.phone
					}
				})
				const { data } = res
				if (!data.error) {
					// 发送成功
					util.showToast({
					    title: '验证码已发送成功'
					});
					this.timeout = 60
					// 开始倒计时
					this.setTime()
				}
				console.log('res: ', res);
			},
			setTime() {
				let si = setInterval(() => {
					if (this.timeout === 0) {
						clearInterval(si)
						si = null
						return
					}
					this.timeout--
					util.setStorageSync({key: 'timeout', data: this.timeout})
				}, 1000)
			},
            async modiPsw() {
				console.log(this.$refs, this.$refs.phone);
                this.phone = this.$refs.phone.getValue()
				this.code = this.$refs.code.getValue()
				this.password = this.$refs.password.getValue()
				this.password2 = this.$refs.password2.getValue()
				if (this.password !== this.password2) {
					util.showToast({
					    title: '两次输入密码不一致，请重新输入'
					});
					return;
				}

                if (this.code === '') {
                    util.showToast({
                        title: '验证码不能为空'
                    });
                    return;
                }
                if (this.password === '') {
                    util.showToast({
                        title: '密码不能为空'
                    })
                    return;
                }
				
				let res = await util.ajax({
					method: 'SYS.DealerDAL.ChangePasswordBySms',
					params: {
						UserName: this.phone,
						NewPassword: this.password,
						VerifyCode: this.code
					}
				})
				const { data } = res
				if (!data.error) {
					uni.showToast({
						title: '修改成功',
						duration: 2000,
						success: () => {
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								});
							}, 1000)
						}
					})
				}
            }
        }
    }
</script>

<style>

</style>
