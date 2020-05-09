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
				<text class="title">经销商编号：</text>
				<input-box disabled ref="dealerNo" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>姓名：</text>
				<input-box ref="dealerName" v-model="billObj.DealerName" placeholder="请输入姓名"></input-box>
			</view>
			<view class="input-row">
				<text class="title">出生年月日：</text>
				<view class="date_picker_box">
					<view class="date_picker_box date_box">
						<customDatePicker class="date_picker" @change="bindChangeBirthDay"
							fields="day"
							:start="startDate"
							:end="endDate"
							:value="billObj.BirthDay"
						></customDatePicker>
					</view>
				</view>
			</view>
			<view class="input-row">
				<text class="title">性别：</text>
				<radio-group class="uni-flex" name="gender" @change="changeSex">
					<label><radio value="0" :checked="billObj.Sex === 0" color="#f23030" />男</label>
					<label><radio value="1" :checked="billObj.Sex === 1" color="#f23030" />女</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">婚否：</text>
				<radio-group class="uni-flex" name="marriage" @change="changeMarriage">
					<label><radio value="0" :checked="billObj.HasMarried" color="#f23030" />是</label>
					<label><radio value="1" :checked="!billObj.HasMarried" color="#f23030" />否</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">学历：</text>
				<input-box ref="educationLevel" v-model="billObj.EducationLevel" placeholder="请输入学历"></input-box>
			</view>
			<view class="input-row">
				<text class="title">籍贯：</text>
				<input-box ref="nativePlace" v-model="billObj.NativePlace" placeholder="请输入籍贯"></input-box>
				<!-- <view class="input_box">
				<view class="input_box" @tap="selectArea"> -->
					<!-- <input class="ipt" type="text" disabled v-model="billObj.NativePlace" placeholder="请输入籍贯"></input> -->
					<!-- <view class="uni-icon uni-icon-arrowright"></view>
				</view> -->
			</view>
			<view class="input-row">
				<text class="title">家庭地址：</text>
				<input-box ref="homeAddress" v-model="billObj.HomeAddress" placeholder="请输入详细地址"></input-box>
			</view>
			<view class="input-row">
				<text class="title">邮编：</text>
				<input-box type="number" ref="postCode" v-model="billObj.PostCode" placeholder="邮编"></input-box>
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
	import cityData from '@/common/city.data-3.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox, customDatePicker, mpvuePicker
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
				  "DealerNo": ""  /*经销商编号*/,
				  "DealerName": ""  /*经销商姓名*/,
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
				  "DealerId": ""  /*加盟后经销商Id*/,
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
				});
			},
			setInfo() {
				this.$refs.billCode.setValue(this.billObj.BillCode);
				this.$refs.billDate.setValue(this.billObj.BillDate);
				this.$refs.dealerNo.setValue(this.billObj.DealerNo);
				this.$refs.dealerName.setValue(this.billObj.DealerName);
				this.$refs.educationLevel.setValue(this.billObj.EducationLevel);
				this.$refs.nativePlace.setValue(this.billObj.NativePlace);
				this.$refs.homeAddress.setValue(this.billObj.HomeAddress);
				this.$refs.postCode.setValue(this.billObj.PostCode);
			},
			goNext() {
				this.setBillJoinDAL(this.billObj);
				// let str = '?';
				// let n = 0;
				// for(let key in this.billObj) {
				// 	if (n > 0) {
				// 		str += '&'
				// 	}
				// 	str += key + '=' + this.billObj[key];
				// 	n++;
				// }
				util.goUrl({
					// url: './createEntryOrder2' + str
					url: './createEntryOrder2'
				});
			},
			bindChangeBirthDay(value) {
				// 生日
				this.$set(this.billObj, 'BirthDay', value);
			},
			changeSex(e) {
				// 性别
				this.$set(this.billObj, 'Sex', Number(e.detail.value));
			},
			changeMarriage(e) {
				// 婚否
				this.$set(this.billObj, 'HasMarried', (e.detail.value === '0'));
			},
			onConfirm(e) {
				// 选择地址确定
				console.log('确定： ', e);
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
