<template>
    <view class="baseInfo">
		<view class="con">
			<scroll-view scroll-y="true" style="width: 100%; height: 100%;" scroll-with-animation>
				<view class="input-group">
					<!-- <view class="input-row border" v-if="title === '确定'">
						<text class="title">密码：</text>
						<input-box type="password" ref="password" :verification="['isNull']" :verificationTip="['密码不能为空']" v-model="password" placeholder="请输入密码"></input-box>
					</view>
					<view class="input-row border" v-if="title === '确定'">
						<text class="title">确认密码：</text>
						<input-box type="password" v-model="confirmPassword" placeholder="请再次输入密码"></input-box>
					</view> -->
					<view class="input-row border">
						<text class="title">编号：</text>
						<text class="info">{{modifyUserInfo.DealerNo}}</text>
						<text class="title">姓名：</text>
						<text class="info">{{modifyUserInfo.DealerName}}</text>
					</view>
					<view class="input-row border">
						<text class="title">身份证号：</text>
						<text class="info">{{modifyUserInfo.IDCardNo}}</text>
					</view>
					<view class="input-row border">
						<text class="title">生日：</text>
						<view class="search_box" v-if="title === '确定'">
							<view class="date_picker_box">
								<customDatePicker class="date_picker"
									fields="day"
									:start="startDate"
									:end="endDate"
									:value="birthDayStr"
								></customDatePicker>
							</view>
						</view>
						<text class="info" v-else>
							<text @click="selectCalendar">{{birthDayStr}}</text>
						</text>
						<text class="title">性别：</text>
						<view class="info">
							<radio-group @change="changeSex" v-if="title === '确定'">
								<label class="radio"><radio value="0" color="#f23030" :checked="modifyUserInfo.Sex === 0" />男</label>
								<label class="radio"><radio value="1" color="#f23030" :checked="modifyUserInfo.Sex === 1" />女</label>
							</radio-group>
							<text v-else>{{['男', '女'][modifyUserInfo.Sex]}}</text>
						</view>
					</view>
					<view class="input-row border">
						<text class="title">籍贯：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="nativePlace" clearable :inputValue="modifyUserInfo.NativePlace" v-model="modifyUserInfo.NativePlace" placeholder="请输入籍贯"></input-box>
							<text v-else>{{modifyUserInfo.NativePlace}}</text>
						</view>
						<text class="title">婚否：</text>
						<view class="info">
							<radio-group @change="changeHasMarried" v-if="title === '确定'">
								<label class="radio"><radio value="true" color="#f23030" :checked="modifyUserInfo.HasMarried" />是</label>
								<label class="radio"><radio value="false" color="#f23030" :checked="!modifyUserInfo.HasMarried" />否</label>
							</radio-group>
							<text v-else>{{modifyUserInfo.HasMarried ? '已婚' : '未婚'}}</text>
						</view>
					</view>
					<view class="input-row border">
						<text class="title">学历：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="educationLevel" clearable :inputValue="modifyUserInfo.EducationLevel" v-model="modifyUserInfo.EducationLevel" placeholder="请输入学历"></input-box>
							<text v-else>{{modifyUserInfo.EducationLevel}}</text>
						</view>
						<text class="title">邮编：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="postCode" clearable :inputValue="modifyUserInfo.PostCode" v-model="modifyUserInfo.PostCode" placeholder="请输入邮编"></input-box>
							<text v-else>{{modifyUserInfo.PostCode}}</text>
						</view>
					</view>
					<view class="input-row border" @click="selectAddr">
						<text class="title">家庭地址：</text>
						<view :class="'uni-list-cell-navigate' + (title === '确定' ? ' uni-navigate-right' : '')" @click="selectAddr">{{modifyUserInfo.HomeAddress}}</view>
					</view>
					<view class="input-row border">
						<text class="title">手机：</text>
						<!-- <view :class="'info' + (title === '确定' ? ' input_box' : '')"><input-box v-if="title === '确定'" type="text" ref="phone" :verification="['isPhoneNum']" clearable :inputValue="modifyUserInfo.Mobile" v-model="modifyUserInfo.Mobile" placeholder="请输入手机号"></input-box><text v-else>{{modifyUserInfo.Mobile}}</text></view> -->
						<view class="'info'"><text>{{modifyUserInfo.Mobile}}</text></view>
						<text class="title">EMAIL：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')"><input-box v-if="title === '确定'" type="text" clearable :inputValue="modifyUserInfo.Email" v-model="modifyUserInfo.Email" placeholder="请输入邮箱"></input-box><text v-else>{{modifyUserInfo.Email}}</text></view>
					</view>
					<view class="input-row border">
						<text class="title">紧急联系人：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="linkMan" clearable :inputValue="modifyUserInfo.LinkMan" v-model="modifyUserInfo.LinkMan" placeholder="请输入联系人"></input-box>
							<text v-else>{{modifyUserInfo.LinkMan}}</text>
						</view>
						<text class="title">联系人电话：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="number" ref="linkManTel" clearable :inputValue="modifyUserInfo.LinkManTel" :verification="['isPhoneNum']" v-model="modifyUserInfo.LinkManTel" placeholder="请输入联系人电话"></input-box>
							<text v-else>{{modifyUserInfo.LinkManTel}}</text>
						</view>
					</view>
					<view class="input-row border">
						<text class="title">户名：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="accountName" clearable :inputValue="modifyUserInfo.AccountName" v-model="modifyUserInfo.AccountName" placeholder="请输入户名"></input-box>
							<text v-else>{{modifyUserInfo.AccountName}}</text>
						</view>
						<text class="title">开户银行：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="bank" clearable :inputValue="modifyUserInfo.Bank" v-model="modifyUserInfo.Bank" placeholder="请输入开户银行"></input-box>
							<text v-else>{{modifyUserInfo.Bank}}</text>
						</view>
					</view>
					<view class="input-row border">
						<text class="title">银行帐号：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="accountNo" clearable :inputValue="modifyUserInfo.AccountNo" v-model="modifyUserInfo.AccountNo" placeholder="请输入银行帐号"></input-box>
							<text v-else>{{modifyUserInfo.AccountNo}}</text>
						</view>
					</view>
					<view class="input-row border">
						<text class="title">支付宝帐号：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="alipayAccNo" clearable :inputValue="modifyUserInfo.AlipayAccNo" v-model="modifyUserInfo.AlipayAccNo" placeholder="请输入支付宝帐号"></input-box>
							<text v-else>{{modifyUserInfo.AlipayAccNo}}</text>
						</view>
						<text class="title">微信帐号：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="micromsgNo" clearable :inputValue="modifyUserInfo.MicromsgNo" v-model="modifyUserInfo.MicromsgNo" placeholder="请输入微信帐号"></input-box>
							<text v-else>{{modifyUserInfo.MicromsgNo}}</text>
						</view>
					</view>
					<view class="input-row border">
						<text class="title">经销商等级：</text>
						<text class="info">{{modifyUserInfo.DealerLevel}}</text>
						<text class="title">状态：</text>
						<text class="info">{{stateStr}}</text>
					</view>
					<view class="input-row border">
						<text class="title">加盟日期：</text>
						<text class="info">{{joinDateStr}}</text>
						<text class="title">注销日期：</text>
						<view class="search_box" v-if="title === '确定'">
							<view class="date_picker_box">
								<customDatePicker class="date_picker" @change="bindChangeDimissionDate"
									fields="day"
									:start="startDate"
									:end="endDate"
									:value="modifyUserInfo.DimissionDate"
								></customDatePicker>
							</view>
						</view>
						<text class="info" v-else>{{dimissionDate}}</text>
					</view>
					<view class="input-row border">
						<text class="title">推荐人编号：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="aboveDealerNo" clearable :inputValue="modifyUserInfo.AboveDealerNo" v-model="modifyUserInfo.AboveDealerNo" placeholder="请输入推荐人编号"></input-box>
							<text v-else>{{modifyUserInfo.AboveDealerNo}}</text>
						</view>
					</view>
					<view class="input-row border">
						<text class="title">推荐人姓名：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="aboveDealerName" clearable :inputValue="modifyUserInfo.AboveDealerName" v-model="modifyUserInfo.AboveDealerName" placeholder="请输入推荐人姓名"></input-box>
							<text v-else>{{modifyUserInfo.AboveDealerName}}</text>
						</view>
					</view>
					<view class="input-row border">
						<text class="title">备注：</text>
						<view :class="'info' + (title === '确定' ? ' text_area_box' : '')">
							<textarea v-if="title === '确定'" v-model="modifyUserInfo.Remark" class="text_area" placeholder="请输入备注信息"/>
							<text v-else>{{modifyUserInfo.Remark}}</text>
						</view>
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
	// https://ext.dcloud.net.cn/plugin?id=56 日历控制
	import uniCalendar from "@/components/uni-calendar/uni-calendar"
	// https://ext.dcloud.net.cn/plugin?id=220 日期选择
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
    import mInput from '@/components/m-input.vue';
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';

    export default {
        components: {
            inputBox, mInput, uniCalendar, customDatePicker
        },
		computed: {
			...mapState(['hasLogin', 'userInfo']),
			birthDayStr() {
				return util.formatDate(this.modifyUserInfo.BirthDay, 'yyyy-MM-dd');
			},
			stateStr() {
				let state = {
					'0': '正常',
					'4': '注销中',
					'-1': '已注销'
				}
				console.log(this.modifyUserInfo);
				return state[String(this.modifyUserInfo.State)];
			},
			joinDateStr() {
				return util.formatDate(this.modifyUserInfo.JoinDate, 'yyyy-MM-dd');
			},
			dimissionDate() {
				return util.formatDate(this.modifyUserInfo.DimissionDate, 'yyyy-MM-dd');
			}
		},
        data() {
            return {
				title: '修改',
				startDate: '1900-01-01',
				endDate: '2999-12-31',
				password: '',
				confirmPassword: '',
				addr: {
					PersonName: '',
					Mobile: '',
					Address: '请选择家庭地址'
				},
				modifyUserInfo: {
					"DealerId": ""  /*经销商ID*/,
					"AboveDealerId": ""  /*推荐人ID*/,
					"DealerNo": ""  /*经销商编号*/,
					"DealerName": ""  /*经销商姓名*/,
					"BirthDay": "2020-02-15T10:18:41.13493+08:00"  /*生日*/,
					"NativePlace": ""  /*籍贯*/,
					"IDCardNo": ""  /*身份证号*/,
					"Sex": 0  /*0 男 1 女*/,
					"HasMarried": false  /*婚否*/,
					"SpouseName": ""  /*配偶姓名*/,
					"SpouseIDCard": ""  /*配偶身份证号*/,
					"EducationLevel": ""  /*学历*/,
					"HomeAddress": ""  /*家庭住址*/,
					"PostCode": ""  /*邮政编码*/,
					"Tel": ""  /*电话*/,
					"Email": ""  /*EMAIL*/,
					"Mobile": ""  /*手机*/,
					"LinkMan": ""  /*联系人*/,
					"LinkManTel": ""  /*联系人电话*/,
					"Relationship": ""  /*和申请人关系*/,
					"Bank": ""  /*开户银行*/,
					"AccountNo": ""  /*开户行账号*/,
					"AccountName": ""  /*开户行户名*/,
					"AlipayAccNo": ""  /*支付宝账号*/,
					"MicromsgNo": ""  /*微信账号*/,
					"Remark": ""  /*备注*/,
					"JoinDate": "2020-02-15T10:18:41.13493+08:00"  /*加盟日期*/,
					"DimissionDate": "2020-02-15T10:18:41.13493+08:00"  /*注销日期*/,
					"State": 0  /*状态*/,
					"Password": ""  /*登录密码*/,
					"Locked": false  /*是否锁定*/,
					"LevelId": ""  /*经销商等级*/,
					"Used": false  /*是否已使用*/,
					"LevelValidDate": "2020-02-15T10:18:41.13493+08:00"  /*经销商等级有效期*/,
					"DealerLevel": 1,
					"AboveDealerNo": "",
					"AboveDealerName": "",
					"BankInfo": "无银行账号",
					"AlipayInfo": "无支付宝账号",
					"MicromsgInfo": "无微信账号",
					"IdValues": [
					  ""
					],
					"ChangeType": 0
				}
            }
        },
		onNavigationBarButtonTap(e) {  
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
				// if(this.$refs.password.getValue()) {
					// 验证通过
					// if (this.password !== this.confirmPassword) {
					// 	util.showToast({
					// 		title: '密码不一致'
					// 	});
					// } else {
						this.title = '修改';
						// #ifdef APP-PLUS
						let webView = this.$mp.page.$getAppWebview();
						webView.setTitleNViewButtonStyle(0, {  
							text: '修改' 
						});
						// #endif 
						this.save();
				// 	}
				// }
			}
		},
		mounted() {
			if(!this.hasLogin) {
				util.redirectUrl({
					url: '../login/login'
				});
				return;
			}
			for(var key in this.userInfo) {
				if(this.userInfo[key] === null) {
					this.modifyUserInfo[key] = '';
				} else {
					this.modifyUserInfo[key] = this.userInfo[key];
				}
			}
		},
		watch: {
			addr(oldVal, newVal) {
				this.modifyUserInfo.HomeAddress = this.addr.Address
			}
		},
        methods: {
			...mapMutations(['setUserInfo']),
			changeSex(e) {
				// 性别
				this.modifyUserInfo.Sex = Number(e.detail.value);
			},
			changeHasMarried(e) {
				// 婚否
				this.modifyUserInfo.HasMarried = e.detail.value === 'true';
			},
			selectAddr() {
				if (this.title === '确定') {
					// 地址
					util.goUrl({
						url: '../addr/addr?mode=select'
					});
				}
			},
			bindChangeDimissionDate(value) {
				this.modifyUserInfo.DimissionDate = value;
			},
			save() {
				let me = this;
				// this.modifyUserInfo.Password = this.password;
				// this.modifyUserInfo.ChangePassword = true;
				util.showLoading();
				util.ajax({
					method: 'SYS.DealerDAL.Update',
					params: {
						Data: this.modifyUserInfo,
					}
				}).then(res => {
					util.hideLoading();
					util.dialog({
						content: '保存成功',
						showCancel: false,
						success(e) {
							console.log(e);
							me.setUserInfo(res.data.result);
						}
					});
				});
			},
			selectCalendar() {
				if(this.title === '确定'){
					// 修改状态打开日期弹窗
					this.$refs.calendar.open();
				}
			},
			confirmCalendar(e) {
				this.modifyUserInfo.BirthDay = e.fulldate;
			}
        }
    }
</script>

<style>

</style>
