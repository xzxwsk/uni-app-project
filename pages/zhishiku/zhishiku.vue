<template>
	<view>
		<!-- 不要目录方式，改为缩略图方式 -->
		<!-- <xiaolu-tree ref="treeRef" v-slot:default="{item}" :searchIf="true" :checkList="checkList" :positionArr="positionArr" v-if="tree.length>0" :props="prop" @sendValue="confirm" :isCheck="true" :trees="tree" @getChild="onGetChild" @search="onSearch"> -->
			<!-- 内容插槽 -->
			<!-- <view class="content-item">
				<view class="word">{{item.Name}}</view>
			</view> -->
			<!--end -->
		<!-- </xiaolu-tree> -->
		<view style="display: none;">
			<image v-for="(item,index) in bigImage" :key="item" :src="item" @load="onLoadImg(index, item)" />
		</view>
		<view class="uni-product-list zhishiku">
			<view class="uni-product" v-for="(product, index) in tree" :key="product.RecordId">
				<view class="image-view" @click="onClick(product)">
					<i class="uni-icon uni-icon-undo" v-if="product.Type === 2"></i>
					<image v-else
						class="uni-product-image" :class="{folder: product.Type === 0}" 
						:src="product.Type === 0 ? '/static/images/folder.png' : product.image"
						mode="aspectFit"
					></image>
					<i class="uni-icon uni-icon-download" v-if="product.Type === 1" @click.stop="onDownload(product)"></i>
				</view>
				<view class="uni-product-title">{{product.Name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { ajax, showLoading, hideLoading, getBaseUrl, showToast } from '@/common/util'
	// import XiaoluTree from '@/components/xiaolu-tree/tree.vue'
	// import dataList from '@/common/treeData.js'
	export default {
		components: {
			// XiaoluTree
		},
		data() {
			return {
				checkList: [],
				positionArr: [],
				tree: [],
				imgArr: [],
				bigImage: [],
				allDataMap: {},
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
							this.allDataMap[result.RecordId] = data
							this.tree = data
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
							resultItem.image = getBaseUrl() + 'files/downloadfile?filename=' + resultItem.ServerFileName + '&isthumb=true'
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
			onReturn(product) {
				this.tree = this.allDataMap[product.ParentId]
			},
			onClick(product) {
				console.log('product: ', product);
				if (product.Type === 2) {
					this.onReturn(product)
					return
				}
				if (product.Type === 0) {
					// 如果已有子级，则直接用
					if (this.allDataMap[product.RecordId]) {
						this.tree = this.allDataMap[product.RecordId]
						return
					}
					// 没有获取过子级的，则获取
					this.onGetChild(product, data => {
						const curData = [{
							ParentId: product.ParentId,
							RecordId: product.RecordId + '_return',
							Type: 2,
							Name: '返回上级目录'
						}, ...data]
						this.allDataMap[product.RecordId] = curData
						this.tree = curData
					})
				} else {
					this.bigImage = []
					const imgArr = this.tree.filter(item => item.ServerFileName).map((item, index, arr) => {
						const src = getBaseUrl() + 'files/downloadfile?filename=' + item.ServerFileName
						this.bigImage.push(src)
						return src + '&isthumb=true'
					})
					this.imgArr = imgArr
					uni.previewImage({
						urls: [getBaseUrl() + 'files/downloadfile?filename=' + product.ServerFileName],
						// current: this.tree.findIndex(item => item.RecordId === product.RecordId) - 1,
						longPressActions: {
							itemList: ['发送给朋友', '保存图片', '收藏'],
							success: function(data) {
								console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
							},
							fail: function(err) {
								console.log(err.errMsg);
							}
						}
					})
				}
			},
			// 加载完成一张，替换一张
			onLoadImg(index, src) {
				console.log(index, src);
				this.imgArr[index] = src
			},
			// 下载
			onDownload(product) {
				console.log('onDownload: ', product)
				this.downLoadImg([getBaseUrl() + 'files/downloadfile?filename=' + product.ServerFileName])
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
					const imgArr = e.map(item => getBaseUrl() + 'files/downloadfile?filename=' + item.ServerFileName + '&isthumb=true')
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
			},
			async downLoadImg(arr) {
				showLoading({
					title: '下载中...'
				})
				// 下载前先清除缓存文件
				await this.removeFileList()
				const promiseAll = []
				arr.forEach(item => {
					const promiseObj = new Promise((resolve, reject) => {
						// 下载图片，获得临时文件
						uni.downloadFile({
						    url: item,
						    success: res => {
						        if (res.statusCode === 200) {
									// 保存文件
									// uni.saveFile({
									// 	tempFilePath: res.tempFilePath,
									// 	// filePath: '_downloads',
									// 	success: saveRes => {
									// 		const { savedFilePath } = saveRes
									// 		resolve(savedFilePath)
									// 	},
									// 	fail(err) {
									// 		reject(err)
									// 	}
									// })
									// 保存图片到相册
									uni.saveImageToPhotosAlbum({
										filePath: res.tempFilePath,
										success: function () {
											console.log('save success');
											resolve()
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
				// 下载
				Promise.all(promiseAll).then(res => {
					console.log('下载完成: ', res);
					showToast({
						title: '下载完成'
					})
					// 获取下载到本地的文件(此处使用保存到相册，就不再需要再手动去调保存文件方法)
					// uni.getSavedFileList({
					//     success: res => {
					//         console.log('getSavedFileList: ', res.fileList)
					// 		// 备份文件到
					// 		this.copyFileList(res.fileList)
					// 		// 打开单个文档
					// 		// uni.openDocument({
					// 		// 	filePath: res.fileList[0].filePath,
					// 		// 	success: function (res) {
					// 		// 	    console.log('打开文档成功')
					// 		// 	}
					// 		// })
					// 	}
					// })
				}).catch(err => {
					console.log('err: ', err)
				}).finally(() => {
					hideLoading()
				})
			},
			// 清除缓存
			removeFileList(fileList) {
				return new Promise((resolve, reject) => {
					uni.getSavedFileList({
						success: res => {
							const promiseAll = []
							res.fileList.forEach(item => {
								const promiseObj = new Promise((resolveSub, rejectSub) => {
									uni.removeSavedFile({
										filePath: item.filePath,
										success() {
											resolveSub()
										},
										fail() {
											rejectSub()
										}
									})
								})
								promiseAll.push(promiseObj)
							})
							Promise.all(promiseAll).then(() => {
								resolve()
							}).catch(() => {
								reject()
							})
						}
					})
				})
			},
			copyFileList(fileList) {
				const fileSysMana = uni.getFileSystemManager()
				const copyFn = filePath => {
					const fileName = filePath.split('/').pop()
					console.log('copyFileList fileName: ', wx.env.USER_DATA_PATH, fileName)
					fileSysMana.copyFile({
						srcPath: filePath,
						destPath: `${wx.env.USER_DATA_PATH}/${fileName}`,
						success(res) {
							console.log('copyFile: ', res);
						}
					})
				}
				fileList.forEach(item => {
					copyFn(item.filePath)
				})
				showToast({
					title: '下载完成'
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
