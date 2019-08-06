<template>
    <view class="baseInfo">
		<view class="con">
			<scroll-view scroll-y="true" style="width: 100%; height: 100%;" scroll-with-animation>
				<view class="input-group">
					<view class="input-row border">
						<text class="title">编号：</text>
						<text class="info">1dfsdfgdfg</text>
						<text class="title">姓名：</text>
						<text class="info">努尔哈赤</text>
					</view>
					<view class="input-row border">
						<text class="title">身份证号：</text>
						<text class="info">123456789123456789A</text>
					</view>
					<view class="input-row border">
						<text class="title">生日：</text>
						<text :class="'info' + (title === '确定' ? ' input_box' : '')">	
							<text @click="selectCalendar">1988-02-25</text>
						</text>
						<text class="title">性别：</text>
						<text class="info">男</text>
					</view>
					<view class="input-row border">
						<text class="title">籍贯：</text>
						<text class="info">四川成都</text>
						<text class="title">婚否：</text>
						<text class="info">是</text>
					</view>
					<view class="input-row border">
						<text class="title">学历：</text>
						<text class="info">大专</text>
						<text class="title">邮箱：</text>
						<text class="info">611000</text>
					</view>
					<view class="input-row border">
						<text class="title">家庭地址：</text>
						<text class="info">中国四川省成都市高新区芳草街28号</text>
					</view>
					<view class="input-row border">
						<text class="title">手机：</text>
						<text :class="'info' + (title === '确定' ? ' input_box' : '')"><input-box v-if="title === '确定'" type="text" clearable v-model="email" placeholder="请输入手机号"></input-box><text v-else>13455557777</text></text>
						<text class="title">EMAIL：</text>
						<text :class="'info' + (title === '确定' ? ' input_box' : '')"><input-box v-if="title === '确定'" type="text" clearable v-model="email" placeholder="请输入邮箱"></input-box><text v-else>abbdad@163.com</text></text>
					</view>
					<view class="input-row border">
						<text class="title">紧急联系人：</text>
						<text class="info">13455557777</text>
						<text class="title">联系人电话：</text>
						<text class="info">13455557777</text>
					</view>
					<view class="input-row border">
						<text class="title">开户银行：</text>
						<text class="info">芳草街支行</text>
						<text class="title">银行帐号：</text>
						<text class="info">64225545877554121</text>
					</view>
					<view class="input-row border">
						<text class="title">户名：</text>
						<text class="info">芳草街支行</text>
						<text class="title">支付宝帐号：</text>
						<text class="info">64225545877554121</text>
					</view>
					<view class="input-row border">
						<text class="title">微信帐号：</text>
						<text class="info">64225545877554121</text>
						<text class="title">会员等级：</text>
						<text class="info">黄金</text>
					</view>
					<view class="input-row border">
						<text class="title">状态：</text>
						<text class="info">未激活</text>
						<text class="title">入职日期：</text>
						<text class="info">2011-02-05</text>
					</view>
					<view class="input-row border">
						<text class="title">离职日期：</text>
						<text class="info">2011-02-05</text>
						<text class="title">推荐人编号：</text>
						<text class="info">2sdfg21348732894</text>
					</view>
					<view class="input-row border">
						<text class="title">推荐人姓名：</text>
						<text class="info">张名江</text>
					</view>
					<view class="input-row border">
						<text class="title">备注：</text>
						<text class="info">张名江张名江张名江张名江</text>
					</view>
					<view class="input-row border">
						<text class="title">密码：</text>
						<input-box type="password" displayable v-model="password" placeholder="请输入密码"></input-box>
					</view>
					<view class="input-row">
						<text class="title">邮箱：</text>
						<input-box type="text" clearable v-model="email" placeholder="请输入邮箱"></input-box>
					</view>
				</view>
			</scroll-view>
		</view>
		<uni-calendar 
			ref="calendar"
			@confirm="confirmCalendar"
		/>
    </view>
</template>

<script>
    import service from '@/service.js';
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	// https://ext.dcloud.net.cn/plugin?id=56
	import uniCalendar from "@/components/uni-calendar/uni-calendar"
    import mInput from '@/components/m-input.vue';

    export default {
        components: {
            inputBox, mInput, uniCalendar
        },
        data() {
            return {
                account: '',
                password: '',
                email: '',
				isModify: false,
				title: '修改'
            }
        },
		onNavigationBarButtonTap(e) {  
			console.log("点击了自定义按钮: " + JSON.stringify(e));
			// #ifdef APP-PLUS
			if (this.title === '修改') {				
				this.title = '确定';
				let webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewButtonStyle(0, {  
					text: '确定' 
				});
			} else {
				this.title = '修改';
				let webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewButtonStyle(0, {  
					text: '修改' 
				});
			}			
			// #endif 
		},
        methods: {
			save() {
				
			},
			selectCalendar() {
				console.log(this.$refs.calendar);
				if(this.title === '确定'){
					this.$refs.calendar.open();
				}
			},
			confirmCalendar(e) {
				console.log('confirm: ', e);
			}
        }
    }
</script>

<style>

</style>
