<template>
	<view class="uni-padding-wrap uni-common-pb add_addr">
		<view class="con">
			<view class="input-group">
				<view class="input-row border">
					<text class="title">收货人：</text>
					<input-box ref="person" type="text" :verification="['isNull']" :verificationTip="['收货人不能为空']" class="input-box" clearable focus v-model="person" placeholder="请输入收货人"></input-box>
				</view>
				<view class="input-row border">
					<text class="title">手机号码：</text>
					<input-box ref="phone" type="text" :verification="['isNull']" :verificationTip="['手机号码不能为空']" class="input-box" clearable v-model="phone" placeholder="请输入手机号码"></input-box>
				</view>
				<view class="input-row border">
					<text class="title">所在地区：</text>
					<view class="input_box" @tap="selectArea">
						<input class="ipt" type="text" disabled v-model="area" placeholder="请选择收货地址"></input>
						<view class="uni-icon uni-icon-arrowright"></view>
					</view>
				</view>
				<view class="input-row border">
					<text class="title">详细地址：</text>
					<textarea v-model="detailAddr" style="padding: 10px 11px; height: 60px;" placeholder="请输入详细地址"/>
				</view>
				<view class="input-row border">
					<text class="title">设为默认：</text>
					<view class="input_box">
						<radio @tap="checkboxChange" color="#f23030" :value="isDefault.isDefault" :checked="isDefault.checked" />
					</view>
				</view>
			</view>
		</view>
		<view class="add_btn">
			<button type="warn" @tap="saveAddr">保存</button>
		</view>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :pickerValueDefault="pickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-picker>
	</view>
</template>

<script>
	// http://ext.dcloud.net.cn/plugin?id=449
	import inputBox from '@/components/input-box/input-box';
	import mpvuePicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import cityData from '@/common/city.data-3.js';
	import util from '@/common/util.js';
	import {mapState, mapMutations} from 'vuex';
	export default {
		components: {
			inputBox, mpvuePicker
		},
		computed: {
			...mapState(['hasLogin', 'openid', 'userInfo'])
		},
		data() {
			return {
				imgSrc: util.getImgUrl() + '/images/no_data_d.png',
				mode: 'widthFix',
				dealerId: '',
				person: '',
				phone: '',
				area: '',
				detailAddr: '',
				areaClearShow: false,
				themeColor: '#007AFF',
				pickerValueDefault: [0, 0, 0],
				pickerValueArray: [],
				isDefault: {
					value: 1,
					checked: true
				},
				addrId: ''
			}
		},
		onLoad(option) {
			console.log('option: ', option);
			if(option.hasOwnProperty('id')) {
				uni.setNavigationBarTitle({
					title: '编辑地址'
				});
				this.addrId = option.id;
				this.edit(option.id);
			}
		},
		onUnload() {
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel();
			}
		},
		methods: {
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			},
			async edit(id) {
				let me = this;
				util.showLoading();
				await util.ajax({
					method: 'Basic.DealerAddressDAL.GetById',
					params: {
						RecordId: id
					},
					tags: {
						usertoken: this.openid
					}
				}).then(res => {
					util.hideLoading();
					me.dealerId = res.data.result.DealerId;
					me.area = res.data.result.Province + '-' + res.data.result.City + '-' + res.data.result.District;
					me.detailAddr = res.data.result.AddrDetail;
					me.person = res.data.result.PersonName;
					me.phone = res.data.result.Mobile;
					this.$refs.person.setValue(res.data.result.PersonName);
					this.$refs.phone.setValue(res.data.result.Mobile);
					me.isDefault = {
						value: res.data.result.IsDefault ? 1 : 0,
						checked: res.data.result.IsDefault
					};
				});
			},
			saveAddr() {
				let arr = this.area.split('-');
				if (this.hasLogin) {
					if(this.$refs.person.getValue() && this.$refs.phone.getValue()){
						let method = 'Basic.DealerAddressDAL.Create';
						let dealerId = this.userInfo.DealerId;
						if (this.addrId !== '') {
							method = 'Basic.DealerAddressDAL.Update'
							dealerId = this.dealerId;
						}
						util.showLoading();
						util.ajax({
							method: method,
							params: {
								Data: {
									Id: this.addrId,
									DealerId: dealerId,
									Country: '中国',
									Province: arr[0],
									City: arr[1],
									District: arr[2],
									AddrDetail: this.detailAddr,
									Address: this.area + ' ' + this.detailAddr,
									PersonName: this.person,
									Mobile: this.phone,
									IsDefault: this.isDefault.value,
									IdValues: ['']
								}
							},
							tags: {
								usertoken: this.openid
							}
						}).then(res => {
							util.hideLoading();
							console.log('添加地址：', res.data.result);
							util.showToast({
								title: (this.addrId !== '' ? '修改' : '添加') + '成功',
								success() {
									setTimeout(() => {
										uni.navigateBack();
									}, 1000);
								}
							});
						});
					}
				} else {
					util.redirectUrl({
						url: '../login/login'
					});
				}
			},
			selectArea() {
				this.pickerValueArray = cityData;
				this.mode = 'multiLinkageSelector';
				this.deepLength = 3;
				this.pickerValueDefault = [22, 0, 1];
				this.$refs.mpvuePicker.show();
			},
			onCancel(e) {
				console.log(e);
			},
			onConfirm(e) {
				console.log(e);
				this.area = e.label;
			},
			checkboxChange: function (e) {
				var item = this.isDefault;
				
				if(item.value) {
					this.$set(item, 'value', 0);
					this.$set(item, 'checked', false);
				}else{
					this.isDefault = {
						value: 1,
						checked: true
					};
				}
				console.log(this.isDefault);
            }
		}
	}
</script>
