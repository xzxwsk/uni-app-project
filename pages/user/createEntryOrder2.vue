<template>
	<view class="create_pay_order">
		<view class="input-group">
			<view class="input-row">
				<text class="title"><text class="price">*</text>身份证号：</text>
				<input-box ref="iDCardNo" v-model="billObj.IDCardNo" placeholder="身份证号"></input-box>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>身份证正面照：</text>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<view class="uni-uploader__file" v-if="frontImg != ''">
							<image mode="aspectFit" class="uni-uploader__img" :src="frontImg" :data-src="frontImgSrc" @tap="previewImage"></image>
						</view>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>身份证反面照：</text>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<view class="uni-uploader__file" v-if="backImg != ''">
							<image mode="aspectFit" class="uni-uploader__img" :src="backImg" :data-src="backImgSrc" @tap="previewImage2"></image>
						</view>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage2"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>手机：</text>
				<input-box ref="mobile" v-model="billObj.Mobile" placeholder="手机"></input-box>
			</view>
			<view class="input-row">
				<text class="title">EMAIL：</text>
				<input-box ref="email" v-model="billObj.Email" placeholder="EMAIL"></input-box>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>紧急联系人：</text>
				<input-box ref="linkMan" v-model="billObj.LinkMan" placeholder="紧急联系人"></input-box>
			</view>
			<view class="input-row">
				<text class="title"><text class="price">*</text>联系人电话：</text>
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
				frontImg: '', // 小图
				frontImgSrc: '', // 大图
				backImg: '',
				backImgSrc: '',
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
			if (this.billObj.IDCardNo_FrontImage) {
				this.frontImg = util.getBaseUrl() + 'files/downloadfile?filename=' + this.billObj.IDCardNo_FrontImage;
			}
			if (this.billObj.IDCardNo_BackImage) {
				this.backImg = util.getBaseUrl() + 'files/downloadfile?filename=' + this.billObj.IDCardNo_BackImage;
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
			scaleImg(src) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: src,
						success(res) {
							console.log('image info: ', res);
							resolve(res);
							/* 
							let scale = 1;
							const standard = 800;
							img.src = res.path;
							let imgWidHeight = {
								width: res.width,
								height: res.height;
							}
							if(res.width > res.height) {
								if(res.width > standard) {
									imgWidHeight.width = standard;
									scale = standard/res.width;
									imgWidHeight.height = res.height*scale;
								}
							} else {
								if(res.height > standard) {
									imgWidHeight.height = standard;
									scale = standard/res.height;
									imgWidHeight.width = res.width*scale;
								}
							}
							resolve(imgWidHeight);
							 */
						},
						fail(err) {
							reject(err);
						}
					});
				});
			},
			compressImage(src, imgScale) {
				return new Promise((resolve, reject) => {
					let arr = src.split('/');
					let fileName = arr[arr.length-1];
					let fileNameArr = fileName.split('.');
					let path = arr.slice(0, arr.length-1);
					let width = imgScale.width;
					let height = imgScale.height;
					const standard = '800px';
					if(width > height) {
						width = standard;
						height = 'auto';
					} else {
						width = 'auto';
						height = standard;
					}
					console.log('width:', width, ' height:', height);
					plus.zip.compressImage({
						src: src,
						dst: path.join('/') + '/' + fileNameArr.slice(0, fileNameArr.length-1).join('.') + '_compress.' + fileNameArr[fileNameArr.length-1],
						overwrite: true,
						quality: 70,
						width: width,
						height: height
					}, res => {
						console.log('plus zip compressImage: ', res);
						resolve(res);
					}, err => {
						console.log('plus zip compressImage err: ', err);
						reject(err);
					});
					// uni.compressImage要报err
					/* 
					uni.compressImage({
						src: src,
						quality: 60,
						success: tempFilePath => {
							resolve(tempFilePath);
						},
						fail(err) {
							reject(err);
						}
					});
					 */
				});
			},
			previewImage(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: 0,
					urls: [current]
				})
			},
			uploadFile(file) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: util.getBaseUrl() + 'files/uploadfile',
						filePath: file,
						name: 'file',
						formData: {},
						success: data => {
							let uploadFileRes = JSON.parse(data.data);
							if(uploadFileRes.state === 0) {
								resolve(uploadFileRes.fileName);
							} else {
								reject(data.data);
							}
						},
						fail(err) {
							reject(err);
						}
					});
				});
			},
			async chooseImage() {
				uni.chooseImage({
					sourceType: ['album', 'camera'],
					sizeType: ['original'],
					count: 1,
					success: res => {
						console.log(res, res.tempFiles[0].size, res.tempFiles[0].size > 204800);
						// if(res.tempFiles[0].size > 204800){
						// 	util.showToast({
						// 		title: '图片太大了，请选择200K内的图片',
						// 	});
						// } else {
							// #ifdef APP-PLUS
							// 获取图片宽高
							this.scaleImg(res.tempFilePaths[0])
							.then(imgScaled => {
								// 并设置缩放比例进行压缩
								this.compressImage(res.tempFilePaths[0], imgScaled)
								.then(tempFilePath => {
									console.log(tempFilePath);
									console.log(tempFilePath.size, res.tempFiles[0].size, tempFilePath.size > res.tempFiles[0].size);
									let useImage = '';
									if(tempFilePath.size > res.tempFiles[0].size) {
										// 压缩后比原来还大
										// 使用原来的
										useImage = res.tempFilePaths[0];
									} else {
										// 使用新图片
										useImage = tempFilePath.target;
									}
									console.log('useImage: ', useImage);
									this.uploadFile(useImage)
									.then(uploadFileRes => {
										this.$set(this.billObj, 'IDCardNo_FrontImage', uploadFileRes);
										this.urlToBase64(useImage)
										.then(baseRes => {
										    // 转化后的base64图片地址
										    this.frontImg = util.getBaseUrl() + 'files/downloadfile?filename=' + uploadFileRes;
										    this.frontImgSrc = useImage;
										});
									})
									.catch(err => {
										console.log('err: ', err);
									});
								})
								.catch(err => {
									console.log('err: ', err);
								});
							})
							.catch(err => {
								console.log('err: ', err);
							});
							// #endif
							// #ifdef H5
							this.urlToBase64(res.tempFilePaths[0])
							.then(baseRes => {
							    // 转化后的base64图片地址
							    this.$set(this.billObj, 'IDCardNo_FrontImage', baseRes.split(',')[1]);
							    this.frontImg = baseRes;
							});
							// #endif
						// }
					}
				});
			},
			previewImage2(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: 0,
					urls: [current]
				})
			},
			async chooseImage2() {
				uni.chooseImage({
					sourceType: ['album', 'camera'],
					sizeType: ['original'],
					count: 1,
					success: res => {
						console.log(res);
						// #ifdef APP-PLUS
						// 获取图片宽高
						this.scaleImg(res.tempFilePaths[0])
						.then(imgScaled => {
							// 并设置缩放比例进行压缩
							this.compressImage(res.tempFilePaths[0], imgScaled)
							.then(tempFilePath => {
								let useImage = '';
								if(tempFilePath.size > res.tempFiles[0].size) {
									// 压缩后比原来还大
									// 使用原来的
									useImage = res.tempFilePaths[0];
								} else {
									// 使用新图片
									useImage = tempFilePath.target;
								}
								console.log('useImage: ', useImage);
								this.uploadFile(useImage)
								.then(uploadFileRes => {
									this.$set(this.billObj, 'IDCardNo_BackImage', uploadFileRes);
									this.urlToBase64(useImage)
									.then(baseRes => {
										// 转化后的base64图片地址
										this.backImg = util.getBaseUrl() + 'files/downloadfile?filename=' + uploadFileRes;
										this.backImgSrc = useImage;
									});
								})
								.catch(err => {
									console.log('err: ', err);
								});
							})
							.catch(err => {
								console.log('err: ', err);
							});
						})
						.catch(err => {
							console.log('err: ', err);
						});
						// #endif
						// #ifdef H5
						this.urlToBase64(res.tempFilePaths[0])
						.then(baseRes => {
							// 转化后的base64图片地址
							this.$set(this.billObj, 'IDCardNo_BackImage', baseRes);
							this.backImg = baseRes;
						});
						// #endif
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
				this.billObj.IDCardNo_FrontImage = this.frontImg.split(',')[1];
				this.billObj.IDCardNo_BackImage = this.backImg.split(',')[1];
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
