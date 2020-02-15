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
			<t-table border="0">
				<t-tr font-size="14" color="#000" align="left">
					<t-th align="left"><text class="first_col">商品编号</text></t-th>
					<t-th align="left">商品名称</t-th>
					<t-th align="left">规格</t-th>
					<t-th align="left">计量单位</t-th>
					<t-th align="left">库存数量</t-th>
				</t-tr>
				<t-tr font-size="12" color="#5d6f61" align="right" v-for="item in tableList" :key="item.id">
					<t-td align="left"><text>{{item.ProductNo}}</text></t-td>
					<t-td align="left">{{item.ProductName}}</t-td>
					<t-td align="left">{{item.Spec}}</t-td>
					<t-td align="left">{{item.Unit}}</t-td>
					<t-td align="left">{{item.Qty}}</t-td>
				</t-tr>
			</t-table>
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
	import imgSrc from '@/static/images/no_data_d.png';
	
	const tableList = [{
                        id: 0,
                        name: '张三',
                        age: '19',
                        hobby: '游泳'
                    },
                    {
                        id: 1,
                        name: '李四',
                        age: '21',
                        hobby: '绘画'
                    },
                    {
                        id: 2,
                        name: '王二',
                        age: '29',
                        hobby: '滑板'
                    },
                    {
                        id: 3,
                        name: '码字',
                        age: '20',
                        hobby: '蹦极'
                    }
                ]

    export default {
        components: {
            tTable, tTh, tTr, tTd
        },
        data() {
            return {
				loaded: false,
				tableList: [],
				imgSrc: imgSrc
            }
        },
		onNavigationBarButtonTap(e) {
			// #ifdef APP-PLUS
			
			// #endif 
		},
		mounted() {
			util.showLoading();
			this.init();
		},
        methods: {
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
					let data = res.data.result;
					console.log('我的库存: ', data);
					this.loaded = true;
					this.tableList = data;
				});
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
        }
    }
</script>
