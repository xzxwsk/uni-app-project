<template>
	<view class="qrimg">
		<tki-qrcode ref="qrcode" :size="600" :val="qrcodeStr" loadMake @result="qrR" />
		<view class="btn-row">
			<button type="warn" @tap="bindSave">下载</button>
		</view>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode";
	import util from "@/common/util.js";
	import {mapState, mapMutations} from 'vuex';

	export default {
		components: {
			tkiQrcode
		},
		computed: mapState(['userInfo']),
		data() {
			return {
				qrcodeStr: '',
				qrcodeDatabase: ''
			}
		},
		onLoad() {
			this.qrcodeStr = '../user/createEntryOrder?AboveDealerId=' + this.userInfo.DealerId
			console.log(this.qrcodeStr);
		},
		methods: {
			qrR(e) {
				this.qrcodeDatabase = e;
			},
			bindSave(e) {
				this.$refs.qrcode._saveCode();
			}
		}
	}
</script>

<style>
</style>
