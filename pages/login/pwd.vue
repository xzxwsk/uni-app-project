<template>
    <view class="user">
        <view class="input-group">
            <view class="input-row">
                <text class="title">原密码：</text>
                <input-box type="password" focus :verification="['isNull']" :verificationTip="['密码不能为空']" v-model="oldPsw" placeholder="请输入原密码"></input-box>
            </view>
			<view class="input-row">
			    <text class="title">新密码：</text>
			    <input-box type="password" :verification="['isNull']" :verificationTip="['新密码不能为空']" v-model="newPsw" placeholder="请输入新密码"></input-box>
			</view>
			<view class="input-row">
			    <text class="title">确认新密码：</text>
			    <input-box type="password" :verification="['isNull']" :verificationTip="['确认新密码不能为空']" v-model="newConfirmPsw" placeholder="请确认新密码"></input-box>
			</view>
        </view>

        <view class="btn-row logout_btn">
            <button type="warn" class="btn" @tap="confirmPassword">提交</button>
        </view>
    </view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import util from '@/common/util.js';

    export default {
        components: {
            inputBox
        },
        data() {
            return {
                oldPsw: '',
				newPsw: '',
				newConfirmPsw: ''
            }
        },
        methods: {
            findPassword() {
                /**
                 * 仅做示例
                 */
                if (this.email.length < 3 || !~this.email.indexOf('@')) {
                    uni.showToast({
                        icon: 'none',
                        title: '邮箱地址不合法',
                    });
                    return;
                }
                uni.showToast({
                    icon: 'none',
                    title: '已发送重置邮件至注册邮箱，请注意查收。',
                    duration: 3000
                });
            },
			confirmPassword() {
				if (this.newConfirmPsw !== this.newPsw) {
					util.showToast({
						title: '密码不一致'
					});
					return;
				}
				util.ajax({
					method: 'SYS.UserDAL.ChangePassword',
					params: {
						OldPassword: this.oldPsw,
						NewPassword: this.newPsw
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.showToast({
						title: '修改成功',
						success() {
							setTimeout(() => {
								util.goTab({
									url: '/pages/tabBar/user'
								});
							}, 1000);
						}
					});
				});
			}
        }
    }
</script>

<style>

</style>
