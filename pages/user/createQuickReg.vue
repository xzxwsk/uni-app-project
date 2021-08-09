<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">单据编号：</text>
				<input-box disabled ref="billCode" class="ipt" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">单据日期：</text>
				<input-box disabled ref="billDate" class="ipt" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">分销商编号：</text>
				<input-box disabled ref="dealerNo" class="ipt" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">推荐人姓名：</text>
				<input-box disabled ref="aboveName" class="ipt" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>姓名：</text>
				<input-box ref="dealerName" class="ipt" v-model="billObj.DealerName" placeholder="请输入姓名"></input-box>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>电话：</text>
				<input-box ref="phone" class="ipt" v-model="billObj.Mobile" placeholder="请输入电话"></input-box>
				<button class="btn" 
					open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
				>自动获取</button>
			</view>
			<!-- <view class="input-row">
				<text class="title">性别：</text>
				<radio-group class="uni-flex" name="gender" @change="changeSex">
					<label><radio value="0" :checked="billObj.Sex === 0" color="#f23030" />男</label>
					<label><radio value="1" :checked="billObj.Sex === 1" color="#f23030" />女</label>
				</radio-group>
			</view> -->
			<view class="input-row">
				<text class="title"><text class="price">*</text>密码：</text>
				<input-box type="password" ref="password" class="ipt" displayable v-model="billObj.Password" placeholder="请输入密码"></input-box>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>确认密码：</text>
				<input-box type="password" ref="confirmPassword" class="ipt" displayable v-model="confirmPassword" placeholder="请再次输入密码"></input-box>
			</view>
			<view style="height: 50px;"></view>
			<view class="input-row" style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 2; background-color: #fff;">
				<button @click="goNext" class="btn" type="warn" style="height: 35px; line-height: 35px;">注 册</button>
			</view>
		</view>
		<!-- 地址选择器 此处仅保留-->
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :pickerValueDefault="pickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-picker>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	// https://ext.dcloud.net.cn/plugin?id=220
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
	import util from '@/common/util.js';
	import mpvuePicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import uniIcons from '@/components/uni-icon/uni-icon'
	import cityData from '@/common/city.data-3.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox, customDatePicker, mpvuePicker, uniIcons
		},
		computed: mapState(['openid', 'wxUserInfo']),
		data() {
			return {
				interfaceAddr: '',
				code: '',
				startDate: '1900-01-01',
				endDate: '2999-12-31',
				themeColor: '#007AFF',
				pickerValueArray: [],
				deepLength: 0,
				pickerValueDefault: [0, 0, 0],
				uuid: '',
				confirmPassword: '',
				billObj: {
				  "RecordId": ""  /*单据Id*/,
				  "BillCode": ""  /*单据编号*/,
				  "BillDate": ""  /*单据日期*/,
				  "AboveDealerId": ""  /*推荐人ID*/,
				  "DealerNo": ""  /*分销商编号*/,
				  "DealerName": ""  /*分销商姓名*/,
				  "BirthDay": ""  /*生日*/,
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
				  "Password": ""  /*登录密码*/,
				  "Remark": ""  /*备注*/,
				  "DealerId": ""  /*加盟后分销商Id*/,
				  "State": 0  /*State*/,
				  "Creator": ""  /*录入人*/,
				  "CreatorName": ""  /*录入人姓名*/,
				  "CreateTime": ""  /*录入时间*/,
				  "LastModifier": ""  /*最后修改人*/,
				  "LastModifierName": ""  /*最后修改人姓名*/,
				  "LastModifyTime": ""  /*最后修改时间*/,
				  "Auditor": ""  /*审核人*/,
				  "AuditorName": ""  /*审核人姓名*/,
				  "AuditTime": ""  /*审核时间*/,
				  "StateChanged": false  /*状态是否发生过改变*/,
				  "TimeStamp": ""  /*时间戳*/,
				  "FrontImageFileName": ""  /*正面身份证照片服务器文件名*/,
				  "BackImageFileName": ""  /*反面身份证照片服务器文件名*/,
				  "ChangeType": 0,
				  "IdValues": [
					""
				  ],
				  "iState": 1,
				  "AboveNo": "",
				  "AboveName": ""
				}
			}
		},
		onLoad(option) {
			console.log('createQuickReg option: ');
			let AboveDealerId = option.AboveDealerId
			if (option.q) {
				const q = decodeURIComponent(option.q);
				const arr = q.split('/')
				AboveDealerId = arr[arr.length - 1]
			}
			console.log(option, AboveDealerId);
			this.init({
				AboveDealerId
			})
		},
		onNavigationBarButtonTap(e) {
			this.goNext();
		},
		methods: {
			...mapMutations(['login', 'setBillJoinDAL', 'setUserInfo']),
			init(option) {
				console.log('option: ', option)
				this.interfaceAddr = util.getBaseUrl();
				this.getDeviceId()
				if(option.AboveDealerId) {
					uni.setNavigationBarTitle({
						title: '分销商注册'
					});
					this.getDefault(option.AboveDealerId);
				} else {
					this.getDefault();
				}
			},
			async getPhoneNumber(e) {
				console.log('getPhoneNumber: ', e)
				await this.getCode()
				await util.ajax({
					method: 'SYS.UserDAL.WxDecrypt',
					params: {
						Code: this.code,
						encryptedData: e.detail.encryptedData,
						encryptIv: e.detail.iv
					}
				}).then(res => {
					this.billObj.Mobile = JSON.parse(res.data.result).purePhoneNumber
					this.$refs.phone.setValue(this.billObj.Mobile);
				})
				this.bindReg()
			},
			getDefault(AboveDealerId) {
				let me = this;
				util.showLoading();
				let prompt = {};
				let method = 'Businese.BillJoinDAL.CreateDefault';
				// 扫码带的加盟id
				if(AboveDealerId) {
					prompt.AboveDealerId = AboveDealerId;
					method = 'Businese.BillJoinDAL.CreateDefaultByRegister';
				}
				// 单据ID初始化
				util.ajax({
					method: method,
					params: prompt,
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					res.data.result = util.jsonReplace(res.data.result,'null','""');
					me.billObj = res.data.result;
					me.billObj.BillDate = util.formatDate(me.billObj.BillDate, 'yyyy-MM-dd');
					me.billObj.BirthDay = me.billObj.BirthDay || '';
					if(AboveDealerId) {
						me.billObj.isQrcode = true;
					}
					me.$refs.billCode.setValue(res.data.result.BillCode);
					me.$refs.billDate.setValue(res.data.result.BillDate);
					me.$refs.dealerNo.setValue(res.data.result.DealerNo);
					me.$refs.aboveName.setValue(res.data.result.AboveName);
					// 自动带出微信信息(呢称、头像、性别、国家、省份、城市)
					const wxUserInfo = this.wxUserInfo
					console.log('wxUserInfo: ', wxUserInfo)
					this.billObj.DealerName = wxUserInfo.nickName
					this.billObj.NativePlace = `${wxUserInfo.country}${wxUserInfo.province}${wxUserInfo.city}`
					this.billObj.Sex = wxUserInfo.gender === 1 ? 0 : 1
					this.setInfo()
				});
			},
			setInfo() {
				this.$refs.billCode.setValue(this.billObj.BillCode);
				this.$refs.billDate.setValue(this.billObj.BillDate);
				this.$refs.dealerNo.setValue(this.billObj.DealerNo);
				this.$refs.dealerName.setValue(this.billObj.DealerName);
				this.$refs.password.setValue(this.billObj.Password);
				this.$refs.confirmPassword.setValue(this.confirmPassword);
			},
			async goNext() {
				this.setBillJoinDAL(this.billObj);
				if(!this.$refs.dealerName.getValue()){
					util.showToast({
						title: '请输入姓名'
					})
					return
				}
				let phone = this.$refs.phone.getValue()
				if(!phone){
					util.showToast({
						title: '请输入电话号码'
					})
					return
				}
				if (this.billObj.Password === '') {
					util.showToast({
						title: '密码不能为空'
					});
					return;
				}
				if (this.confirmPassword !== this.billObj.Password) {
					util.showToast({
						title: '密码不一致'
					});
					return;
				}
				util.showLoading();
				await util.ajax({
					method: 'Businese.BillJoinDAL.Create',
					params: {
						Bill: this.billObj
					},
				}).catch(err => {
					util.hideLoading();
				})
				// 注册成功后绑定微信
				await this.getCode()
				this.bindLogin({
					account: this.billObj.Mobile,
					password: this.billObj.Password
				})
			},
			changeSex(e) {
				// 性别
				this.$set(this.billObj, 'Sex', Number(e.detail.value));
			},
			selectArea() {
				this.pickerValueArray = cityData;
				this.mode = 'multiLinkageSelector';
				this.deepLength = 3;
				this.pickerValueDefault = [22, 0, 1];
				this.$refs.mpvuePicker.show();
			},
			onConfirm(e) {
				// 选择地址确定
				console.log('确定： ', e);
				this.billObj.NativePlace = e.label
			},
			onCancel(e) {
				// 选择地址取消
				console.log('取消： ', e);
			},
			autoLogin(sessionId) {
				let me = this;
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
							if (!res.data.hasOwnProperty('error') && res.data.hasOwnProperty('result')) {
								res.data.result = util.jsonReplace(res.data.result, 'null', '""');
								me.setUserInfo(res.data.result);
								me.login(res.data.result.DealerName);
								util.goTab({
									url: '/pages/tabBar/index'
								})
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
							})
						}
					}
				})
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
							console.log('getCode: ', res)
							if (res.errMsg == "login:ok") {
								this.code = res.code
								resolve()
							} else {
								reject()
							}
						},
						fail: err => {
							reject(err)
						}
					})
				})
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
					console.log('WxLogin: ', res, result)
					if (result) {
						util.setStorageSync({
							key: 'session_id',
							data: result
						});
						this.autoLogin(result)
					}
				})
			},
			async bindLogin({ account, password }) {
				let me = this;
				await util.ajax({
					method: 'SYS.UserDAL.BindWxUser',
					params: {
						UserName: account,
						LoginInfo: {
							Password: password,
							VerifyCode: '',
							ClientType: 1,
							ClientVersion: '1.0.0.1',
							EncyptType: 0,
							DeviceId: ''
						},
						WxCode: this.code
					},
					tags: {
						usertoken: '',
						sessionid: ''
					}
				})
				.then(res => {
					console.log('绑定成功： ', res);
					util.showToast({
						title: '绑定成功',
						success: () => {
							// 调wxLogin
							this.wxLogin()
						}
					})
				})
				.finally(() => {
					util.hideLoading();
				})
			},
		}
	}
</script>

<style scoped>
	.ipt{flex: 1; font-size: 15px;}
	.btn{line-height: 2; font-size: 15px;}
	.input-row{font-size: 15px;}
	/deep/ .ipt .input-box-center-text{font-size: 15px;}
</style>