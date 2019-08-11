<template>
	<view class="uni-padding-wrap uni-common-pb add_addr">
		<view class="con">
			<view class="input-group">
				<view class="input-row border">
					<text class="title">收货人：</text>
					<input-box ref="input1" type="text" :verification="['isNull']" :verificationTip="['收货人不能为空']" class="input-box" clearable focus v-model="person" placeholder="请输入收货人"></input-box>
				</view>
				<view class="input-row border">
					<text class="title">手机号码：</text>
					<input-box ref="input1" type="text" :verification="['isNull']" :verificationTip="['手机号码不能为空']" class="input-box" clearable focus v-model="phone" placeholder="请输入手机号码"></input-box>
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
	export default {
		components: {
			inputBox, mpvuePicker
		},
		data() {
			return {
				imgSrc: '/static/images/no_data_d.png',
				mode: 'widthFix',
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
				}
			}
		},
		onReady() {
			
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
			saveAddr() {
				console.log(this.area);
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
                var values = e.detail.value;
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
