<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">单据编号：</text>
				<input-box disabled ref="billCode" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">单据日期：</text>
				<input-box disabled ref="billDate" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">分销商编号：</text>
				<input-box disabled ref="dealerNo" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">推荐人姓名：</text>
				<input-box disabled ref="aboveName" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>姓名：</text>
				<input-box ref="dealerName" v-model="billObj.DealerName" placeholder="请输入姓名"></input-box>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>电话：</text>
				<input-box ref="phone" v-model="billObj.Phone" placeholder="请输入电话"></input-box>
			</view>
			<view class="input-row">
				<text class="title">性别：</text>
				<radio-group class="uni-flex" name="gender" @change="changeSex">
					<label><radio value="0" :checked="billObj.Sex === 0" color="#f23030" />男</label>
					<label><radio value="1" :checked="billObj.Sex === 1" color="#f23030" />女</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">籍贯：</text>
				<div style="flex: 1; display: flex;" @click="selectArea">
					{{billObj.NativePlace}}
					<uni-icons type="arrowdown" color="#8f8f94" size="25" />
				</div>
				<!-- <input-box ref="nativePlace" v-model="billObj.NativePlace" placeholder="请输入籍贯"></input-box> -->
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
		computed: mapState(['openid']),
		data() {
			return {
				startDate: '1900-01-01',
				endDate: '2999-12-31',
				themeColor: '#007AFF',
				pickerValueArray: [],
				deepLength: 0,
				pickerValueDefault: [0, 0, 0],
				billObj: {
				  "RecordId": ""  /*单据Id*/,
				  "BillCode": ""  /*单据编号*/,
				  "BillDate": ""  /*单据日期*/,
				  "AboveDealerId": ""  /*推荐人ID*/,
				  "DealerNo": ""  /*分销商编号*/,
				  "DealerName": ""  /*分销商姓名*/,
				  "Phone": "",
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
			console.log('createEntryOrder option: ');
			console.log(option);
			if(option.id) {
				this.setDetail(option.id);
			} else if(option.AboveDealerId) {
				uni.setNavigationBarTitle({
					title: '分销商注册'
				});
				this.getDefault(option.AboveDealerId);
			} else {
				this.getDefault();
			}
		},
		onNavigationBarButtonTap(e) {
			this.goNext();
		},
		methods: {
			...mapMutations(['setBillJoinDAL']),
			setDetail(id) {
				util.showLoading();
				util.ajax({
					method: 'Businese.BillJoinDAL.GetById',
					params: {
						RecordId: id
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					this.billObj = res.data.result;
					let arr = ['Sex', 'State', 'ChangeType', 'iState'];
					for(let key in this.billObj) {
						if (arr.indexOf(key) !== -1) {
							this.billObj[key] = Number(this.billObj[key]);
						} else if (key === 'HasMarried' || key === 'StateChanged') {
							this.billObj[key] = eval(this.billObj[key]);
						} else if (key === 'IdValues') {
							this.billObj[key] = this.billObj[key];
						} else if(util.getType(this.billObj[key]) === 'string'){
							this.billObj[key] = this.billObj[key].trim();
						} else {
							this.billObj[key] = this.billObj[key] || ''
						}
					}
					// 初始化显示值
					this.setInfo();
				});
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
					me.billObj.BirthDay = me.billObj.BirthDay || '请选择日期';
					if(AboveDealerId) {
						me.billObj.isQrcode = true;
					}
					me.$refs.billCode.setValue(res.data.result.BillCode);
					me.$refs.billDate.setValue(res.data.result.BillDate);
					me.$refs.dealerNo.setValue(res.data.result.DealerNo);
					me.$refs.aboveName.setValue(res.data.result.AboveName);
					// 自动带出微信信息(呢称、头像、性别、国家、省份、城市)
					const wxUserInfo = util.getStorageSync('wx_user_info')
					console.log('wxUserInfo: ', wxUserInfo)
					this.billObj.DealerName = wxUserInfo.nickName
					this.billObj.NativePlace = `${wxUserInfo.country}-${wxUserInfo.province}-${wxUserInfo.city}`
					this.billObj.Sex = wxUserInfo.gender === 1 ? 0 : 1
				});
			},
			setInfo() {
				this.$refs.billCode.setValue(this.billObj.BillCode);
				this.$refs.billDate.setValue(this.billObj.BillDate);
				this.$refs.dealerNo.setValue(this.billObj.DealerNo);
				this.$refs.dealerName.setValue(this.billObj.DealerName);
			},
			goNext() {
				this.setBillJoinDAL(this.billObj);
				if(this.$refs.dealerName.getValue()){
					
				} else {
					util.showToast({
						title: '请输入姓名'
					})
					return
				}
				if(this.$refs.phone.getValue()){
					
				} else {
					util.showToast({
						title: '请输入电话号码'
					})
					return
				}
			},
			changeSex(e) {
				// 性别
				this.$set(this.billObj, 'Sex', Number(e.detail.value));
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
			selectArea() {
				this.pickerValueArray = cityData;
				this.mode = 'multiLinkageSelector';
				this.deepLength = 3;
				this.pickerValueDefault = [22, 0, 1];
				this.$refs.mpvuePicker.show();
			}
		}
	}
</script>
