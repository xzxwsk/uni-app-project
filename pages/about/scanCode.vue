<template>
	<view></view>
</template>

<script>
import util from '@/common/util.js';
export default {
	data() {
		return {
			qrcodeObj: null
		}
	},
	onNavigationBarButtonTap(e) {
		// #ifdef APP-PLUS
		this.selectGallery();
		// #endif
	},
	onLoad() {
		// #ifdef APP-PLUS
		setTimeout(() => {
			this.initScan();
		}, 1000);
		// #endif
	},
	onShow() {
		console.log(this.qrcodeObj);
		if(this.qrcodeObj) {
			uni.navigateBack();
		}
	},
	methods: {
		compressImage(src, imgScale) {
			return new Promise((resolve, reject) => {
				let arr = src.split('/');
				let fileName = arr[arr.length-1];
				let fileNameArr = fileName.split('.');
				let path = arr.slice(0, arr.length-1);
				let width = imgScale.width;
				let height = imgScale.height;
				const standard = '300px';
				if(width > height) {
					width = standard;
					height = 'auto';
				} else {
					width = 'auto';
					height = standard;
				}
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
		scanCode(path) {
			plus.barcode.scan(path, function(type, code, file){
				console.log(type);
				console.log(code);
				console.log(file);
				util.goUrl({
					url: code
				});
			}, function(error){
				console.log(error);
				util.showToast({
					title: '识别失败'
				});
			}, [plus.barcode.QR]);
		},
		initScan() {
			const currentWebview = this.$mp.page.$getAppWebview();
			let barcode = null;
			if(!this.qrcodeObj) {
				barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
				    width: '100%',  
				    height: '100%',
					scanbarColor: '#fff',
					frameColor: '#fff'
				});
				barcode.onmarked = function (type, code) {
					var text = '未知: ';
					switch(type){
						case plus.barcode.QR:
							text = 'QR: ';
							break;
						default:
							break;
					}
					
					util.goUrl({
						url: code
					});
				};
				barcode.onerror = function(err){
					console.log( err );
				}
				this.qrcodeObj = barcode;
				currentWebview.append(barcode);
			} else {
				barcode = this.qrcodeObj;
			}
			console.log(barcode);
			barcode.start();
			
		},
		selectGallery() {
			plus.gallery.pick(path => {
				this.compressImage(path, {
					width: 300,
					height: 300
				})
				.then(tempFilePath => {
					this.scanCode(tempFilePath.target);
				});
			}, function( err ) {
				console.log(err)
			}, {
				filter: 'image',
				maximum: 1,
				multiple: false
			});
		}
	}
}
</script>

<style>
</style>
