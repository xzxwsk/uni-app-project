<template>
    <view class="baseInfo">
		<view class="con">
			<scroll-view scroll-y="true" style="width: 100%; height: 100%;" scroll-with-animation>
				<view class="input-group">
					<view class="input-row border">
						<text class="title">编号：</text>
						<text class="info">{{userInfo.DealerNo}}</text>
						<text class="title">姓名：</text>
						<text class="info">{{userInfo.DealerName}}</text>
					</view>
					<view class="input-row border">
						<text class="title">身份证号：</text>
						<text class="info">{{userInfo.IDCardNo}}</text>
					</view>
					<view class="input-row border">
						<text class="title">生日：</text>
						<text :class="'info' + (title === '确定' ? ' input_box' : '')">	
							<text @click="selectCalendar">{{birthDayStr}}</text>
						</text>
						<text class="title">性别：</text>
						<text class="info">{{userInfo.Sex ? '女' : '男'}}</text>
					</view>
					<view class="input-row border">
						<text class="title">籍贯：</text>
						<text class="info">{{userInfo.NativePlace}}</text>
						<text class="title">婚否：</text>
						<text class="info">{{userInfo.HasMarried ? '已婚' : '未婚'}}</text>
					</view>
					<view class="input-row border">
						<text class="title">学历：</text>
						<text class="info">{{userInfo.EducationLevel}}</text>
						<text class="title">邮编：</text>
						<text class="info">{{userInfo.PostCode}}</text>
					</view>
					<view class="input-row border">
						<text class="title">家庭地址：</text>
						<text class="info">{{userInfo.HomeAddress}}</text>
					</view>
					<view class="input-row border">
						<text class="title">手机：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')"><input-box v-if="title === '确定'" type="text" ref="phone" :verification="['isPhoneNum']" clearable :inputValue="userInfo.Mobile" v-model="userInfo.Mobile" placeholder="请输入手机号"></input-box><text v-else>{{userInfo.Mobile}}</text></view>
						<text class="title">EMAIL：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')"><input-box v-if="title === '确定'" type="text" clearable :inputValue="userInfo.Email" v-model="userInfo.Email" placeholder="请输入邮箱"></input-box><text v-else>{{userInfo.Email}}</text></view>
					</view>
					<view class="input-row border">
						<text class="title">紧急联系人：</text>
						<text class="info">{{userInfo.LinkMan}}</text>
						<text class="title">联系人电话：</text>
						<text class="info">{{userInfo.LinkManTel}}</text>
					</view>
					<view class="input-row border">
						<text class="title">户名：</text>
						<text class="info">{{userInfo.AccountName}}</text>
						<text class="title">开户银行：</text>
						<text class="info">{{userInfo.Bank}}</text>
					</view>
					<view class="input-row border">
						<text class="title">银行帐号：</text>
						<text class="info">{{userInfo.AccountNo}}</text>
					</view>
					<view class="input-row border">
						<text class="title">支付宝帐号：</text>
						<text class="info">{{userInfo.AlipayAccNo}}</text>
						<text class="title">微信帐号：</text>
						<text class="info">{{userInfo.MicromsgNo}}</text>
					</view>
					<view class="input-row border">
						<text class="title">经销商等级：</text>
						<text class="info">{{userInfo.LevelId}}</text>
						<text class="title">状态：</text>
						<text class="info">{{stateStr}}</text>
					</view>
					<view class="input-row border">
						<text class="title">加盟日期：</text>
						<text class="info">{{joinDateStr}}</text>
						<text class="title">注销日期：</text>
						<text class="info">{{dimissionDate}}</text>
						<!-- <text class="title">推荐人编号：</text>
						<text class="info">{{userInfo.DealerId}}</text> -->
					</view>
					<view class="input-row border">
						<text class="title">推荐人编号：</text>
						<text class="info">{{userInfo.DealerId}}</text>
					</view>
					<view class="input-row border">
						<text class="title">备注：</text>
						<text class="info">{{userInfo.Remark}}</text>
					</view>
					<view class="input-row border" v-if="this.title === '确定'">
						<text class="title">密码：</text>
						<input-box type="password" ref="password" :verification="['isNull']" :verificationTip="['密码不能为空']" v-model="password" placeholder="请输入密码"></input-box>
					</view>
					<view class="input-row border" v-if="this.title === '确定'">
						<text class="title">确认密码：</text>
						<input-box type="password" v-model="confirmPassword" placeholder="请再次输入密码"></input-box>
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
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';

    export default {
        components: {
            inputBox, mInput, uniCalendar
        },
		computed: {
			...mapState(['userInfo']),
			birthDayStr() {
				return util.formatDate(this.userInfo.BirthDay, 'yyyy-MM-dd');
			},
			stateStr() {
				let state = {
					'0': '正常',
					'4': '注销中',
					'-1': '已注销'
				}
				console.log(this.userInfo);
				return state[String(this.userInfo.State)];
			},
			joinDateStr() {
				return util.formatDate(this.userInfo.JoinDate, 'yyyy-MM-dd');
			},
			dimissionDate() {
				return util.formatDate(this.userInfo.DimissionDate, 'yyyy-MM-dd');
			}
		},
        data() {
            return {
				title: '修改',
				password: '',
				confirmPassword: ''
            }
        },
		onNavigationBarButtonTap(e) {  
			console.log("点击了自定义按钮: " + JSON.stringify(e));
			
			if (this.title === '修改') {	
				// 进入修改
				this.title = '确定';
				// #ifdef APP-PLUS
				let webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewButtonStyle(0, {  
					text: '确定' 
				});
				// #endif 
			} else {
				// 确定保存
				if(this.$refs.phone.getValue() && this.$refs.password.getValue()) {
					// 验证通过
					if (this.password !== this.confirmPassword) {
						util.showToast({
							title: '密码不一致'
						});
					} else {
						this.title = '修改';
						// #ifdef APP-PLUS
						let webView = this.$mp.page.$getAppWebview();
						webView.setTitleNViewButtonStyle(0, {  
							text: '修改' 
						});
						// #endif 
						this.save();
					}
				}
			}			
			
		},
		mounted() {
			console.log('baseInfo mounted', this.userInfo);
			if(!this.userInfo.hasOwnProperty('DealerId')) {
				util.redirectUrl({
					url: '../login/login'
				});
				return;
			}
			for(var key in this.userInfo) {
				if(this.userInfo[key] === null) {
					this.userInfo[key] = '';
				}
			}
		},
        methods: {
			save() {
				this.userInfo.Password = this.password;
				this.userInfo.ChangePassword = true;
				util.ajax({
					method: 'SYS.DealerDAL.Update',
					params: {
						Data: this.userInfo,
					}
				}).then(res => {
					console.log('更新经销商：', res);
				});
			},
			selectCalendar() {
				if(this.title === '确定'){
					// 修改状态打开日期弹窗
					this.$refs.calendar.open();
				}
			},
			confirmCalendar(e) {
				this.userInfo.BirthDay = e.fulldate;
			}
        }
    }
</script>

<style>

</style>
