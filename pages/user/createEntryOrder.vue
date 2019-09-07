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
				<text class="title">姓名：</text>
				<input-box v-model="billObj.DealerName" placeholder="请输入姓名"></input-box>
			</view>
			<view class="input-row">
				<text class="title">生日：</text>
				<customDatePicker class="date_box" @change="bindChangeBirthDay"
					fields="day"
					:start="startDate"
					:end="endDate"
					:value="billObj.BirthDay"
				></customDatePicker>
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
				<input-box v-model="billObj.EducationLevel" placeholder="请输入学历"></input-box>
			</view>
			<view class="input-row">
				<text class="title">籍贯：</text>
				<view class="input_box">
					<input-box v-model="billObj.NativePlace" placeholder="请输入籍贯"></input-box>
				<!-- <view class="input_box" @tap="selectArea"> -->
					<!-- <input class="ipt" type="text" disabled v-model="billObj.NativePlace" placeholder="请输入籍贯"></input> -->
					<!-- <view class="uni-icon uni-icon-arrowright"></view> -->
				</view>
			</view>
			<view class="input-row">
				<text class="title">家庭地址：</text>
				<input-box v-model="billObj.HomeAddress" placeholder="请输入详细地址"></input-box>
			</view>
			<view class="input-row">
				<text class="title">邮编：</text>
				<input-box type="number" v-model="billObj.PostCode" placeholder="邮编"></input-box>
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
					"RecordId": '',
					"BillCode": '',
					"BillDate": '',
					"AboveDealerId": '',
					"DealerNo": "",
					"DealerName": '',
					"BirthDay": '',
					"NativePlace": '',
					"IDCardNo": '',
					"Sex": 0,
					"HasMarried": false,
					"SpouseName": '',
					"SpouseIDCard": '',
					"EducationLevel": '',
					"HomeAddress": '',
					"PostCode": '',
					"Tel": '',
					"Email": '',
					"Mobile": '',
					"LinkMan": '',
					"LinkManTel": '',
					"Relationship": '',
					"Bank": '',
					"AccountNo": '',
					"AccountName": '',
					"AlipayAccNo": '',
					"MicromsgNo": '',
					"Password": '',
					"Remark": '',
					"DealerId": '',
					"State": 0,
					"Creator": '',
					"CreatorName": '',
					"CreateTime": '',
					"LastModifier": '',
					"LastModifierName": '',
					"LastModifyTime": '',
					"Auditor": '',
					"AuditorName": '',
					"AuditTime": '',
					"StateChanged": false,
					"TimeStamp": '',
					"IDCardNo_FrontImage": '',
					"IDCardNo_BackImage": '',
					"ChangeType": 0,
					"IdValues": [
						''
					],
					"iState": 0
				}
			}
		},
		onLoad() {
			this.getDefault();
		},
		onNavigationBarButtonTap(e) {
			this.goNext();
		},
		methods: {
			getDefault() {
				util.showLoading();
				// 单据ID初始化
				util.ajax({
					method: 'Businese.BillJoinDAL.CreateDefault',
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					this.billObj = res.data.result;
					this.billObj.BillDate = util.formatDate(this.billObj.BillDate, 'yyyy-MM-dd');
					this.$refs.billCode.setValue(res.data.result.BillCode);
					this.$refs.billDate.setValue(res.data.result.BillDate);
					this.$refs.dealerNo.setValue(res.data.result.DealerNo);
				});
			},
			goNext() {
				let str = '?';
				let n = 0;
				for(let key in this.billObj) {
					if (n > 0) {
						str += '&'
					}
					str += key + '=' + this.billObj[key];
					n++;
				}
				util.goUrl({
					url: './createEntryOrder2' + str
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
