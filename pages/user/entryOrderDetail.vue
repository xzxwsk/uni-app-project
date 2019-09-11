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
				<input-box disabled ref="dealerName" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">生日：</text>
				<customDatePicker class="date_box"
					fields="day"
					:start="startDate"
					:end="endDate"
					:value="billObj.BirthDay"
				></customDatePicker>
			</view>
			<view class="input-row">
				<text class="title">性别：</text>
				<radio-group class="uni-flex" name="gender">
					<label><radio value="0" :checked="billObj.Sex === 0" color="#f23030" />男</label>
					<label><radio value="1" :checked="billObj.Sex === 1" color="#f23030" />女</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">婚否：</text>
				<radio-group class="uni-flex" name="marriage">
					<label><radio value="0" :checked="billObj.HasMarried" color="#f23030" />是</label>
					<label><radio value="1" :checked="!billObj.HasMarried" color="#f23030" />否</label>
				</radio-group>
			</view>
			<view class="input-row">
				<text class="title">学历：</text>
				<input-box disabled ref="educationLevel" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">籍贯：</text>
				<input-box disabled ref="nativePlace" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">家庭地址：</text>
				<input-box disabled ref="homeAddress" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">邮编：</text>
				<input-box type="number" disabled ref="postCode" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">身份证号：</text>
				<input-box disabled ref="iDCardNo" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">身份证正面照：</text>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<view class="uni-uploader__file" v-if="frontImg != ''">
							<image class="uni-uploader__img" :src="frontImg" :data-src="frontImg" @tap="previewImage" @error="imageError"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="input-row">
				<text class="title">身份证反面照：</text>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<view class="uni-uploader__file" v-if="backImg != ''">
							<image class="uni-uploader__img" :src="backImg" :data-src="backImg" @tap="previewImage2" @error="imageError"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="input-row">
				<text class="title">手机：</text>
				<input-box disabled ref="mobile" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">EMAIL：</text>
				<input-box disabled ref="email" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">紧急联系人：</text>
				<input-box disabled ref="linkMan" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">联系人电话：</text>
				<input-box disabled ref="linkManTel" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">开户银行：</text>
				<input-box disabled ref="bank" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">银行帐号：</text>
				<input-box disabled ref="accountNo" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">户名：</text>
				<input-box disabled ref="accountName" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">支付宝帐号：</text>
				<input-box disabled ref="alipayAccNo" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">微信帐号：</text>
				<input-box disabled ref="micromsgNo" :clearShow="false"></input-box>
			</view>
			<view class="input-row">
				<text class="title">备注：</text>
				<input-box disabled ref="remark" :clearShow="false"></input-box>
			</view>
		</view>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	// https://ext.dcloud.net.cn/plugin?id=220
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
	import util from '@/common/util.js';
	import frontImg from '@/static/img/H_027_1.jpg';
	import backImg from '@/static/img/H_9X10_1.jpg';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox, customDatePicker
		},
		computed: mapState(['openid']),
		data() {
			return {
				mode: 'widthFix',
				startDate: '2010-01-01',
				endDate: '2199-12-31',
				frontImg: frontImg,
				backImg: backImg,
				billObj: {}
			}
		},
		onLoad(option) {
			this.init(option.id);
		},		
		onNavigationBarButtonTap(e) {
			this.edit();
		},
		methods: {
			init(id) {
				this.getDetail(id);
			},
			getDetail(id) {
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
					console.log('加盟单详情: ', res);
					this.billObj = res.data.result;
					// 初始化显示值
					this.setInfo();
					// 审核前可以修改
					if (res.data.result.State < 2) {
						let webView = this.$mp.page.$getAppWebview();
						webView.setTitleNViewButtonStyle(0, {  
							text: '修改',
							fontSize: '14px',
							width: 'auto'
						});
					}
				});
			},
			edit() {
				util.goUrl({
					url: './createEntryOrder?id=' + this.billObj.RecordId
				})
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
				this.$refs.iDCardNo.setValue(this.billObj.IDCardNo);
				this.frontImg = 'data:image/jpeg;base64,' + this.billObj.IDCardNo_FrontImage;
				this.backImg = 'data:image/jpeg;base64,' + this.billObj.IDCardNo_BackImage;
				this.$refs.mobile.setValue(this.billObj.Mobile);
				this.$refs.email.setValue(this.billObj.Email);
				this.$refs.linkMan.setValue(this.billObj.LinkMan);
				this.$refs.linkManTel.setValue(this.billObj.LinkManTel);
				this.$refs.bank.setValue(this.billObj.Bank);
				this.$refs.accountNo.setValue(this.billObj.AccountNo);
				this.$refs.accountName.setValue(this.billObj.AccountName);
				this.$refs.alipayAccNo.setValue(this.billObj.AlipayAccNo);
				this.$refs.micromsgNo.setValue(this.billObj.MicromsgNo);
				this.$refs.remark.setValue(this.billObj.Remark);
			},
			previewImage(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: [this.frontImg]
				})
			},
			previewImage2(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: [this.backImg]
				})
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
