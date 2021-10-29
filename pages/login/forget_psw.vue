<template>
    <view class="content">
        <view class="input-group">
			<view class="input-row border">
			    <text class="title">用户名：</text>
			    <input-box type="text" clearable ref="phone" key="phone" v-model="phone" :inputValue="phone" placeholder="请输入经销商编号/身份证号/手机号"></input-box>
			</view>
            <view class="input-row">
                <text class="title">手机验证码：</text>
                <div style="flex: 1;">
					<input-box type="text" v-model="code" :inputValue="code" placeholder="请输入验证码" style="padding-left: 0;"></input-box>
					<!-- 接收默认填充 -->
					<input-box type="text" style="padding: 0; width: 0; height: 0; overflow: hidden;"></input-box>
                </div>
				<button type="warn" class="primary" @tap="getCode" style="height: 40px; line-height: 40px;">获取验证码</button>
            </view>
            <view class="input-row border">
                <text class="title">密码：</text>
				<!-- 接收默认填充 -->
				<input-box type="password" style="padding: 0; width: 0; height: 0; overflow: hidden;"></input-box>
                <input-box type="password" displayable ref="password" key="password" v-model="password" :inputValue="password" placeholder="请输入密码"></input-box>
            </view>
        </view>
        <view class="btn-row">
            <button type="warn" class="primary" @tap="register">保存</button>
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
                account: '',
				phone: '',
				code: '',
				code1: '',
                password: '',
            }
        },
        methods: {
			...mapMutations(['login']),
			async getCode() {
				this.phone = this.$refs.phone.getValue()
				console.log('phone: ', this.$refs, this.phone);
				if (this.phone === '') {
					uni.showToast({
					    icon: 'none',
					    title: '请输入经销商编号/身份证号/手机号'
					});
					return;
				}
				let res = await util.ajax({
					method: 'SYS.DealerDAL.SendVerifyCode',
					prompt: {
						UserName: this.phone
					}
				})
				console.log('res: ', res);
			},
            register() {
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                if (this.account.length < 5) {
                    uni.showToast({
                        icon: 'none',
                        title: '账号最短为 5 个字符'
                    });
                    return;
                }
                if (this.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符'
                    });
                    return;
                }

                const data = {
                    account: this.account,
                    password: this.password
                }
                service.addUser(data);
				console.log('service: ', service);
                uni.showToast({
                    title: '注册成功',
					duration: 2000,
					success: () => {
						console.log('success');
						this.login(data.account);
						setTimeout(function() {
							uni.navigateBack({
							    delta: 1
							});
						}, 1000);
					}
                });                
            }
        }
    }
</script>

<style>

</style>
