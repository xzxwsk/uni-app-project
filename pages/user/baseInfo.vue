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
									@change="bindChangeBirthDay"
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
					</view>
					<view class="input-row border">
						<text class="title">支付宝收款码：</text>
						<view class="info">
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<view v-if="alipayImg != ''" class="uni-uploader__file">
										<image mode="aspectFit" class="uni-uploader__img" :src="alipayImg" :data-src="alipayImgSrc" @tap="previewImage"></image>
									</view>
									<view v-if="title === '确定'" class="uni-uploader__input-box">
										<view class="uni-uploader__input" @tap="chooseImage('alipay')"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="input-row border">
						<text class="title">微信帐号：</text>
						<view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="micromsgNo" clearable :inputValue="modifyUserInfo.MicromsgNo" v-model="modifyUserInfo.MicromsgNo" placeholder="请输入微信帐号"></input-box>
							<text v-else>{{modifyUserInfo.MicromsgNo}}</text>
						</view>
					</view>
					<view class="input-row border">
						<text class="title">微信收款码：</text>
						<view class="info">
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<view v-if="wxImg != ''" class="uni-uploader__file">
										<image mode="aspectFit" class="uni-uploader__img" :src="wxImg" :data-src="wxImgSrc" @tap="previewImage"></image>
									</view>
									<view v-if="title === '确定'" class="uni-uploader__input-box">
										<view class="uni-uploader__input" @tap="chooseImage('wx')"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="input-row border">
						<text class="title">分销商等级：</text>
						<text class="info">{{modifyUserInfo.DealerLevelName}}</text>
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
						<text class="info">{{modifyUserInfo.AboveDealerNo}}</text>
						<!-- <view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="aboveDealerNo" clearable :inputValue="modifyUserInfo.AboveDealerNo" v-model="modifyUserInfo.AboveDealerNo" placeholder="请输入推荐人编号"></input-box>
							<text v-else>{{modifyUserInfo.AboveDealerNo}}</text>
						</view> -->
					</view>
					<view class="input-row border">
						<text class="title">推荐人姓名：</text>
						<text class="info">{{modifyUserInfo.AboveDealerName}}</text>
						<!-- <view :class="'info' + (title === '确定' ? ' input_box' : '')">
							<input-box v-if="title === '确定'" type="text" ref="aboveDealerName" clearable :inputValue="modifyUserInfo.AboveDealerName" v-model="modifyUserInfo.AboveDealerName" placeholder="请输入推荐人姓名"></input-box>
							<text v-else>{{modifyUserInfo.AboveDealerName}}</text>
						</view> -->
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
		<view style="height: 50px;">
			<view class="create_pay_order">
				<view class="result">
					<button class="btn" type="warn" @click="onModify">{{title}}</button>
				</view>
			</view>
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
				let dateStr = util.formatDate(this.modifyUserInfo.BirthDay, 'yyyy-MM-dd');
				let year = Number(dateStr.split('-')[0]);
				if(year < 1900) {
					dateStr = util.formatDate(new Date(), 'yyyy-MM-dd');
				}
				return dateStr;
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
				alipayImg: '',
				alipayImgSrc: '',
				wxImg: '',
				wxImgSrc: '',
				modifyUserInfo: {
					"DealerId": ""  /*分销商ID*/,
					"AboveDealerId": ""  /*推荐人ID*/,
					"DealerNo": ""  /*分销商编号*/,
					"DealerName": ""  /*分销商姓名*/,
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
					"LevelId": ""  /*分销商等级*/,
					"Used": false  /*是否已使用*/,
					"LevelValidDate": "2020-02-15T10:18:41.13493+08:00"  /*分销商等级有效期*/,
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
			this.onModify()
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
			this.alipayImg = util.getBaseUrl() + 'files/downloadfile?filename=' + this.userInfo.AlipayPayCodeFileName;
			this.alipayImgSrc = this.alipayImg;
			this.wxImg = util.getBaseUrl() + 'files/downloadfile?filename=' + this.userInfo.MicromsgPayCodeFileName;
			this.wxImgSrc = this.wxImg;
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
			scaleImg(src) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: src,
						success(res) {
							console.log('scaleImg image info: ', res);
							resolve(res);
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
			async chooseImage(e) {
				uni.chooseImage({
					sourceType: ['album', 'camera'],
					sizeType: ['original'],
					count: 1,
					success: res => {
						console.log(res, res.tempFiles[0].size, res.tempFiles[0].size > 204800);
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
									if(e === 'alipay') {
										this.$set(this.modifyUserInfo, 'AlipayPayCodeFileName', uploadFileRes);
									} else if(e === 'wx') {
										this.$set(this.modifyUserInfo, 'MicromsgPayCodeFileName', uploadFileRes);
									}
									this.urlToBase64(useImage)
									.then(baseRes => {
										// 转化后的base64图片地址
										if(e === 'alipay') {
											this.alipayImg = util.getBaseUrl() + 'files/downloadfile?filename=' + uploadFileRes;
											this.alipayImgSrc = useImage;
										} else if(e === 'wx') {
											this.wxImg = util.getBaseUrl() + 'files/downloadfile?filename=' + uploadFileRes;
											this.wxImgSrc = useImage;
										}
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
							if(e === 'alipay') {
								this.alipayImg = baseRes;
								this.alipayImgSrc = baseRes;
							} else {
								
							}
						});
						// #endif
					}
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
			},
			bindChangeBirthDay(e) {
				this.modifyUserInfo.BirthDay = e;
			},
			onModify() {
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
			}
        }
    }
</script>

<style>

</style>
