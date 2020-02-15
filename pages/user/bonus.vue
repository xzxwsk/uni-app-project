<template>
    <view class="bonus">
		<view class="search_box">
			<text class="label">查询年月：</text>
			<view class="date_picker_box">
				<customDatePicker class="date_picker"
					fields="month"
					:start="startDate"
					:end="endDate"
					:value="dateValue"
					@change="bindDateChange"
				></customDatePicker>
			</view>
		</view>
		<block v-if="loaded">
			<view class="con" v-if="tableList.length < 1">
				<view class="no-data">
					<view class="no-img">
						<image style="width: 100%;" mode="widthFix" :src="imgSrc" @error="imageError"></image>
					</view>
					<view class="txt"><text>亲，还没有奖金数据~</text></view>
				</view>
			</view>
			<block v-else>
				<scroll-view :scroll-top="scrollTop" class="list" scroll-y @scroll="scroll" @scrolltolower="loadMore">
					<view class="box">
						<t-table border="0">
							<t-tr font-size="14" color="#000" align="left">
								<t-th align="left"><text class="first_col">年月</text></t-th>
								<t-th align="left">奖金类别</t-th>
								<t-th align="left">团队总奖金</t-th>
								<t-th align="left">个人奖金</t-th>
							</t-tr>
							<t-tr font-size="12" color="#5d6f61" align="right" v-for="(item, index) in tableList" :key="index">
								<t-td align="left"><text class="first_col">{{item.Year + '-' + item.Month}}</text></t-td>
								<t-td align="left">{{ ['直推', '团队'][item.BonusType] }}</t-td>
								<t-td align="left">{{ item.BonusType === 1 ? item.TeamBonus: '' }}</t-td>
								<t-td align="left">{{ item.PersonBonus }}</t-td>
							</t-tr>
						</t-table>
					</view>
				</scroll-view>
			</block>
		</block>
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
	import imgSrc from '@/static/images/no_data_d.png';
	
	const tableList = [{
                        id: 0,
                        name: '201908',
                        age: '直推',
                        hobby: '324'
                    },
                    {
                        id: 1,
                        name: '201908',
                        age: '团队',
                        hobby: '3432'
                    },
                    {
                        id: 2,
                        name: '201908',
                        age: '直推',
                        hobby: '3242'
                    },
                    {
                        id: 3,
                        name: '201908',
                        age: '团队',
                        hobby: '132'
                    },
					{
						id: 0,
						name: '201908',
						age: '直推',
						hobby: '324'
					},
					{
						id: 1,
						name: '201908',
						age: '团队',
						hobby: '3432'
					},
					{
						id: 2,
						name: '201908',
						age: '直推',
						hobby: '3242'
					},
					{
						id: 3,
						name: '201908',
						age: '团队',
						hobby: '132'
					},{
                        id: 0,
                        name: '201908',
                        age: '直推',
                        hobby: '324'
                    },
                    {
                        id: 1,
                        name: '201908',
                        age: '团队',
                        hobby: '3432'
                    },
                    {
                        id: 2,
                        name: '201908',
                        age: '直推',
                        hobby: '3242'
                    },
                    {
                        id: 3,
                        name: '201908',
                        age: '团队',
                        hobby: '132'
                    },
					{
						id: 0,
						name: '201908',
						age: '直推',
						hobby: '324'
					},
					{
						id: 1,
						name: '201908',
						age: '团队',
						hobby: '3432'
					},
					{
						id: 2,
						name: '201908',
						age: '直推',
						hobby: '3242'
					},
					{
						id: 3,
						name: '201908',
						age: '团队',
						hobby: '132'
					},{
                        id: 0,
                        name: '201908',
                        age: '直推',
                        hobby: '324'
                    },
                    {
                        id: 1,
                        name: '201908',
                        age: '团队',
                        hobby: '3432'
                    },
                    {
                        id: 2,
                        name: '201908',
                        age: '直推',
                        hobby: '3242'
                    },
                    {
                        id: 3,
                        name: '201908',
                        age: '团队',
                        hobby: '132'
                    },
					{
						id: 0,
						name: '201908',
						age: '直推',
						hobby: '324'
					},
					{
						id: 1,
						name: '201908',
						age: '团队',
						hobby: '3432'
					},
					{
						id: 2,
						name: '201908',
						age: '直推',
						hobby: '3242'
					},
					{
						id: 3,
						name: '201908',
						age: '团队',
						hobby: '132'
					}
                ]

    export default {
        components: {
            tTable, tTh, tTr, tTd, customDatePicker
        },
        data() {
            return {
				loaded: false,
				imgSrc: imgSrc,
				isScroll: false,
				tableList: tableList,
				dateValue: '',
				startDate: '2010-01',
				endDate: '2199-12',
				scrollTop: 0,
				old: {
					scrollTop: 0
				}
            }
        },
		onNavigationBarButtonTap(e) {
			// #ifdef APP-PLUS
			
			// #endif 
		},
        methods: {
			init() {
				let curDate = this.dateValue.split('-');
				util.showLoading();
				util.ajax({
					method: 'Businese.QueryAppDAL.QueryMyBonus',
					params: {
						Year: Number(curDate[0]),
						Month: Number(curDate[1])
					},
					tags: {
						usertoken: this.openid
					}
				})
				.then(res => {
					util.hideLoading();
					let data = res.data.result;
					console.log('我的奖金: ', data);
					this.loaded = true;
					this.goTop();
					this.tableList = data;
				});
			},
			bindDateChange(value) {
				this.dateValue = value;
				util.showLoading();
				this.init();
			},
			loadMore(e) {
				console.log('loadMore: ', e);
				this.isScroll = true;
			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
			},
			imageError(e) {
				console.log('image发生error事件，携带值为' + e.detail.errMsg)
			}
        }
    }
</script>
