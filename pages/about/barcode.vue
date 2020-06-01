<template>
	<view style="height: 100%;"></view>
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
		this.qrcodeObj.cancel();
		plus.gallery.pick(function(path){
			console.log(path);
			plus.barcode.scan(path, function(type, code, file){
				console.log(type);
				console.log(code);
				console.log(file);
				util.goUrl({
					url: code
				});
			}, function(error){
				console.log(error);
			}, [plus.barcode.QR]);
		}, function( err ) {
			console.log(err)
		}, {
			filter: 'image',
			maximum: 1,
			multiple: false
		});
	},
	onLoad() {
		var pages = getCurrentPages();  
		var page = pages[pages.length - 1];  
		// #ifdef APP-PLUS  
		var currentWebview = page.$getAppWebview(); //页面栈最顶层就是当前webview  
		var barcode = plus.barcode.create('barcode', [plus.barcode.QR], {  
		    width: '100%',  
		    height: '100%',
			scanbarColor: '#ffffff'
		});
		barcode.onmarked = function (type, result) {
			var text = '未知: ';
			switch(type){
				case plus.barcode.QR:
					text = 'QR: ';
					break;
				default:
					break;
			}
			console.log( text );
			console.log(result)
		};
		
		barcode.setStyle({
			background: '#fff',
			scanbarColor: '#fff'
		});
		currentWebview.append(barcode);
		this.qrcodeObj = barcode;
		barcode.start();
		// #endif
	}
}
</script>

<style>
</style>
