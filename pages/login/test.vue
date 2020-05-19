<template>
	<view>
		<view class="status_bar" :style="{ height: statusBarHeight + 'px' }"></view>
		<customDatePicker @change="bindChangeBirthDay"
			fields="day"
			:start="startDate"
			:end="endDate"
			:value="date"
		></customDatePicker>
		<view>
			<picker mode="multiSelector" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="uni-input">{{date}}</view>
			</picker>
		</view>
	</view>
</template>
<script>
	import util from '@/common/util.js';
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
	export default {
		components: {
		    customDatePicker
		},
		data() {
			return {
				startDate: '1900-01-01',
				endDate: '2999-12-31',
				date: '',
				statusBarHeight: 0
			}
		},
		onLoad() {
			this.date = util.formatDate(new Date(), 'yyyy-MM-dd');
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		},
		onReady() {
		},
		mounted() {
		},
		methods: {
			bindChangeBirthDay(e) {
				console.log(e);
			},
			bindDateChange(e) {
				console.log(e);
			}
		}
	}
</script>
