<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title">身份证号：</text>
				<input-box ref="iDCardNo" v-model="billObj.IDCardNo" placeholder="身份证号"></input-box>
			</view>
			<view class="input-row">
				<text class="title">身份证正面照：</text>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<view class="uni-uploader__file" v-if="frontImg != ''">
							<image class="uni-uploader__img" :src="frontImg" :data-src="frontImg" @tap="previewImage"></image>
						</view>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="input-row">
				<text class="title">身份证反面照：</text>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<view class="uni-uploader__file" v-if="backImg != ''">
							<image class="uni-uploader__img" :src="backImg" :data-src="backImg" @tap="previewImage"></image>
						</view>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage2"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="input-row">
				<text class="title">手机：</text>
				<input-box ref="mobile" v-model="billObj.Mobile" placeholder="手机"></input-box>
			</view>
			<view class="input-row">
				<text class="title">EMAIL：</text>
				<input-box ref="email" v-model="billObj.Email" placeholder="EMAIL"></input-box>
			</view>
			<view class="input-row">
				<text class="title">紧急联系人：</text>
				<input-box ref="linkMan" v-model="billObj.LinkMan" placeholder="紧急联系人"></input-box>
			</view>
			<view class="input-row">
				<text class="title">联系人电话：</text>
				<input-box ref="linkManTel" v-model="billObj.LinkManTel" placeholder="联系人电话"></input-box>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<input-box type="password" ref="password" displayable v-model="billObj.Password" placeholder="请输入密码"></input-box>
			</view>
			<view class="input-row">
				<text class="title">确认密码：</text>
				<input-box type="password" ref="confirmPassword" displayable v-model="confirmPassword" placeholder="请再次输入密码"></input-box>
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
	import cityData from '@/common/city.data-3.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox, customDatePicker
		},
		computed: mapState(['billJoinDAL']),
		data() {
			return {
				dateValue: '',
				startDate: '1900-01',
				endDate: '2199-12',
				protocal: false,
				frontImg: frontImg,
				backImg: backImg,
				pickerValueArray: [],
				mode: '',
				deepLength: 0,
				pickerValueDefault: [],
				confirmPassword: '',
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
		onLoad(option) {
			// for(let key in option) {
			// 	this.billObj[key] = option[key] !== 'null' ? option[key] : this.billObj[key];
			// }
			this.billObj = this.billJoinDAL;
			if (this.billObj.Password !== '') {
				this.confirmPassword = this.billObj.Password;
			}
		},
		onNavigationBarButtonTap(e) {
			this.goNext();
		},
		mounted() {
			this.$nextTick(() => {
				// 初始化显示值
				this.setInfo();
			});
		},
		methods: {
			...mapMutations(['setBillJoinDAL']),
			previewImage(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: [this.frontImg]
				})
			},
			async chooseImage() {
				uni.chooseImage({
					sourceType: ['album', 'camera'],
					sizeType: ['compressed'],
					count: 1,
					success: res => {
						console.log(res, res.tempFiles[0].size, res.tempFiles[0].size > 512000);
						if(res.tempFiles[0].size > 512000){
							util.showToast({
								title: '图片太大了，请选择500K内的图片',
							});
							// #ifdef APP-PLUS
								
							// #endif
							// #ifdef H5
							// plus.zip.compressImage({
							// 	src: res.tempFilePaths[0],
							// 	dst: res.tempFilePaths[0],
							// 	overwrite: true,
							// 	quality: 60
							// }, res => {
							// 	console.log(res);
							// }, err => {
							// 	console.log(err);
							// });
							// uni.compressImage({
							// 	src: res.tempFilePaths[0],
							// 	quality: 60,
							// 	success: tempFilePath => {
							// 		console.log(tempFilePath);
							// 		this.urlToBase64(tempFilePath).then(baseRes => {
							// 		  // 转化后的base64图片地址
							// 		  this.$set(this.billObj, 'IDCardNo_FrontImage', baseRes);
							// 		  this.frontImg = baseRes;
							// 		});
							// 	},
							// 	fail: err => {
							// 		console.log('err: ', err);
							// 	}
							// });
							// #endif
						} else {
							// this.frontImg = res.tempFilePaths[0];
							this.urlToBase64(res.tempFilePaths[0]).then(baseRes => {
							    // 转化后的base64图片地址
							    this.$set(this.billObj, 'IDCardNo_FrontImage', baseRes.split(',')[1]);
							    this.frontImg = baseRes;
							});
						}
					}
				});
			},			
			previewImage2(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: [this.backImg]
				})
			},
			async chooseImage2() {
				uni.chooseImage({
					sourceType: ['album', 'camera'],
					sizeType: ['compressed'],
					count: 1,
					success: res => {
						console.log(res);
						if(res.tempFiles[0].size > 512000){
							util.showToast({
								title: '图片太大了，请选择500K内的图片',
							});
						} else {
							this.urlToBase64(res.tempFilePaths[0]).then(baseRes => {
							  // 转化后的base64图片地址
							  this.$set(this.billObj, 'IDCardNo_BackImage', baseRes.split(',')[1]);
							  this.backImg = baseRes;
							});
						}
					}
				});
			},
			setInfo() {
				this.$refs.iDCardNo.setValue(this.billObj.IDCardNo);
				this.frontImg = (this.billObj.IDCardNo_FrontImage !== '') ? ((this.billObj.IDCardNo_FrontImage.indexOf('data:image/jpeg;base64,') !== -1 ? '' : 'data:image/jpeg;base64,') + this.billObj.IDCardNo_FrontImage) : '';
				this.backImg = (this.billObj.IDCardNo_BackImage !== '') ? ((this.billObj.IDCardNo_BackImage.indexOf('data:image/jpeg;base64,') !== -1 ? '' : 'data:image/jpeg;base64,') + this.billObj.IDCardNo_BackImage) : '';
				this.$refs.mobile.setValue(this.billObj.Mobile);
				this.$refs.email.setValue(this.billObj.Email);
				this.$refs.linkMan.setValue(this.billObj.LinkMan);
				this.$refs.linkManTel.setValue(this.billObj.LinkManTel);
				this.$refs.password.setValue(this.billObj.Password);
				this.$refs.confirmPassword.setValue(this.confirmPassword);
			},
			goNext() {
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
				this.setBillJoinDAL(this.billObj);
				util.goUrl({
					url: './createEntryOrder3'
				});
			},
			urlToBase64(url) {
			  return new Promise ((resolve,reject) => {
				// #ifdef APP-PLUS
				plus.io.resolveLocalFileSystemURL(url, function(entry){
				  	// 可通过entry对象操作test.html文件
				  	entry.file( function(file){
				  		let fileReader = new plus.io.FileReader();
				  		fileReader.onloadend = function(evt) {
				  			const data = fileReader.result;
							console.log('APP-PLUS');
				  			resolve(data);
				  		}
				  		fileReader.readAsDataURL( file );
				  	});
				});
				// #endif
				// #ifdef H5
				fetch(url).then(data=>{
					const blob = data.blob();
					return blob;
				}).then(blob=>{
					let reader = new window.FileReader();
					reader.onloadend = function() {
						const data = reader.result;
						console.log('H5');
						resolve(data);
					};
					reader.readAsDataURL(blob);
				});
				// #endif
			  });
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>
