<template>
    <view class="stock" v-if="loaded">
		<view class="con" v-if="tableList.length < 1">
			<view class="no-data">
				<view class="no-img">
					<image style="width: 100%;" mode="widthFix" :src="imgSrc" @error="imageError"></image>
				</view>
				<view class="txt"><text>亲，还没有库存数据~</text></view>
			</view>
		</view>
		<view class="box" v-else>
			<view class="table_box">
				<t-table border="0">
					<t-tr font-size="14" color="#000">
						<t-th align="left" style="flex: none; width: 200upx;"><text class="first_col">商品编号</text></t-th>
						<t-th align="left" style="flex: none; width: 300upx; padding: 15upx 30upx;">商品名称</t-th>
						<t-th align="left">规格</t-th>
						<t-th align="left">计量单位</t-th>
						<t-th align="left">库存数量</t-th>
					</t-tr>
					<!-- <t-tr font-size="12" color="#5d6f61" align="right" v-for="(item, index) in tableList" :key="item.id">
						<t-td align="left" style="flex: none; width: 200upx;"><label><radio :checked="item.checked" color="#f23030" :data-index="index" @click="checkboxChange" />{{item.ProductNo}}</label></t-td>
						<t-td style="flex: none; width: 300upx; padding: 14upx 30upx;" align="left">{{item.ProductName}}</t-td>
						<t-td align="left">{{item.Spec}}</t-td>
						<t-td align="left">{{item.Unit}}</t-td>
						<t-td align="left">{{item.Qty}}</t-td>
					</t-tr> -->
				</t-table>
				<view style="display: flex; align-items: center; min-width: 1200upx; font-size: 28upx;" v-for="(item,index) in tableList" :key="item.id">
					<view style="width: 200upx;"><radio :checked="item.checked" color="#f23030" :data-index="index" @click="checkboxChange" />{{item.ProductNo}}</view>
					<view style="width: 300upx; padding: 5upx 30upx; word-break:break-all; word-wrap: break-word;">{{item.ProductName}}</view>
					<view style="flex: 1; word-break:break-all; word-wrap: break-word;">{{item.Spec}}</view>
					<view style="flex: 1; word-break:break-all; word-wrap: break-word;">{{ item.Unit }}</view>
					<view style="flex: 1; word-break:break-all; word-wrap: break-word;">{{item.Qty}}</view>
				</view>
			</view>
			<view class="result">
				<label class="radio" @click="onAllSelect"><radio color="#f23030" :checked="allSelect" />全选</label>
				<button class="btn" type="warn" :disabled="toPayBtnDisabled" @click="toPay">添加消费/零售记录</button>
			</view>
		</view>
    </view>
</template>

<script>
    import service from '@/service.js';
	import util from '@/common/util.js';
	// http://ext.dcloud.net.cn/plugin?id=413
	import tTable from '@/components/t-table/t-table.vue';
    import tTh from '@/components/t-table/t-th.vue';
    import tTr from '@/components/t-table/t-tr.vue';
    import tTd from '@/components/t-table/t-td.vue';
	import {mapMutations} from 'vuex';
	
	const tableList = [{
			ProductId: 0,
			name: '张三',
			age: '19',
			hobby: '游泳'
		},
		{
			ProductId: 1,
			name: '李四',
			age: '21',
			hobby: '绘画'
		},
		{
			ProductId: 2,
			name: '王二',
			age: '29',
			hobby: '滑板'
		},
		{
			ProductId: 3,
			name: '码字',
			age: '20',
			hobby: '蹦极'
		}
	];

    export default {
        components: {
            tTable, tTh, tTr, tTd
        },
		computed: {
			toPayBtnDisabled() {
				return this.selectedArr.length < 1;
			}
		},
        data() {
            return {
				loaded: false,
				tableList: [],
				selectedArr: [],
				allSelect: false,
				imgSrc: util.getImgUrl() + '/images/no_data_d.png'
            }
        },
		onNavigationBarButtonTap(e) {
			// #ifdef APP-PLUS
			
			// #endif 
		},
		mounted() {
			this.loaded = true;
			this.init();
		},
        methods: {
			...mapMutations(['setConsumeSelected']),
			init() {
				util.showLoading();
				util.ajax({
					method: 'Businese.QueryAppDAL.QueryInventory',
					tags: {
						usertoken: this.openid
					}
				})
				.then(res => {
					util.hideLoading();
					res.data.result.forEach(item => {
						item.checked = false;
					});
					let data = res.data.result;
					console.log('我的库存: ', data);
					this.loaded = true;
					this.tableList = data;
				});
			},
			checkboxChange(e) {
				console.log(e.currentTarget.dataset)
				let item = this.tableList[Number(e.currentTarget.dataset.index)];
				this.$set(item, 'checked', !item.checked);
				let selectIndex = -1;
				this.selectedArr.some((selectItem, index) => {
					if(selectItem.ProductId === item.ProductId) {
						selectIndex = index;
						return true;
					}
				});
				if(selectIndex !== -1) {
					this.selectedArr.splice(selectIndex, 1);
				} else {
					this.selectedArr.push(item);
				}
				this.allSelect = this.selectedArr.length === this.tableList.length;
			},
			onAllSelect() {
				this.allSelect = !this.allSelect;
				let hasNoneSelect = this.tableList.some(item => !item.checked);
				this.selectedArr = [];
				this.tableList.forEach(item => {
					item.checked = hasNoneSelect;
					if(item.checked) {
						this.selectedArr.push(item);
					}
				});
				console.log(this.selectedArr);
			},
			toPay() {
				this.setConsumeSelected(this.selectedArr);
				util.goUrl({
					url: './createConsume'
				});
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
        }
    }
</script>
