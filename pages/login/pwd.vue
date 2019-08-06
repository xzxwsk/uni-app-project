<template>
    <view class="content">
        <view class="input-group">
            <view class="input-row">
                <text class="title">原密码：</text>
                <input-box type="password" focus clearable v-model="oldPsw" placeholder="请输入原密码"></input-box>
            </view>
			<view class="input-row">
			    <text class="title">新密码：</text>
			    <input-box type="password" focus clearable v-model="newPsw" placeholder="请输入新密码"></input-box>
			</view>
			<view class="input-row">
			    <text class="title">确认新密码：</text>
			    <input-box type="password" focus clearable v-model="newConfirmPsw" placeholder="请确认新密码"></input-box>
			</view>
        </view>

        <view class="btn-row">
            <button type="warn" class="primary" @tap="confirmPassword">提交</button>
        </view>
    </view>
</template>

<script>
    import service from '../../service.js';
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';

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
				
			}
        }
    }
</script>

<style>

</style>
