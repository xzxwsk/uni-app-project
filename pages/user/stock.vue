<template>
    <view class="bonus">
		<view class="search_box">
			<text class="label">查询年月：</text>
			<customDatePicker
				fields="month"
				:start="startDate"
				:end="endDate"
				:value="dateValue"
				@change="bindDateChange"
			></customDatePicker>
		</view>
		<view class="box">
			<t-table border="0">
				<t-tr font-size="14" color="#000" align="left">
					<t-th align="left"><text class="first_col">年月</text></t-th>
					<t-th align="left">库存类别</t-th>
					<t-th align="left">库存</t-th>
				</t-tr>
				<t-tr font-size="12" color="#5d6f61" align="right" v-for="item in tableList" :key="item.id">
					<t-td align="left"><text class="first_col">2018-08</text></t-td>
					<t-td align="left">{{ item.hobby }}</t-td>
					<t-td align="left">{{ item.age }}</t-td>
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
	// https://ext.dcloud.net.cn/plugin?id=220
	import customDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker';
	
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
            tTable, tTh, tTr, tTd, customDatePicker
        },
        data() {
            return {
				tableList: tableList,
				dateValue: '',
				startDate: '2010-01',
				endDate: '2199-12'
            }
        },
		onNavigationBarButtonTap(e) {
			// #ifdef APP-PLUS
			
			// #endif 
		},
        methods: {
			bindDateChange(value) {
				console.log('bindDateChange: ', value);
				this.dateValue = value;
			}
        }
    }
</script>
