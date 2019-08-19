<template>
    <view class="bonus">
		<view class="box">
			<t-table border="0">
				<t-tr font-size="14" color="#000" align="left">
					<t-th align="left"><text class="first_col">日期</text></t-th>
					<t-th align="left">资金类别</t-th>
					<t-th align="left">摘要</t-th>
					<t-th align="left">金额</t-th>
					<t-th align="left">备注</t-th>
					<t-th align="left">操作</t-th>
				</t-tr>
				<t-tr font-size="12" color="#5d6f61" align="right" v-for="item in tableList" :key="item.id">
					<t-td align="left"><text class="first_col">{{ item.name }}</text></t-td>
					<t-td align="left">{{ item.age }}</t-td>
					<t-td align="left">{{ item.hobby }}</t-td>
					<t-td align="left">2134</t-td>
					<t-td align="left">{{ item.hobby }}</t-td>
					<t-td align="left"><view @click="refund(item.id)" class="a">退款</view></t-td>
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
	
	const tableList = [{
                        id: 0,
                        name: '201801',
                        age: '直推',
                        hobby: '游泳'
                    },
                    {
                        id: 1,
                        name: '201802',
                        age: '团队',
                        hobby: '绘画'
                    },
                    {
                        id: 2,
                        name: '201803',
                        age: '团队',
                        hobby: '滑板'
                    },
                    {
                        id: 3,
                        name: '201802',
                        age: '直推',
                        hobby: '蹦极'
                    }
                ]

    export default {
        components: {
            tTable, tTh, tTr, tTd
        },
        data() {
            return {
				tableList: tableList
            }
        },
        methods: {
			refund(id) {
				// 退款
				console.log(id);
				util.goUrl({
					url: '../order/createRefundOrder'
				})
			}
        }
    }
</script>
