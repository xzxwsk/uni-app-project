	import search from './components/search/index.vue'
	export default {
		name: "tree",
		props: {
			trees: {
				type: Array,
				default: () => {
					return []
				}
			},
			//是否开启选中
			isCheck: {
				type: Boolean,
				default: () => {
					return false
				}
			},
			parent:{
				type: Boolean,
				default: () => {
					return false
				}
			},
			max:{
				type: Number,
				default: () => {
					return -1
				}
			},
			checkList: {
				type: Array,
				default: () => []
			},
			parentList: {
				type: Array,
				default: () => []
			},
			searchIf: {
				type: Boolean,
				default: () => true
			},
			props: {
				type: Object,
				default: () => {
					return {
						label: 'name',
						children: 'children',
						multiple: false,
						checkStrictly: false,//不关联
					}
				}
			}
		},
		computed: {
			downloadDisabled() {
				return this.newCheckList.length === 0
			}
		},
		data() {
			return {
				isre: false,
				tree: this.trees,
				newNum: 0,
				oldNum: 0,
				allData: this.trees,
				tree_stack: [1],
				parent_data: this.parentList||[],//选择父辈
				searchResult: [],
				tochild: false,
				newCheckList: this.checkList,
				scrollLeft: 999,
				nodePathArray: [],
				btnText: ''
			}
		},
		/*
			*	已兼容h5和小程序端,其它端没测试过，估计问题不大，只需要改一下传值的方式
			* 
			*	如有问题可以加qq：122720267
			* 	
			*	使用该插件的朋友请给个好评，或者到git start一下
			*   git地址：https://github.com/LSZ579/xiaolu-tree-plugin.git
			*   插件市场地址： https://ext.dcloud.net.cn/plugin?id=2423
			* 
		*/
		components: {
			search
		},
		mounted() {
			if (plus.os.name !== 'iOS') {
				this.btnText = '下载'
			} else {
				this.btnText = '打开'
			}
			if(this.props.multiple&&this.props.checkStrictly){
				if(this.newCheckList.length!=0){
					 this.checkAllChoose();
					 return
				}
				for(let i = 0; i<this.tree.length;i++){
					this.$set(this.tree[i],'bx',0)
					this.$set(this.tree[i],'qx',0)
				}
			}
			if(!this.props.multiple&&this.newCheckList.length>0) {
				this.getNodeRoute(this.allData,this.newCheckList[0].id)
				let arr = this.nodePathArray.reverse()
				if(arr.length == 0)return
				this.tree_stack = this.tree_stack.concat(arr);
				this.tree = this.tree_stack[this.tree_stack.length-1].children;
			}
		},
		methods: {
			//多选
			async checkboxChange(item, index, bx, qx) {
				var that = this;
				if(!this.props.multiple) return;
				let findIdex = that.newCheckList.findIndex(e=>{return item.id==e.id});
				if (findIdex>-1) { //反选
					if (that.props.checkStrictly) {//关联子级
						if (item.user) {//用户
							that.newCheckList.splice(findIdex,1) 
						} else {//非用户，取消所有下一级
							that.getIdBydelete(item.children)
						}
					} else {
						that.newCheckList.splice(findIdex,1) 
					}
				} else { //选中
					if (!item.user&&that.props.checkStrictly) {//选中下一级
						if(qx||bx){//取消下级
							await that.getIdBydelete(item.children);
							item.qx = 0;item.bx = 0;
						}
						else{
							item.qx = 1;item.bx = 0;
							await that.chooseChild(item.children,item.id);
						}
						that.$emit('sendValue', that.newCheckList);
						that.$forceUpdate()
						return
					}
					// if(item.user&&this.props.checkStrictly) this.getNodeRoute(this.allData,item.id);
					that.newCheckList.push({...item});
				}
				console.log('newCheckList: ', that.newCheckList.length, this.downloadDisabled);
				that.$emit('sendValue', that.newCheckList)
			},
			// 取消下一级的选中
			getIdBydelete(arr) {
				arr.forEach(e=>{
					if(e.user){
						for(var i = 0; i<this.newCheckList.length;i++){
							if(e.id == this.newCheckList[i].id) {
								this.newCheckList.splice(i,1)
								break;
							}
						}
					}
					if(!e.user){
						this.getIdBydelete(e.children)
					}
				})
			},
			//取消父级
			// deleteParent(id){
			// 	for(var i = 0; i<this.parent_data.length;i++){
			// 		if(id == this.parent_data[i].id) {
			// 			this.parent_data.splice(i,1)
			// 			break;
			// 		}
			// 	}
			// },
			
			// 关联下一级,选中
			chooseChild(arr,pid) {
				let that = this;
				for (var i = 0, len = arr.length; i < len; i++) {
					let item = arr[i];
					if(item.user) {
						that.newCheckList.push({...item,tree_stackId:pid})
					}
					if (!item.user) {
						this.chooseChild(item.children,item.id)
					}
				}
			},
			
			// (tree为目标树，targetId为目标节点id) 
			 getNodeRoute(tree, targetId) {
				for (let index = 0; index < tree.length; index++) {
					if (tree[index].children) {
						let endRecursiveLoop = this.getNodeRoute(tree[index].children, targetId)
						if (endRecursiveLoop) {
							this.nodePathArray.push(tree[index])
							return true
						}
					}
					if (tree[index].id === targetId) {
						return true
					}
				}
			},
			
			//单选
			checkbox(item, index) {
				var that = this;
				that.newCheckList = []
				that.newCheckList.push(that.tree[index])
				that.$emit('sendValue', that.newCheckList)
			},
			//到下一级
			toChildren(item) {
				var that = this;
				const children = that.props.children;
				if(item.user) return
				this.tochild = true;
				if (item[children]) {
					this.setChildShow(item, item[children])
					return
				}
				this.$emit('getChild', item, result => {
					this.setChildShow(item, result)
				})
			},
			// 设置子级内容
			setChildShow(item, children) {
				const that = this
				console.log(item, children)
				if (!item.user) {
					that.tree = children;
					if (that.tree_stack[0].id === item.id) {
					} else {
						that.tree_stack.push(item);
					}
				}
				this.$nextTick(() => {
					this.scrollLeft += 200;
				})
				if(this.props.checkStrictly) this.checkAllChoose();
				this.$forceUpdate()
			},
			//搜索
			confirmSearch(val) {
				this.searchResult = []
				if (val === '') {
					this.backTree(this.tree_stack[0], -1)
					return
				}
				this.$emit('search', val, result => {
					this.isre = true
					this.tree = result
					this.newCheckList = []
				})
				// this.search(this.allData, val)
				// this.isre = true
				// this.tree_stack.splice(1, 6666)
				// uni.showLoading({
				// 	title: '正在查找'
				// })
				// setTimeout(() => {
				// 	this.tree = this.searchResult
				// 	this.newCheckList = []
				// 	uni.hideLoading()
				// }, 300)
			},
			search(data, keyword) {
				var that = this
				let children = that.props.children
				for (var i = 0, len = data.length; i < len; i++) {
					if (data[i].name.indexOf(keyword) >= 0) {
						that.searchResult.push(data[i])
					}
					if (!data[i].user && data[i][children].length > 0) {
						that.search(data[i][children], keyword)
					}
				}
			},
			
			checkAllChoose(){
				let o = false,t = true;
				this.tree.forEach((e,i)=>{
					if(!e.user){
						e.qx = o;
						e.bx = o;
						let num2 = this.computAllNumber(e.children);
						if(this.newNum!=0&&this.oldNum!=0){
							if(this.newNum==this.oldNum) {
								e.qx = t;e.bx = o;
							}else{
								e.qx = o;e.bx = t;
							}
						}
						if(this.newNum!=0&&this.oldNum == 0){
							this.$set(this.tree[i],'bx',o); this.$set(this.tree[i],'qx',o);
						}
						this.$forceUpdate()
						this.newNum=0
						this.oldNum=0
					}
				})
			},

			computAllNumber(arr) {
				for(let j = 0; j<arr.length;j++){
					var e = arr[j];
					if(arr[j].user) {this.newNum ++;}
					this.checkSum(e.id)
					if(!e.user){
						this.computAllNumber(e.children)
					}
				}
			},
			
			checkSum(id){
				for(let i = 0; i<this.newCheckList.length;i++){
					if(id == this.newCheckList[i].id) {
						this.oldNum++;
						break
					}
				}
			},
			
			//返回其它层
			backTree(item, index) {
				let that = this,max = 66666;
				if (index == -1) {
					that.tree = that.allData
					that.tree_stack.splice(1, max)
					that.isre = false
					that.$refs.sea.clears()
				} else if (index == -2) {
					that.tree = that.searchResult
					that.tree_stack.splice(1, max)
				} else {
					if (that.tree_stack.length - index > 2) {
						that.tree_stack.forEach((item, i) => {
							if (i > index) {
								that.tree_stack.splice(i, max)
							}
						})
					} else if (index == that.tree_stack.length - 1) {
						
					} else {
						that.tree_stack.splice(that.tree_stack.length - 1, 1)
					}
					that.tree = item[that.props.children]
				}
				if(this.props.checkStrictly) this.checkAllChoose();
				this.$forceUpdate()
			},
			backConfirm(){
				this.$emit('sendValue',this.newCheckList,'back')
			}

		}
	}