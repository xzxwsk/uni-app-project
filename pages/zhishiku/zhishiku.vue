<template>
	<view>
		<xiaolu-tree  v-slot:default="{item}" :searchIf="true" :checkList="checkList" :positionArr="positionArr" v-if="tree.length>0" :props="prop" @sendValue="confirm" :isCheck="true" :trees="tree">
			<!-- 内容插槽 -->
			<view>
				<view class="content-item">
					<view class="word">{{item.name}}</view>
				</view>
			</view>
			<!--end -->
		</xiaolu-tree>
	</view>
</template>

<script>
	import XiaoluTree from '@/components/xiaolu-tree/tree.vue'
	import dataList from '@/common/treeData.js'
	export default {
		components: {
			XiaoluTree
		},
		data() {
			return {
				checkList: [],
				positionArr: [],
				tree: dataList,
				prop: {
					label: 'name',
					children: 'children',
					multiple: true,
					checkStrictly: false,
					nodes:true
				}
			}
		},
		methods: {
			confirm(e) {
				console.log('confirm: ', e);
			}
		}
	}
</script>

<style lang="scss">
	.box_sizing {
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}
	.btn {
		position: fixed;
		bottom: 0;
		padding: 10px;
		background-color: #fff;
		width: 100%;
		.sureBtn {
			background-color: #0095F2;
			color: #fff;
		}
	}
	
	.content-item{
		display: flex;
		position: relative;
		align-items: center;
		.person {
			height: 64rpx;
			min-width: 64rpx;
			border-radius: 50%;
			border: 1rpx solid rgba(0, 149, 235, 0.15);
			background-color: rgba(0, 149, 235, 0.1);
			margin-left: 0px;
			color: #0095F2;
			line-height: 64rpx;
			font-size: 22rpx;
			text-align: center;
			margin-left: 20rpx;
		}
		.word {
			margin-left: 16rpx;
			font-size: 30rpx;
			color: #5b5757;
			width: 500rpx;
			word-break: break-all;
		}
	}
</style>
