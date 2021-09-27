<template>
	<view>
		<xiaolu-tree ref="treeRef" v-slot:default="{item}" :searchIf="true" :checkList="checkList" :positionArr="positionArr" v-if="tree.length>0" :props="prop" @sendValue="confirm" :isCheck="true" :trees="tree" @getChild="onGetChild" @search="onSearch">
			<!-- 内容插槽 -->
			<view>
				<view class="content-item">
					<view class="word">{{item.Name}}</view>
				</view>
			</view>
			<!--end -->
		</xiaolu-tree>
	</view>
</template>

<script>
	import { ajax, showLoading, hideLoading, getBaseUrl, showToast } from '@/common/util'
	import XiaoluTree from '@/components/xiaolu-tree/tree.vue'
	// import dataList from '@/common/treeData.js'
	export default {
		components: {
			XiaoluTree
		},
		data() {
			return {
				checkList: [],
				positionArr: [],
				tree: [],
				prop: {
					label: 'Name',
					children: 'children',
					multiple: true,
					checkStrictly: false,
					nodes:true
				}
			}
		},
		onLoad() {
			this.getRootData()
		},
		methods: {
			getRootData() {
				showLoading()
				ajax({
					method: 'Businese.KnowledgeBaseDAL.GetRootDirecotory',
				}).then(res => {
					hideLoading()
					const { result } = res.data
					console.log('res.data.result: ', result)
					if (result) {
						this.onGetChild(result, data => {
							this.tree = data.map(item =>({
								...item,
								user: item.Type === 1,
								id: item.RecordId
							}))
						})
					}
				})
			},
			onGetChild(item, callback) {
				showLoading()
				ajax({
					method: 'Businese.KnowledgeBaseDAL.GetSubItems',
					params: {
						RecordId: item.RecordId
					},
				}).then(res => {
					hideLoading()
					const { result } = res.data
					if (result) {
						result.forEach(resultItem => {
							resultItem.user = resultItem.Type === 1,
							resultItem.id = resultItem.RecordId
						})
						item.children = result
						callback(result)
					} else {
						callback([])
					}
				}).catch(() => {
					hideLoading()
				})
			},
			onSearch(Keyword, callback) {
				showLoading({
					title: '正在查找'
				})
				ajax({
					method: 'Businese.KnowledgeBaseDAL.QueryFiles',
					params: {
						Keyword
					},
				}).then(res => {
					hideLoading()
					const { result } = res.data
					console.log('res.data: ', result)
					if (result) {
						result.forEach(resultItem => {
							resultItem.user = resultItem.Type === 1,
							resultItem.id = resultItem.RecordId
						})
						callback(result)
					}
				}).catch(() => {
					hideLoading()
				})
			},
			confirm(e, str) {
				console.log('confirm: ', e, str);
				if (str === 'back') {
					e = e.filter(item => item.ServerFileName)
					const imgArr = e.map(item => getBaseUrl() + 'files/downloadfile?filename=' + item.ServerFileName)
					let hasNoImg = imgArr.find(item => {
						const ext = item.split('.').pop().toUpperCase()
						// 有一个不是图片
						return ext !== 'JPG' && ext !== 'JPEG' && ext !== 'PNG' && ext !== 'GIF' && ext !== 'BMP'
					})
					console.log('hasNoImg: ', hasNoImg);
					// 如果存在非图片，则下载
					if (hasNoImg) {
						this.downLoadImg(imgArr)
					} else if (imgArr.length > 0){
						// 否则预览
						uni.previewImage({
							indicator: 'number',
							urls: imgArr
						})
					}
				}
				
				// showLoading({
				// 	title: '正在下载中...'
				// })
				// // 获取路径
				// const item = e[0]
				// ajax({
				// 	method: 'Businese.KnowledgeBaseDAL.GetPath',
				// 	params: {
				// 		RecordId: item.RecordId
				// 	},
				// }).then(res => {
				// 	hideLoading()
				// }).catch(() => {
				// 	hideLoading()
				// })
			},
			downLoadImg(arr) {
				showLoading({
					title: '下载中...'
				})
				const promiseAll = []
				arr.forEach(item => {
					const promiseObj = new Promise((resolve, reject) => {
						// 下载图片，获得临时文件
						uni.downloadFile({
						    url: item,
						    success: res => {
						        if (res.statusCode === 200) {
									uni.saveFile({
										tempFilePath: res.tempFilePath,
										success: saveRes => {
											const { savedFilePath } = saveRes
											resolve(savedFilePath)
										},
										fail(err) {
											reject(err)
										}
									})
								} else {
									reject(res)
								}
							},
							fail(err) {
								reject(err)
							}
						})
					})
					promiseAll.push(promiseObj)
				})
				Promise.all(promiseAll).then(res => {
					console.log('promiseAll: ', res);
					showToast({
						title: '下载完成'
					})
				}).catch(err => {
					console.log('err: ', err)
				}).finally(() => {
					hideLoading()
				})
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
